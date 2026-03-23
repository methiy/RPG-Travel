import type { DecryptedAIConfig } from './ai-auth'
import type { H3Event } from 'h3'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | Array<{ type: string; text?: string; source?: unknown; image_url?: unknown }>
}

interface AIRequestOptions {
  messages: ChatMessage[]
  maxTokens?: number
  temperature?: number
  stream?: boolean
}

interface AIResponse {
  content: string
}

/**
 * 非流式调用 AI（用于行程优化、照片分析等）
 */
export async function callAI(config: DecryptedAIConfig, options: AIRequestOptions): Promise<AIResponse> {
  const { provider } = config

  if (provider === 'claude') {
    return callClaude(config, options)
  }
  // OpenAI and DeepSeek use the same format
  return callOpenAICompatible(config, options)
}

/**
 * 流式调用 AI（SSE）, 写入 H3Event response
 */
export async function streamAI(config: DecryptedAIConfig, options: AIRequestOptions, event: H3Event): Promise<void> {
  const { provider } = config

  // Set SSE headers
  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })

  if (provider === 'claude') {
    await streamClaude(config, options, event)
  } else {
    await streamOpenAICompatible(config, options, event)
  }
}

// ── OpenAI / DeepSeek compatible ────────────────────────

async function callOpenAICompatible(config: DecryptedAIConfig, options: AIRequestOptions): Promise<AIResponse> {
  const url = `${config.baseUrl}/chat/completions`

  const body = {
    model: config.model,
    messages: options.messages,
    max_tokens: options.maxTokens || 4096,
    temperature: options.temperature ?? 0.7,
    stream: false,
  }

  const response = await $fetch<{ choices: Array<{ message: { content: string } }> }>(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body,
  })

  return { content: response.choices[0]?.message?.content || '' }
}

async function streamOpenAICompatible(config: DecryptedAIConfig, options: AIRequestOptions, event: H3Event): Promise<void> {
  const url = `${config.baseUrl}/chat/completions`

  const body = {
    model: config.model,
    messages: options.messages,
    max_tokens: options.maxTokens || 4096,
    temperature: options.temperature ?? 0.7,
    stream: true,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errText = await response.text()
    const msg = tryParseError(errText) || `AI 请求失败 (${response.status})`
    event.node.res.write(`data: ${JSON.stringify({ error: msg })}\n\n`)
    event.node.res.end()
    return
  }

  const reader = response.body?.getReader()
  if (!reader) {
    event.node.res.write(`data: ${JSON.stringify({ error: '无法读取 AI 响应流' })}\n\n`)
    event.node.res.end()
    return
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue
        const data = trimmed.slice(6)
        if (data === '[DONE]') {
          event.node.res.write(`data: [DONE]\n\n`)
          continue
        }
        try {
          const json = JSON.parse(data)
          const content = json.choices?.[0]?.delta?.content
          if (content) {
            event.node.res.write(`data: ${JSON.stringify({ text: content })}\n\n`)
          }
        } catch {
          // skip unparseable lines
        }
      }
    }
  } finally {
    reader.releaseLock()
    event.node.res.end()
  }
}

// ── Claude (Anthropic) ──────────────────────────────────

async function callClaude(config: DecryptedAIConfig, options: AIRequestOptions): Promise<AIResponse> {
  const url = `${config.baseUrl}/v1/messages`

  // Separate system message
  const systemMsg = options.messages.find(m => m.role === 'system')
  const nonSystemMsgs = options.messages.filter(m => m.role !== 'system')

  const body: Record<string, unknown> = {
    model: config.model,
    max_tokens: options.maxTokens || 4096,
    temperature: options.temperature ?? 0.7,
    messages: nonSystemMsgs,
  }
  if (systemMsg) {
    body.system = typeof systemMsg.content === 'string' ? systemMsg.content : JSON.stringify(systemMsg.content)
  }

  const response = await $fetch<{ content: Array<{ type: string; text: string }> }>(url, {
    method: 'POST',
    headers: {
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body,
  })

  const text = response.content?.filter(c => c.type === 'text').map(c => c.text).join('') || ''
  return { content: text }
}

async function streamClaude(config: DecryptedAIConfig, options: AIRequestOptions, event: H3Event): Promise<void> {
  const url = `${config.baseUrl}/v1/messages`

  const systemMsg = options.messages.find(m => m.role === 'system')
  const nonSystemMsgs = options.messages.filter(m => m.role !== 'system')

  const body: Record<string, unknown> = {
    model: config.model,
    max_tokens: options.maxTokens || 4096,
    temperature: options.temperature ?? 0.7,
    messages: nonSystemMsgs,
    stream: true,
  }
  if (systemMsg) {
    body.system = typeof systemMsg.content === 'string' ? systemMsg.content : JSON.stringify(systemMsg.content)
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errText = await response.text()
    const msg = tryParseError(errText) || `AI 请求失败 (${response.status})`
    event.node.res.write(`data: ${JSON.stringify({ error: msg })}\n\n`)
    event.node.res.end()
    return
  }

  const reader = response.body?.getReader()
  if (!reader) {
    event.node.res.write(`data: ${JSON.stringify({ error: '无法读取 AI 响应流' })}\n\n`)
    event.node.res.end()
    return
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()

        // Claude sends event: type\ndata: json
        if (trimmed.startsWith('data: ')) {
          const data = trimmed.slice(6)
          try {
            const json = JSON.parse(data)

            if (json.type === 'content_block_delta' && json.delta?.type === 'text_delta') {
              event.node.res.write(`data: ${JSON.stringify({ text: json.delta.text })}\n\n`)
            } else if (json.type === 'message_stop') {
              event.node.res.write(`data: [DONE]\n\n`)
            } else if (json.type === 'error') {
              event.node.res.write(`data: ${JSON.stringify({ error: json.error?.message || 'AI 错误' })}\n\n`)
            }
          } catch {
            // skip unparseable lines
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
    event.node.res.end()
  }
}

// ── Helpers ─────────────────────────────────────────────

function tryParseError(text: string): string | null {
  try {
    const json = JSON.parse(text)
    return json.error?.message || json.error?.type || null
  } catch {
    return null
  }
}

/**
 * Build vision content for photo analysis
 */
export function buildVisionMessage(
  config: DecryptedAIConfig,
  imageDataUrl: string,
  prompt: string,
): ChatMessage {
  if (config.provider === 'claude') {
    // Claude vision format
    const match = imageDataUrl.match(/^data:(image\/\w+);base64,(.+)$/)
    if (!match) {
      return { role: 'user', content: prompt }
    }
    return {
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: match[1],
            data: match[2],
          },
        },
        { type: 'text', text: prompt },
      ],
    }
  }

  // OpenAI vision format
  return {
    role: 'user',
    content: [
      {
        type: 'image_url',
        image_url: { url: imageDataUrl },
      },
      { type: 'text', text: prompt },
    ],
  }
}
