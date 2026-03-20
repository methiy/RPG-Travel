import { findUserByUsername } from '../../database/index'
import { verifyPassword } from '../../utils/password'
import { setAuthCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body ?? {}

  if (!username || !password) {
    throw createError({ statusCode: 400, message: '请输入用户名和密码' })
  }

  const user = await findUserByUsername(username)
  if (!user) {
    throw createError({ statusCode: 401, message: '用户名或密码错误' })
  }

  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) {
    throw createError({ statusCode: 401, message: '用户名或密码错误' })
  }

  setAuthCookie(event, user.id)

  return {
    user: { id: user.id, username: user.username, displayName: user.display_name },
  }
})
