import { useDB } from '../../database/index'

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      message: '未登录',
    })
  }

  const db = await useDB()
  const userId = event.context.user.id

  const stmt = db.prepare(
    'SELECT exp, completed, medals FROM game_progress WHERE user_id = :userId',
  )
  stmt.bind({ ':userId': userId })
  const found = stmt.step()
  const row = found
    ? (stmt.getAsObject() as { exp: number; completed: string; medals: string })
    : null
  stmt.free()

  if (!row) {
    // Return empty defaults if no progress row exists yet
    return { exp: 0, completed: [], medals: [] }
  }

  return {
    exp: row.exp,
    completed: JSON.parse(row.completed ?? '[]'),
    medals: JSON.parse(row.medals ?? '[]'),
  }
})
