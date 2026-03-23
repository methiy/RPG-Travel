import { getAISettings } from '../database/index'
import { decrypt } from './crypto'

export interface DecryptedAIConfig {
  provider: string
  apiKey: string
  baseUrl: string
  model: string
}

/**
 * 从数据库读取并解密用户的 AI 配置
 */
export async function getUserAIConfig(userId: number): Promise<DecryptedAIConfig> {
  const settings = await getAISettings(userId)
  if (!settings) {
    throw createError({ statusCode: 400, statusMessage: '请先在设置页配置 AI' })
  }

  const config = useRuntimeConfig()
  const secret = config.authSecret as string
  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: '服务器配置错误' })
  }

  let apiKey: string
  try {
    apiKey = decrypt(settings.apiKey, secret)
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'AI 密钥解密失败，请重新配置' })
  }

  // Determine default base URL and model
  const defaults = getProviderDefaults(settings.provider)

  return {
    provider: settings.provider,
    apiKey,
    baseUrl: settings.baseUrl || defaults.baseUrl,
    model: settings.model || defaults.model,
  }
}

function getProviderDefaults(provider: string): { baseUrl: string; model: string } {
  switch (provider) {
    case 'openai':
      return { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' }
    case 'claude':
      return { baseUrl: 'https://api.anthropic.com', model: 'claude-sonnet-4-20250514' }
    case 'deepseek':
      return { baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' }
    case 'gemini':
      return { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-2.0-flash' }
    default:
      return { baseUrl: '', model: '' }
  }
}
