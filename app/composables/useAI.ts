import type { AIChatMessage, AIPhotoAnalysis, CountryGuide, CityGuide } from '~/types'

interface AIState {
  configured: boolean
  loading: boolean
  error: string | null
}

// Session-level cache for AI generated guides
const guideCache = new Map<string, CountryGuide | CityGuide>()

export function useAI() {
  const state = useState<AIState>('ai-state', () => ({
    configured: false,
    loading: false,
    error: null,
  }))

  // Check if AI is configured
  async function checkConfigured(): Promise<boolean> {
    try {
      const data = await $fetch<{ configured: boolean }>('/api/user/ai-settings')
      state.value.configured = data.configured
      return data.configured
    } catch {
      state.value.configured = false
      return false
    }
  }

  // Stream guide generation (country or city)
  function generateGuide(
    type: 'country' | 'city',
    name: string,
    countryName?: string,
    onChunk: (text: string) => void = () => {},
    onDone: (fullText: string) => void = () => {},
    onError: (err: string) => void = () => {},
  ): { abort: () => void } {
    const controller = new AbortController()
    let fullText = ''

    state.value.loading = true
    state.value.error = null

    const fetchStream = async () => {
      try {
        const response = await fetch('/api/ai/generate-guide', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, name, countryName }),
          signal: controller.signal,
        })

        if (!response.ok) {
          const errData = await response.json().catch(() => ({ statusMessage: '请求失败' }))
          throw new Error(errData.statusMessage || errData.message || `请求失败 (${response.status})`)
        }

        const reader = response.body?.getReader()
        if (!reader) throw new Error('无法读取响应流')

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data: ')) continue
            const data = trimmed.slice(6)
            if (data === '[DONE]') continue

            try {
              const json = JSON.parse(data)
              if (json.error) {
                onError(json.error)
                return
              }
              if (json.text) {
                fullText += json.text
                onChunk(json.text)
              }
            } catch {
              // skip
            }
          }
        }

        onDone(fullText)
      } catch (err: unknown) {
        if ((err as Error).name === 'AbortError') return
        const message = (err as Error).message || 'AI 请求失败'
        state.value.error = message
        onError(message)
      } finally {
        state.value.loading = false
      }
    }

    fetchStream()

    return {
      abort: () => controller.abort(),
    }
  }

  // Optimize itinerary
  async function optimizeItinerary(
    tasks: Array<{ name: string; city: string; difficulty: string; exp: number }>,
    city: string,
    country: string,
  ): Promise<string> {
    state.value.loading = true
    state.value.error = null

    try {
      const data = await $fetch<{ result: string }>('/api/ai/optimize-itinerary', {
        method: 'POST',
        body: { tasks, city, country },
      })
      return data.result
    } catch (err: unknown) {
      const message = (err as Error).message || 'AI 行程优化失败'
      state.value.error = message
      throw new Error(message)
    } finally {
      state.value.loading = false
    }
  }

  // Stream chat
  function chat(
    messages: AIChatMessage[],
    context: { country?: string; city?: string } = {},
    onChunk: (text: string) => void = () => {},
    onDone: (fullText: string) => void = () => {},
    onError: (err: string) => void = () => {},
  ): { abort: () => void } {
    const controller = new AbortController()
    let fullText = ''

    const fetchStream = async () => {
      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages, context }),
          signal: controller.signal,
        })

        if (!response.ok) {
          const errData = await response.json().catch(() => ({ statusMessage: '请求失败' }))
          throw new Error(errData.statusMessage || errData.message || `请求失败 (${response.status})`)
        }

        const reader = response.body?.getReader()
        if (!reader) throw new Error('无法读取响应流')

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data: ')) continue
            const data = trimmed.slice(6)
            if (data === '[DONE]') continue

            try {
              const json = JSON.parse(data)
              if (json.error) {
                onError(json.error)
                return
              }
              if (json.text) {
                fullText += json.text
                onChunk(json.text)
              }
            } catch {
              // skip
            }
          }
        }

        onDone(fullText)
      } catch (err: unknown) {
        if ((err as Error).name === 'AbortError') return
        onError((err as Error).message || 'AI 请求失败')
      }
    }

    fetchStream()

    return {
      abort: () => controller.abort(),
    }
  }

  // Analyze photo
  async function analyzePhoto(dataUrl: string, taskName: string): Promise<AIPhotoAnalysis> {
    state.value.loading = true
    state.value.error = null

    try {
      const data = await $fetch<{ analysis: AIPhotoAnalysis }>('/api/ai/analyze-photo', {
        method: 'POST',
        body: { dataUrl, taskName },
      })
      return data.analysis
    } catch (err: unknown) {
      const message = (err as Error).message || '照片分析失败'
      state.value.error = message
      throw new Error(message)
    } finally {
      state.value.loading = false
    }
  }

  // Cache helpers
  function getCachedGuide(key: string): CountryGuide | CityGuide | undefined {
    return guideCache.get(key)
  }

  function setCachedGuide(key: string, guide: CountryGuide | CityGuide): void {
    guideCache.set(key, guide)
  }

  return {
    state: readonly(state),
    checkConfigured,
    generateGuide,
    optimizeItinerary,
    chat,
    analyzePhoto,
    getCachedGuide,
    setCachedGuide,
  }
}
