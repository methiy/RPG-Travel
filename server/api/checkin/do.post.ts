import { recordDailyCheckin, getProgress, saveProgress } from '../../database/index'

const MILESTONES: Record<number, { medalId: string; exp: number }> = {
  7: { medalId: 'streak-7', exp: 50 },
  14: { medalId: 'streak-14', exp: 100 },
  30: { medalId: 'streak-30', exp: 200 },
}

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, message: '未登录' })
  }

  const userId = event.context.user.id
  const result = await recordDailyCheckin(userId)

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

  // Persist EXP and milestone medal directly to game_progress
  try {
    const progress = await getProgress(userId)
    const currentExp = progress?.exp ?? 0
    const currentMedals = progress?.medals ?? []
    const currentCompleted = progress?.completed ?? []

    const newMedals = milestone && !currentMedals.includes(milestone.medalId)
      ? [...currentMedals, milestone.medalId]
      : currentMedals

    await saveProgress(userId, currentExp + earned, currentCompleted, newMedals)
  } catch {
    // Non-fatal: frontend sync will eventually catch up
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
