import { getShareById } from '../../database/index'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing share ID' })
  }

  const share = await getShareById(id)
  if (!share) {
    throw createError({ statusCode: 404, statusMessage: 'Share not found' })
  }

  return {
    id: share.id,
    template: share.template,
    snapshot: share.snapshot,
    createdAt: share.created_at,
  }
})
