import { findUserById, getProgress, getUserPhotosLimited, type PrivacySettings, DEFAULT_PRIVACY_SETTINGS } from '../../database/index'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '')
  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' })
  }

  try {
    const user = await findUserById(id)
    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    const viewerId: number | null = event.context.user?.id ?? null
    const isSelf = viewerId === id
    const privacy: PrivacySettings = user.privacy_settings ?? { ...DEFAULT_PRIVACY_SETTINGS }

    // If profile is private and not self, return minimal info
    if (!privacy.profile_public && !isSelf) {
      return {
        id: user.id,
        displayName: user.display_name,
        isPrivate: true,
        createdAt: user.created_at,
      }
    }

    // Get progress data
    const progress = await getProgress(id)
    const exp = progress?.exp ?? 0
    const completed = progress?.completed ?? []
    const medals = progress?.medals ?? []

    // Build response based on privacy settings (self always sees everything)
    const result: Record<string, unknown> = {
      id: user.id,
      displayName: user.display_name,
      isPrivate: false,
      createdAt: user.created_at,
      exp,
      completedCount: completed.length,
      medalCount: medals.length,
    }

    if (isSelf) {
      result.privacySettings = privacy
    }

    // Stats (always show basic exp/counts above, detailed stats controlled by show_stats)
    if (isSelf || privacy.show_stats) {
      result.completed = completed
      result.medals = medals
      result.showStats = true
    } else {
      result.showStats = false
    }

    // Photos
    if (isSelf || privacy.show_photos) {
      const photos = await getUserPhotosLimited(id, 6)
      result.photos = photos.map(p => ({
        id: p.id,
        taskId: p.task_id,
        dataUrl: p.data_url,
        timestamp: p.timestamp,
        comment: p.comment,
      }))
      result.showPhotos = true
    } else {
      result.showPhotos = false
    }

    // Medals detail
    if (isSelf || privacy.show_medals) {
      result.showMedals = true
      // medals array already included in stats section if allowed
      if (!result.medals) {
        result.medals = medals
      }
    } else {
      result.showMedals = false
    }

    return result
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'statusCode' in err) throw err
    console.error('[user/id] Failed:', err)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch user profile' })
  }
})
