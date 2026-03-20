import { togglePhotoLike } from '../../database/index'

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, message: '未登录' })
  }

  const body = await readBody(event)
  const photoId = parseInt(body?.photoId)
  if (!photoId || isNaN(photoId)) {
    throw createError({ statusCode: 400, message: '无效的照片 ID' })
  }

  const result = await togglePhotoLike(event.context.user.id, photoId)

  return result
})
