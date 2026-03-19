import type { H3Event } from 'h3'
import { setCookie, getCookie, deleteCookie } from 'h3'
import { createHmac } from 'crypto'

const COOKIE_NAME = 'travelrpg_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function getSecret(): string {
  const config = useRuntimeConfig()
  const secret = config.authSecret as string | undefined
  if (!secret) throw new Error('AUTH_SECRET environment variable is required.')
  return secret
}

/**
 * Sign a value with HMAC-SHA256.
 * Returns "<value>.<signature>" (base64url signature).
 */
function sign(value: string, secret: string): string {
  const sig = createHmac('sha256', secret)
    .update(value)
    .digest('base64url')
  return `${value}.${sig}`
}

/**
 * Verify and unsign a signed value.
 * Returns the original value if the signature is valid, or null otherwise.
 */
function unsign(signed: string, secret: string): string | null {
  const lastDot = signed.lastIndexOf('.')
  if (lastDot === -1) return null

  const value = signed.slice(0, lastDot)
  const expected = sign(value, secret)

  // Constant-time comparison to prevent timing attacks
  if (signed.length !== expected.length) return null
  const a = Buffer.from(signed)
  const b = Buffer.from(expected)
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0 ? value : null
}

/**
 * Set a signed session cookie containing the userId.
 */
export function setAuthCookie(event: H3Event, userId: number): void {
  const secret = getSecret()
  const payload = String(userId)
  const signed = sign(payload, secret)

  setCookie(event, COOKIE_NAME, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

/**
 * Read the session cookie and return the authenticated userId,
 * or null if absent / tampered.
 */
export function getAuthUserId(event: H3Event): number | null {
  const signed = getCookie(event, COOKIE_NAME)
  if (!signed) return null

  let secret: string
  try {
    secret = getSecret()
  } catch {
    return null
  }

  const value = unsign(signed, secret)
  if (!value) return null

  const id = parseInt(value, 10)
  return Number.isFinite(id) ? id : null
}

/**
 * Delete the session cookie (logout).
 */
export function clearAuthCookie(event: H3Event): void {
  deleteCookie(event, COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}
