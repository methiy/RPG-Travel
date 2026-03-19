import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

const DB_DIR = resolve('data')
const DB_PATH = resolve('data/travelrpg.json')

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

interface DBData {
  users: UserRecord[]
  game_progress: ProgressRecord[]
  nextUserId: number
}

let data: DBData | null = null

function defaultData(): DBData {
  return { users: [], game_progress: [], nextUserId: 1 }
}

function loadData(): DBData {
  if (data) return data

  if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true })
  }

  if (existsSync(DB_PATH)) {
    try {
      const raw = readFileSync(DB_PATH, 'utf-8')
      data = JSON.parse(raw) as DBData
    } catch {
      data = defaultData()
    }
  } else {
    data = defaultData()
  }

  return data
}

function saveData(): void {
  if (!data) return
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

// ---- Public API ----

export function findUserByUsername(username: string): UserRecord | undefined {
  const db = loadData()
  return db.users.find(u => u.username === username)
}

export function findUserById(id: number): UserRecord | undefined {
  const db = loadData()
  return db.users.find(u => u.id === id)
}

export function createUser(username: string, displayName: string, passwordHash: string): UserRecord {
  const db = loadData()
  const user: UserRecord = {
    id: db.nextUserId++,
    username,
    display_name: displayName,
    password_hash: passwordHash,
    created_at: new Date().toISOString(),
  }
  db.users.push(user)

  // Create empty progress
  db.game_progress.push({
    user_id: user.id,
    exp: 0,
    completed: [],
    medals: [],
    updated_at: new Date().toISOString(),
  })

  saveData()
  return user
}

export function getProgress(userId: number): ProgressRecord | undefined {
  const db = loadData()
  return db.game_progress.find(p => p.user_id === userId)
}

export function saveProgress(userId: number, exp: number, completed: string[], medals: string[]): void {
  const db = loadData()
  const idx = db.game_progress.findIndex(p => p.user_id === userId)
  const record: ProgressRecord = {
    user_id: userId,
    exp,
    completed,
    medals,
    updated_at: new Date().toISOString(),
  }

  if (idx >= 0) {
    db.game_progress[idx] = record
  } else {
    db.game_progress.push(record)
  }

  saveData()
}
