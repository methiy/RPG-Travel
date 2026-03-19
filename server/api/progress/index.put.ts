import { saveProgress } from '../../database/index'

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, message: '未登录' })
  }

  const body = await readBody(event)
  const { exp, completed, medals } = body ?? {}

  if (!Number.isInteger(exp) || exp < 0) {
    throw createError({ statusCode: 400, message: 'exp必须是非负整数' })
  }
  if (!Array.isArray(completed) || completed.length > 5000 || completed.some((v: unknown) => typeof v !== 'string')) {
    throw createError({ statusCode: 400, message: 'completed必须是字符串数组（最多5000项）' })
  }
  if (!Array.isArray(medals) || medals.length > 1000 || medals.some((v: unknown) => typeof v !== 'string')) {
    throw createError({ statusCode: 400, message: 'medals必须是字符串数组（最多1000项）' })
  }

  saveProgress(event.context.user.id, exp, completed, medals)

  return { success: true }
})
