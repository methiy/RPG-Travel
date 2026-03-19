import { useDB, saveDB } from '../../database/index'

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      message: '未登录',
    })
  }

  const body = await readBody(event)
  const { exp, completed, medals } = body ?? {}

  // ── Validation ────────────────────────────────────────────────────────────
  if (!Number.isInteger(exp) || exp < 0) {
    throw createError({
      statusCode: 400,
      message: 'exp必须是非负整数',
    })
  }

  if (
    !Array.isArray(completed) ||
    completed.length > 5000 ||
    completed.some((v: unknown) => typeof v !== 'string')
  ) {
    throw createError({
      statusCode: 400,
      message: 'completed必须是字符串数组（最多5000项）',
    })
  }

  if (
    !Array.isArray(medals) ||
    medals.length > 1000 ||
    medals.some((v: unknown) => typeof v !== 'string')
  ) {
    throw createError({
      statusCode: 400,
      message: 'medals必须是字符串数组（最多1000项）',
    })
  }

  const db = await useDB()
  const userId = event.context.user.id

  // ── UPSERT ─────────────────────────────────────────────────────────────────
  db.run(
    `INSERT INTO game_progress (user_id, exp, completed, medals, updated_at)
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id) DO UPDATE SET
       exp = excluded.exp,
       completed = excluded.completed,
       medals = excluded.medals,
       updated_at = excluded.updated_at`,
    [userId, exp, JSON.stringify(completed), JSON.stringify(medals)],
  )

  saveDB()

  return { success: true }
})
