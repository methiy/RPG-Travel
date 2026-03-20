import { findUserByUsername, createUser } from '../../database/index'
import { hashPassword } from '../../utils/password'
import { setAuthCookie } from '../../utils/auth'

const USERNAME_RE = /^[a-zA-Z0-9_]{2,20}$/

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password, displayName } = body ?? {}

  if (!username || !USERNAME_RE.test(username)) {
    throw createError({ statusCode: 400, message: '用户名必须为2-20位字母、数字或下划线' })
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    throw createError({ statusCode: 400, message: '密码至少需要6个字符' })
  }
  if (!displayName || typeof displayName !== 'string' || displayName.trim().length < 1 || displayName.trim().length > 20) {
    throw createError({ statusCode: 400, message: '显示名称必须为1-20个字符' })
  }

  const trimmedDisplayName = displayName.trim()

  const existing = await findUserByUsername(username)
  if (existing) {
    throw createError({ statusCode: 409, message: '该用户名已被占用' })
  }

  const passwordHash = await hashPassword(password)
  const user = await createUser(username, trimmedDisplayName, passwordHash)

  setAuthCookie(event, user.id)

  return {
    user: { id: user.id, username, displayName: trimmedDisplayName },
  }
})
