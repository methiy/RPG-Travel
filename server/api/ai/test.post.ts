import { getUserAIConfig } from '../../utils/ai-auth'
import { callAI } from '../../utils/ai-client'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: '请先登录' })
  }

  const config = await getUserAIConfig(user.id)

  try {
    const result = await callAI(config, {
      messages: [
        { role: 'system', content: '你是一个旅行助手。请用中文回复。' },
        { role: 'user', content: '请用一句话打个招呼，证明你可以正常工作。' },
      ],
      maxTokens: 100,
      temperature: 0.8,
    })

    return {
      success: true,
      message: result.content,
      provider: config.provider,
      model: config.model,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI 连接失败'
    // Filter out sensitive info
    const safeMessage = message.includes('API key')
      ? 'API Key 无效，请检查后重试'
      : message.includes('401') || message.includes('403')
        ? 'API Key 认证失败，请检查 Key 是否正确'
        : message.includes('404')
          ? '模型或 API 地址不正确，请检查配置'
          : `AI 连接失败: ${message.slice(0, 100)}`

    return {
      success: false,
      message: safeMessage,
    }
  }
})
