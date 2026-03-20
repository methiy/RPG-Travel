import { findUserById, DEFAULT_PRIVACY_SETTINGS } from '../../database/index'

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const user = await findUserById(userId)
    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    return {
      settings: user.privacy_settings ?? { ...DEFAULT_PRIVACY_SETTINGS },
    }
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'statusCode' in err) throw err
    console.error('[user/settings GET] Failed:', err)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch settings' })
  }
})
