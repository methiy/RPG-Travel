import { getUserAIConfig } from '../../utils/ai-auth'
import { streamAI } from '../../utils/ai-client'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: '请先登录' })
  }

  const body = await readBody(event)
  const { messages, context } = body

  if (!messages?.length) {
    throw createError({ statusCode: 400, statusMessage: '缺少消息内容' })
  }

  const config = await getUserAIConfig(user.id)

  // Build context-aware system prompt
  let contextInfo = ''
  if (context?.country) contextInfo += `用户当前正在浏览「${context.country}」`
  if (context?.city) contextInfo += `的「${context.city}」`

  const systemPrompt = `你是「旅行者传说」的 AI 旅行助手。你精通全球旅游知识，可以回答关于目的地、签证、交通、美食、住宿、文化等各种旅行问题。

${contextInfo ? `当前上下文: ${contextInfo}。请优先围绕这个目的地回答。` : ''}

要求：
1. 用中文回复
2. 回答简洁实用，避免空泛
3. 多给出具体建议（地名、价格、时间等）
4. 涉及安全问题时给出详细提醒
5. 适当使用 emoji 使回答更生动
6. 如果不确定某些实时信息（如价格、政策），请提醒用户进一步核实`

  const allMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages.slice(-20), // Limit context window
  ]

  await streamAI(config, {
    messages: allMessages,
    maxTokens: 2048,
    temperature: 0.7,
    stream: true,
  }, event)
})
