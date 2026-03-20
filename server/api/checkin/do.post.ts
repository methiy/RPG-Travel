import { recordDailyCheckin } from '../../database/index'

const MILESTONES: Record<number, { medalId: string; exp: number }> = {
  7: { medalId: 'streak-7', exp: 50 },
  14: { medalId: 'streak-14', exp: 100 },
  30: { medalId: 'streak-30', exp: 200 },
}

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, message: '未登录' })
  }

  const result = await recordDailyCheckin(event.context.user.id)

  if (result.alreadyDone) {
    return {
      alreadyDone: true,
      earned: 0,
      streak: result.streak,
      total: result.total,
      maxStreak: result.maxStreak,
      milestone: null,
    }
  }

  // Calculate EXP: base 10 + (streak - 1) * 2, capped so bonus <= 40 (i.e. max total 50)
  const bonus = Math.min((result.streak - 1) * 2, 40)
  let earned = 10 + bonus

  // Check milestone
  const milestone = MILESTONES[result.streak] ?? null
  if (milestone) {
    earned += milestone.exp
  }

  return {
    alreadyDone: false,
    earned,
    streak: result.streak,
    total: result.total,
    maxStreak: result.maxStreak,
    milestone: milestone ? { medalId: milestone.medalId, exp: milestone.exp } : null,
  }
})
