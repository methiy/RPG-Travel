import { clearAuthCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      message: '未登录',
    })
  }

  clearAuthCookie(event)

  return { success: true }
})
