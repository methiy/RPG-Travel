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
