import { useDB } from '../../database/index'
import { verifyPassword } from '../../utils/password'
import { setAuthCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body ?? {}

  if (!username || !password) {
    throw createError({
      statusCode: 401,
      message: '用户名或密码错误',
    })
  }

  const db = await useDB()

  // ── Look up user ───────────────────────────────────────────────────────────
  const stmt = db.prepare(
    'SELECT id, username, display_name, password_hash FROM users WHERE username = :username',
  )
  stmt.bind({ ':username': username })
  const found = stmt.step()
  const row = found
    ? (stmt.getAsObject() as {
        id: number
        username: string
        display_name: string
        password_hash: string
      })
    : null
  stmt.free()

  if (!row) {
    throw createError({
      statusCode: 401,
      message: '用户名或密码错误',
    })
  }

  // ── Verify password ────────────────────────────────────────────────────────
  const valid = await verifyPassword(password, row.password_hash)
  if (!valid) {
    throw createError({
      statusCode: 401,
      message: '用户名或密码错误',
    })
  }

  setAuthCookie(event, row.id)

  return {
    user: {
      id: row.id,
      username: row.username,
      displayName: row.display_name,
    },
  }
})
