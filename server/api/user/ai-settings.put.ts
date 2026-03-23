import { saveAISettings } from '../../database/index'
import { encrypt } from '../../utils/crypto'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: '请先登录' })
  }

  const body = await readBody(event)
  const { provider, apiKey, baseUrl, model } = body

  if (!provider || !apiKey) {
    throw createError({ statusCode: 400, statusMessage: '请提供 AI 供应商和 API Key' })
  }

  const validProviders = ['openai', 'claude', 'deepseek']
  if (!validProviders.includes(provider)) {
    throw createError({ statusCode: 400, statusMessage: '不支持的 AI 供应商' })
  }

  // Encrypt the API key
  const config = useRuntimeConfig()
  const secret = config.authSecret as string
  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: '服务器配置错误' })
  }

  const encryptedKey = encrypt(apiKey, secret)

  await saveAISettings(user.id, {
    provider,
    apiKey: encryptedKey,
    baseUrl: baseUrl || undefined,
    model: model || undefined,
  })

  return {
    success: true,
    settings: {
      provider,
      apiKey: '***' + apiKey.slice(-4),
      baseUrl: baseUrl || '',
      model: model || '',
    },
  }
})
