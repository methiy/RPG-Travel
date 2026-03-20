import { getPublicFeed } from '../../database/index'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(Math.max(parseInt(query.limit as string) || 30, 1), 50)
  const offset = Math.max(parseInt(query.offset as string) || 0, 0)
  const viewerUserId: number | null = event.context.user?.id ?? null

  try {
    const photos = await getPublicFeed(viewerUserId, limit, offset)
    return { photos }
  } catch (err) {
    console.error('[feed] Query failed:', err)
    return { photos: [] }
  }
})
