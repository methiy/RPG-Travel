import { getLeaderboard } from '../../database/index'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const sortBy = (['exp', 'completed', 'medals'] as const).includes(query.sort as 'exp' | 'completed' | 'medals')
    ? (query.sort as 'exp' | 'completed' | 'medals')
    : 'exp'

  const limit = Math.min(Math.max(parseInt(query.limit as string) || 50, 1), 100)

  const currentUserId: number | null = event.context.user?.id ?? null

  try {
    const leaderboard = await getLeaderboard(sortBy, limit)
    return { leaderboard, currentUserId }
  } catch (err) {
    console.error('[leaderboard] Query failed:', err)
    return { leaderboard: [], currentUserId }
  }
})
