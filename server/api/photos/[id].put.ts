import { updatePhotoComment } from '../../database/index'

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, message: '未登录' })
  }

  const id = Number(getRouterParam(event, 'id'))
  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, message: '无效的照片 ID' })
  }

  const body = await readBody(event)
  const comment = typeof body?.comment === 'string' ? body.comment.slice(0, 500) : ''

  const row = await updatePhotoComment(event.context.user.id, id, comment)
  if (!row) {
    throw createError({ statusCode: 404, message: '照片不存在' })
  }

  return {
    id: row.id,
    taskId: row.task_id,
    dataUrl: row.data_url,
    timestamp: Number(row.timestamp),
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    comment: row.comment || '',
  }
})
