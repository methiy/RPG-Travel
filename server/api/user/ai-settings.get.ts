import { getAISettings } from '../../database/index'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: '请先登录' })
  }

  const settings = await getAISettings(user.id)

  if (!settings) {
    return { configured: false, settings: null }
  }

  // Mask the API key - only show last 4 chars
  const maskedKey = settings.apiKey
    ? '***' + settings.apiKey.slice(-8)
    : ''

  return {
    configured: true,
    settings: {
      provider: settings.provider,
      apiKey: maskedKey,
      baseUrl: settings.baseUrl || '',
      model: settings.model || '',
    },
  }
})
