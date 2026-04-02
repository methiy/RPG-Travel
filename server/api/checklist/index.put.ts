import { saveChecklist } from '../../database/index'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { countryId, completedItems } = body

  if (!countryId || !Array.isArray(completedItems)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body: need countryId and completedItems array' })
  }

  if (completedItems.length > 100) {
    throw createError({ statusCode: 400, statusMessage: 'Too many items' })
  }

  await saveChecklist(user.id, countryId, completedItems)
  return { ok: true }
})
