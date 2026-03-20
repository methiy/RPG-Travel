import { getDailyCheckin } from '../../database/index'

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, message: '未登录' })
  }

  const record = await getDailyCheckin(event.context.user.id)

  if (!record) {
    return { lastDate: null, streak: 0, total: 0, maxStreak: 0 }
  }

  return {
    lastDate: record.last_date,
    streak: record.streak,
    total: record.total,
    maxStreak: record.max_streak,
  }
})
