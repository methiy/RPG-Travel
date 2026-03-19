import type { H3Event } from 'h3'
import { getAuthUserId } from '../utils/auth'
import { findUserById } from '../database/index'

export default defineEventHandler((event: H3Event) => {
  event.context.user = null

  const userId = getAuthUserId(event)
  if (!userId) return

  try {
    const user = findUserById(userId)
    if (user) {
      event.context.user = {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
      }
    }
  } catch (err) {
    console.error('[auth middleware] DB lookup failed:', err)
    event.context.user = null
  }
})
