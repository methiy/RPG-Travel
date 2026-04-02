import { sql } from '@vercel/postgres'

export interface PrivacySettings {
  profile_public: boolean
  show_stats: boolean
  show_photos: boolean
  show_medals: boolean
}

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  profile_public: true,
  show_stats: true,
  show_photos: true,
  show_medals: true,
}

interface UserRecord {
  id: number
  username: string
  display_name: string
  password_hash: string
  privacy_settings: PrivacySettings
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

  try {
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

    await sql`
      CREATE TABLE IF NOT EXISTS photo_likes (
        user_id INTEGER NOT NULL REFERENCES users(id),
        photo_id INTEGER NOT NULL REFERENCES checkin_photos(id),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (user_id, photo_id)
      )
    `

    // Add privacy_settings column if it doesn't exist
    await sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{"profile_public":true,"show_stats":true,"show_photos":true,"show_medals":true}'
    `

    // Add ai_settings column if it doesn't exist
    await sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_settings JSONB DEFAULT NULL
    `

    await sql`
      CREATE TABLE IF NOT EXISTS shares (
        id VARCHAR(8) PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        template VARCHAR(20) NOT NULL,
        snapshot JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS checklists (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        country_id VARCHAR(50) NOT NULL,
        completed_items JSONB DEFAULT '[]',
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, country_id)
      )
    `
  } catch (err) {
    console.error('[initDB] Table creation failed:', err)
    // Still mark initialized to avoid infinite retry loops on every request
  }

  initialized = true
}

// ---- Public API ----

export async function findUserByUsername(username: string): Promise<UserRecord | undefined> {
  await initDB()
  const { rows } = await sql`SELECT * FROM users WHERE username = ${username} LIMIT 1`
  if (!rows[0]) return undefined
  const row = rows[0] as Record<string, unknown>
  return parseUserRow(row)
}

