import { sql } from '@vercel/postgres'

interface UserRecord {
  id: number
  username: string
  display_name: string
  password_hash: string
  created_at: string
}

interface ProgressRecord {
  user_id: number
  exp: number
  completed: string[]
  medals: string[]
  updated_at: string
}

interface PhotoRecord {
  id: number
  user_id: number
  task_id: string
  data_url: string
  timestamp: number
  lat: number | null
  lng: number | null
  comment: string
  created_at: string
}

let initialized = false

async function initDB(): Promise<void> {
  if (initialized) return

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      display_name VARCHAR(20) NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS game_progress (
      user_id INTEGER PRIMARY KEY REFERENCES users(id),
      exp INTEGER DEFAULT 0,
      completed JSONB DEFAULT '[]',
      medals JSONB DEFAULT '[]',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS daily_checkins (
      user_id INTEGER PRIMARY KEY REFERENCES users(id),
      last_date DATE,
      streak INTEGER DEFAULT 0,
      total INTEGER DEFAULT 0,
      max_streak INTEGER DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS checkin_photos (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      task_id VARCHAR(100) NOT NULL,
      data_url TEXT NOT NULL,
      timestamp BIGINT NOT NULL,
      lat DOUBLE PRECISION,
      lng DOUBLE PRECISION,
      comment TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, task_id)
    )
  `

  initialized = true
}

// ---- Public API ----

export async function findUserByUsername(username: string): Promise<UserRecord | undefined> {
  await initDB()
  const { rows } = await sql`SELECT * FROM users WHERE username = ${username} LIMIT 1`
  return rows[0] as UserRecord | undefined
}

export async function findUserById(id: number): Promise<UserRecord | undefined> {
  await initDB()
  const { rows } = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`
  return rows[0] as UserRecord | undefined
}

export async function createUser(username: string, displayName: string, passwordHash: string): Promise<UserRecord> {
  await initDB()

  const { rows } = await sql`
    INSERT INTO users (username, display_name, password_hash)
    VALUES (${username}, ${displayName}, ${passwordHash})
    RETURNING *
  `
  const user = rows[0] as UserRecord

  // Create empty progress
  await sql`
    INSERT INTO game_progress (user_id, exp, completed, medals)
    VALUES (${user.id}, 0, '[]'::jsonb, '[]'::jsonb)
  `

  return user
}

export async function getProgress(userId: number): Promise<ProgressRecord | undefined> {
  await initDB()
  const { rows } = await sql`SELECT * FROM game_progress WHERE user_id = ${userId} LIMIT 1`
  if (!rows[0]) return undefined

  const row = rows[0] as Record<string, unknown>
  return {
    user_id: row.user_id as number,
    exp: row.exp as number,
    completed: (typeof row.completed === 'string' ? JSON.parse(row.completed) : row.completed) as string[],
    medals: (typeof row.medals === 'string' ? JSON.parse(row.medals) : row.medals) as string[],
    updated_at: row.updated_at as string,
  }
}

export async function saveProgress(userId: number, exp: number, completed: string[], medals: string[]): Promise<void> {
  await initDB()

  const completedJson = JSON.stringify(completed)
  const medalsJson = JSON.stringify(medals)

  await sql`
    INSERT INTO game_progress (user_id, exp, completed, medals, updated_at)
    VALUES (${userId}, ${exp}, ${completedJson}::jsonb, ${medalsJson}::jsonb, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET exp = ${exp}, completed = ${completedJson}::jsonb, medals = ${medalsJson}::jsonb, updated_at = NOW()
  `
}

// ---- Photos API ----

export async function getUserPhotos(userId: number): Promise<PhotoRecord[]> {
  await initDB()
  const { rows } = await sql`
    SELECT * FROM checkin_photos WHERE user_id = ${userId} ORDER BY timestamp DESC
  `
  return rows as PhotoRecord[]
}

export async function savePhotoToDB(
  userId: number,
  photo: { taskId: string; dataUrl: string; timestamp: number; lat?: number; lng?: number; comment?: string },
): Promise<PhotoRecord> {
  await initDB()
  const { taskId, dataUrl, timestamp, lat, lng, comment } = photo
  const { rows } = await sql`
    INSERT INTO checkin_photos (user_id, task_id, data_url, timestamp, lat, lng, comment)
    VALUES (${userId}, ${taskId}, ${dataUrl}, ${timestamp}, ${lat ?? null}, ${lng ?? null}, ${comment ?? ''})
    ON CONFLICT (user_id, task_id)
    DO UPDATE SET data_url = ${dataUrl}, timestamp = ${timestamp},
      lat = COALESCE(${lat ?? null}, checkin_photos.lat),
      lng = COALESCE(${lng ?? null}, checkin_photos.lng),
      comment = COALESCE(${comment ?? null}, checkin_photos.comment)
    RETURNING *
  `
  return rows[0] as PhotoRecord
}

export async function updatePhotoComment(userId: number, photoId: number, comment: string): Promise<PhotoRecord | undefined> {
  await initDB()
  const { rows } = await sql`
    UPDATE checkin_photos SET comment = ${comment}
    WHERE id = ${photoId} AND user_id = ${userId}
    RETURNING *
  `
  return rows[0] as PhotoRecord | undefined
}

// ---- Daily Checkin API ----

interface DailyCheckinRecord {
  user_id: number
  last_date: string | null
  streak: number
  total: number
  max_streak: number
  updated_at: string
}

export async function getDailyCheckin(userId: number): Promise<DailyCheckinRecord | undefined> {
  await initDB()
  const { rows } = await sql`SELECT * FROM daily_checkins WHERE user_id = ${userId} LIMIT 1`
  return rows[0] as DailyCheckinRecord | undefined
}

export async function recordDailyCheckin(userId: number): Promise<{
  alreadyDone: boolean
  streak: number
  total: number
  maxStreak: number
}> {
  await initDB()

  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  const existing = await getDailyCheckin(userId)

  if (existing && existing.last_date === today) {
    return { alreadyDone: true, streak: existing.streak, total: existing.total, maxStreak: existing.max_streak }
  }

  let newStreak: number
  if (existing && existing.last_date === yesterday) {
    newStreak = existing.streak + 1
  } else {
    newStreak = 1
  }

  const newTotal = (existing?.total ?? 0) + 1
  const newMaxStreak = Math.max(existing?.max_streak ?? 0, newStreak)

  await sql`
    INSERT INTO daily_checkins (user_id, last_date, streak, total, max_streak, updated_at)
    VALUES (${userId}, ${today}, ${newStreak}, ${newTotal}, ${newMaxStreak}, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET last_date = ${today}, streak = ${newStreak}, total = ${newTotal}, max_streak = ${newMaxStreak}, updated_at = NOW()
  `

  return { alreadyDone: false, streak: newStreak, total: newTotal, maxStreak: newMaxStreak }
}
