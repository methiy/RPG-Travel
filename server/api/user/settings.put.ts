import { updatePrivacySettings, type PrivacySettings } from '../../database/index'

const VALID_KEYS: (keyof PrivacySettings)[] = [
  'profile_public',
  'show_stats',
  'show_photos',
  'show_medals',
  'show_checkin_streak',
]

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const body = await readBody(event)
    if (!body || typeof body !== 'object') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
    }

    // Only allow valid boolean keys
    const settings: Partial<PrivacySettings> = {}
    for (const key of VALID_KEYS) {
      if (key in body && typeof body[key] === 'boolean') {
        settings[key] = body[key]
      }
    }

    if (Object.keys(settings).length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid settings provided' })
    }

    const updated = await updatePrivacySettings(userId, settings)
    return { settings: updated }
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'statusCode' in err) throw err
    console.error('[user/settings PUT] Failed:', err)
    throw createError({ statusCode: 500, statusMessage: 'Failed to update settings' })
  }
})