export async function findUserById(id: number): Promise<UserRecord | undefined> {
  await initDB()
  const { rows } = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`
  if (!rows[0]) return undefined
  const row = rows[0] as Record<string, unknown>
  return parseUserRow(row)
}

function parseUserRow(row: Record<string, unknown>): UserRecord {
  let privacy: PrivacySettings = { ...DEFAULT_PRIVACY_SETTINGS }
  if (row.privacy_settings) {
    const raw = typeof row.privacy_settings === 'string' ? JSON.parse(row.privacy_settings) : row.privacy_settings
    privacy = { ...DEFAULT_PRIVACY_SETTINGS, ...raw }
  }
  return {
    id: row.id as number,
    username: row.username as string,
    display_name: row.display_name as string,
    password_hash: row.password_hash as string,
    privacy_settings: privacy,
    created_at: row.created_at as string,
  }
}

export async function createUser(username: string, displayName: string, passwordHash: string): Promise<UserRecord> {
  await initDB()

  const { rows } = await sql`
    INSERT INTO users (username, display_name, password_hash)
    VALUES (${username}, ${displayName}, ${passwordHash})
    RETURNING *
  `
  const user = rows[0] as UserRecord | undefined
  if (!user) {
    throw new Error('Failed to create user: no row returned')
  }

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

// ---- Privacy Settings API ----

export async function updatePrivacySettings(userId: number, settings: Partial<PrivacySettings>): Promise<PrivacySettings> {
  await initDB()
  // Merge with defaults
  const user = await findUserById(userId)
  const current = user?.privacy_settings ?? { ...DEFAULT_PRIVACY_SETTINGS }
  const merged: PrivacySettings = { ...current, ...settings }
  const json = JSON.stringify(merged)
  await sql`UPDATE users SET privacy_settings = ${json}::jsonb WHERE id = ${userId}`
  return merged
}

/** Get user's photos (for public profile) - limited to recent N */
export async function getUserPhotosLimited(userId: number, limit: number = 6): Promise<PhotoRecord[]> {
  await initDB()
  const { rows } = await sql`
    SELECT * FROM checkin_photos WHERE user_id = ${userId} ORDER BY timestamp DESC LIMIT ${limit}
  `
  return rows as PhotoRecord[]
}

// ---- Leaderboard API ----

export interface LeaderboardEntry {
  rank: number
  userId: number
  displayName: string
  exp: number
  completedCount: number
  medalCount: number
}

export async function getLeaderboard(sortBy: 'exp' | 'completed' | 'medals' = 'exp', limit: number = 50): Promise<LeaderboardEntry[]> {
  await initDB()

  // Use separate queries for each sort type since template literals don't support dynamic ORDER BY
  let rows: Record<string, unknown>[]

  if (sortBy === 'completed') {
    const result = await sql`
      SELECT u.id as user_id, u.display_name, gp.exp,
             jsonb_array_length(gp.completed) as completed_count,
             jsonb_array_length(gp.medals) as medal_count
      FROM users u
      JOIN game_progress gp ON u.id = gp.user_id
      WHERE gp.exp > 0
      ORDER BY jsonb_array_length(gp.completed) DESC, gp.exp DESC
      LIMIT ${limit}
    `
    rows = result.rows as Record<string, unknown>[]
  } else if (sortBy === 'medals') {
    const result = await sql`
      SELECT u.id as user_id, u.display_name, gp.exp,
             jsonb_array_length(gp.completed) as completed_count,
             jsonb_array_length(gp.medals) as medal_count
      FROM users u
      JOIN game_progress gp ON u.id = gp.user_id
      WHERE gp.exp > 0
      ORDER BY jsonb_array_length(gp.medals) DESC, gp.exp DESC
      LIMIT ${limit}
    `
    rows = result.rows as Record<string, unknown>[]
  } else {
    const result = await sql`
      SELECT u.id as user_id, u.display_name, gp.exp,
             jsonb_array_length(gp.completed) as completed_count,
             jsonb_array_length(gp.medals) as medal_count
      FROM users u
      JOIN game_progress gp ON u.id = gp.user_id
      WHERE gp.exp > 0
      ORDER BY gp.exp DESC
      LIMIT ${limit}
    `
    rows = result.rows as Record<string, unknown>[]
  }

  return rows.map((row, idx) => ({
    rank: idx + 1,
    userId: row.user_id as number,
    displayName: row.display_name as string,
    exp: row.exp as number,
    completedCount: Number(row.completed_count),
    medalCount: Number(row.medal_count),
  }))
}

// ---- Public Photo Feed API ----

export interface PublicPhoto {
  id: number
  userId: number
  displayName: string
  taskId: string
  dataUrl: string
  timestamp: number
  comment: string
  likes: number
  likedByMe: boolean
}

export async function getPublicFeed(viewerUserId: number | null, limit: number = 30, offset: number = 0): Promise<PublicPhoto[]> {
  await initDB()

  const vid = viewerUserId ?? 0

  const { rows } = await sql`
    SELECT cp.id, cp.user_id, u.display_name, cp.task_id, cp.data_url, cp.timestamp, cp.comment,
           COALESCE(lc.cnt, 0) as likes,
           CASE WHEN ml.photo_id IS NOT NULL THEN true ELSE false END as liked_by_me
    FROM checkin_photos cp
    JOIN users u ON cp.user_id = u.id
    LEFT JOIN (SELECT photo_id, COUNT(*) as cnt FROM photo_likes GROUP BY photo_id) lc ON lc.photo_id = cp.id
    LEFT JOIN photo_likes ml ON ml.photo_id = cp.id AND ml.user_id = ${vid}
    ORDER BY cp.timestamp DESC
    LIMIT ${limit} OFFSET ${offset}
  `

  return (rows as Record<string, unknown>[]).map((row) => ({
    id: row.id as number,
    userId: row.user_id as number,
    displayName: row.display_name as string,
    taskId: row.task_id as string,
    dataUrl: row.data_url as string,
    timestamp: Number(row.timestamp),
    comment: (row.comment as string) || '',
    likes: Number(row.likes),
    likedByMe: row.liked_by_me as boolean,
  }))
}

export async function togglePhotoLike(userId: number, photoId: number): Promise<{ liked: boolean; likes: number }> {
  await initDB()

  // Check if already liked
  const { rows: existing } = await sql`
    SELECT 1 FROM photo_likes WHERE user_id = ${userId} AND photo_id = ${photoId}
  `

  if (existing.length > 0) {
    await sql`DELETE FROM photo_likes WHERE user_id = ${userId} AND photo_id = ${photoId}`
  } else {
    await sql`INSERT INTO photo_likes (user_id, photo_id) VALUES (${userId}, ${photoId})`
  }

  const { rows: countRows } = await sql`SELECT COUNT(*) as cnt FROM photo_likes WHERE photo_id = ${photoId}`
  const likes = Number(countRows[0]?.cnt ?? 0)

  return { liked: existing.length === 0, likes }
}

// ---- Daily Checkin API ---- (removed)

// ---- AI Settings API ----

export interface AISettingsRecord {
  provider: string
  apiKey: string          // encrypted
  baseUrl?: string
  model?: string
}

export async function getAISettings(userId: number): Promise<AISettingsRecord | null> {
  await initDB()
  const { rows } = await sql`SELECT ai_settings FROM users WHERE id = ${userId} LIMIT 1`
  if (!rows[0]) return null
  const raw = rows[0].ai_settings
  if (!raw) return null
  return (typeof raw === 'string' ? JSON.parse(raw) : raw) as AISettingsRecord
}

export async function saveAISettings(userId: number, settings: AISettingsRecord): Promise<void> {
  await initDB()
  const json = JSON.stringify(settings)
  await sql`UPDATE users SET ai_settings = ${json}::jsonb WHERE id = ${userId}`
}

// ---- Share/Export API ----

export interface ShareDBRecord {
  id: string
  user_id: number
  template: string
  snapshot: Record<string, unknown>
  created_at: string
}

function generateShareId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

export async function createShare(
  userId: number,
  template: string,
  snapshot: Record<string, unknown>,
): Promise<ShareDBRecord> {
  await initDB()

  // Check user share count limit (max 50)
  const { rows: countRows } = await sql`
    SELECT COUNT(*) as cnt FROM shares WHERE user_id = ${userId}
  `
  if (Number(countRows[0]?.cnt ?? 0) >= 50) {
    throw new Error('Share limit reached (max 50)')
  }

  const id = generateShareId()
  const snapshotJson = JSON.stringify(snapshot)

  const { rows } = await sql`
    INSERT INTO shares (id, user_id, template, snapshot)
    VALUES (${id}, ${userId}, ${template}, ${snapshotJson}::jsonb)
    RETURNING *
  `

  const row = rows[0] as Record<string, unknown>
  return {
    id: row.id as string,
    user_id: row.user_id as number,
    template: row.template as string,
    snapshot: (typeof row.snapshot === 'string' ? JSON.parse(row.snapshot) : row.snapshot) as Record<string, unknown>,
    created_at: row.created_at as string,
  }
}

export async function getShareById(id: string): Promise<ShareDBRecord | undefined> {
  await initDB()
  const { rows } = await sql`SELECT * FROM shares WHERE id = ${id} LIMIT 1`
  if (!rows[0]) return undefined
  const row = rows[0] as Record<string, unknown>
  return {
    id: row.id as string,
    user_id: row.user_id as number,
    template: row.template as string,
    snapshot: (typeof row.snapshot === 'string' ? JSON.parse(row.snapshot) : row.snapshot) as Record<string, unknown>,
    created_at: row.created_at as string,
  }
}

// ---- Checklist API ----

export async function getChecklist(userId: number, countryId: string): Promise<string[]> {
  await initDB()
  const { rows } = await sql`
    SELECT completed_items FROM checklists
    WHERE user_id = ${userId} AND country_id = ${countryId}
    LIMIT 1
  `
  if (!rows[0]) return []
  const raw = rows[0].completed_items
  return (typeof raw === 'string' ? JSON.parse(raw) : raw) as string[]
}

export async function saveChecklist(userId: number, countryId: string, completedItems: string[]): Promise<void> {
  await initDB()
  const json = JSON.stringify(completedItems)
  await sql`
    INSERT INTO checklists (user_id, country_id, completed_items, updated_at)
    VALUES (${userId}, ${countryId}, ${json}::jsonb, NOW())
    ON CONFLICT (user_id, country_id)
    DO UPDATE SET completed_items = ${json}::jsonb, updated_at = NOW()
  `
}
