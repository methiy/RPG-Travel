import { useDB, saveDB } from '../../database/index'
import { hashPassword } from '../../utils/password'
import { setAuthCookie } from '../../utils/auth'

const USERNAME_RE = /^[a-zA-Z0-9_]{2,20}$/

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password, displayName } = body ?? {}

  // ── Validation ────────────────────────────────────────────────────────────
  if (!username || !USERNAME_RE.test(username)) {
    throw createError({
      statusCode: 400,
      message: '用户名必须为2-20位字母、数字或下划线',
    })
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    throw createError({
      statusCode: 400,
      message: '密码至少需要6个字符',
    })
  }

  if (
    !displayName ||
    typeof displayName !== 'string' ||
    displayName.trim().length < 1 ||
    displayName.trim().length > 20
  ) {
    throw createError({
      statusCode: 400,
      message: '显示名称必须为1-20个字符',
    })
  }

  const trimmedDisplayName = displayName.trim()
  const db = await useDB()

  // ── Uniqueness check ───────────────────────────────────────────────────────
  const checkStmt = db.prepare(
    'SELECT id FROM users WHERE username = :username',
  )
  checkStmt.bind({ ':username': username })
  const exists = checkStmt.step()
  checkStmt.free()

  if (exists) {
    throw createError({
      statusCode: 409,
      message: '该用户名已被占用',
    })
  }

  // ── Insert user ────────────────────────────────────────────────────────────
  const passwordHash = await hashPassword(password)

  db.run(
    'INSERT INTO users (username, display_name, password_hash) VALUES (?, ?, ?)',
    [username, trimmedDisplayName, passwordHash],
  )

  // Retrieve the newly created user's id
  const idStmt = db.prepare(
    'SELECT id FROM users WHERE username = :username',
  )
  idStmt.bind({ ':username': username })
  idStmt.step()
  const { id: userId } = idStmt.getAsObject() as { id: number }
  idStmt.free()

  // ── Seed empty game progress ───────────────────────────────────────────────
  db.run(
    "INSERT INTO game_progress (user_id, exp, completed, medals) VALUES (?, 0, '[]', '[]')",
    [userId],
  )

  saveDB()

  // ── Auto-login ─────────────────────────────────────────────────────────────
  setAuthCookie(event, userId)

  return {
    user: {
      id: userId,
      username,
      displayName: trimmedDisplayName,
    },
  }
})
