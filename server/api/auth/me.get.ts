export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      message: '未登录',
    })
  }

  return { user: event.context.user }
})
