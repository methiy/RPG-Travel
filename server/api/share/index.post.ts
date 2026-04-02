import { createShare } from '~/server/database'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { template, snapshot } = body

  if (!template || !snapshot) {
    throw createError({ statusCode: 400, statusMessage: 'Missing template or snapshot' })
  }

  const validTemplates = ['overview', 'trip', 'medals']
  if (!validTemplates.includes(template)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid template type' })
  }

  // Limit snapshot size (~500KB)
  const snapshotStr = JSON.stringify(snapshot)
  if (snapshotStr.length > 512_000) {
    throw createError({ statusCode: 400, statusMessage: 'Snapshot too large' })
  }

  try {
    const share = await createShare(user.id, template, snapshot)
    return { id: share.id }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (message.includes('Share limit reached')) {
      throw createError({ statusCode: 429, statusMessage: message })
    }
    throw createError({ statusCode: 500, statusMessage: 'Failed to create share' })
  }
})
