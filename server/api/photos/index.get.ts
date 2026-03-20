import { getUserPhotos } from '../../database/index'

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, message: '未登录' })
  }

  const rows = await getUserPhotos(event.context.user.id)

  return rows.map((r) => ({
    id: r.id,
    taskId: r.task_id,
    dataUrl: r.data_url,
    timestamp: Number(r.timestamp),
    lat: r.lat ?? undefined,
    lng: r.lng ?? undefined,
    comment: r.comment || '',
  }))
})
