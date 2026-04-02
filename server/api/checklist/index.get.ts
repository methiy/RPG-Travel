import { getChecklist } from '../../database/index'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const countryId = query.country as string
  if (!countryId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing country parameter' })
  }

  const completedItems = await getChecklist(user.id, countryId)
  return { countryId, completedItems }
})
