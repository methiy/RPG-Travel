import { savePhotoToDB } from '../../database/index'

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, message: '未登录' })
  }

  const body = await readBody(event)

  if (!body?.taskId || !body?.dataUrl || !body?.timestamp) {
    throw createError({ statusCode: 400, message: '缺少必填字段' })
  }

  const row = await savePhotoToDB(event.context.user.id, {
    taskId: body.taskId,
    dataUrl: body.dataUrl,
    timestamp: body.timestamp,
    lat: body.lat,
    lng: body.lng,
    comment: body.comment,
  })

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
