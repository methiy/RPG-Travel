import type { H3Event } from 'h3'
import { getAuthUserId } from '../utils/auth'
import { useDB } from '../database/index'

export default defineEventHandler(async (event: H3Event) => {
  // Default to no authenticated user
  event.context.user = null

  const userId = getAuthUserId(event)
  if (!userId) return

  try {
    const db = await useDB()

    const stmt = db.prepare(
      'SELECT id, username, display_name FROM users WHERE id = :id',
    )
    stmt.bind({ ':id': userId })

    if (stmt.step()) {
      const row = stmt.getAsObject() as {
        id: number
        username: string
        display_name: string
      }
      event.context.user = {
        id: row.id,
        username: row.username,
        displayName: row.display_name,
      }
    }

    stmt.free()
  } catch (err) {
    // Don't crash the request if the DB isn't ready yet
    console.error('[auth middleware] DB lookup failed:', err)
    event.context.user = null
  }
})
