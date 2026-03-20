import { getProgress } from '../../database/index'

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, message: '未登录' })
  }

  const progress = await getProgress(event.context.user.id)

  if (!progress) {
    return { exp: 0, completed: [], medals: [] }
  }

  return {
    exp: progress.exp,
    completed: progress.completed,
    medals: progress.medals,
  }
})
