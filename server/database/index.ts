import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import initSqlJs, { type Database } from 'sql.js'

const DB_DIR = resolve('data')
const DB_PATH = resolve('data/travelrpg.db')

// Wasmfile path — Nitro bundles node_modules so we resolve at runtime
const WASM_PATH = resolve('node_modules/sql.js/dist/sql-wasm.wasm')

let db: Database | null = null
let initPromise: Promise<Database> | null = null

const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_progress (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  exp INTEGER DEFAULT 0,
  completed TEXT DEFAULT '[]',
  medals TEXT DEFAULT '[]',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`

async function initDB(): Promise<Database> {
  // Ensure data/ directory exists
  if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true })
  }

  const SQL = await initSqlJs({
    // Provide the wasm binary directly so sql.js doesn't try to fetch it
    wasmBinary: readFileSync(WASM_PATH),
  })

  let database: Database

  if (existsSync(DB_PATH)) {
    // Load existing database from disk
    const fileBuffer = readFileSync(DB_PATH)
    database = new SQL.Database(fileBuffer)
  } else {
    // Create a fresh database
    database = new SQL.Database()
  }

  // Create tables if they don't exist
  database.run(CREATE_TABLES_SQL)

  // Persist immediately so the file exists from the start
  saveDB(database)

  return database
}

/**
 * Persist the in-memory sql.js database to disk.
 * Must be called after every mutation.
 */
export function saveDB(database?: Database): void {
  const target = database ?? db
  if (!target) return
  const data = target.export()
  writeFileSync(DB_PATH, Buffer.from(data))
}

/**
 * Returns the singleton database instance.
 * Initialises on first call; subsequent calls return the cached instance.
 */
export async function useDB(): Promise<Database> {
  if (db) return db

  // Deduplicate concurrent init calls
  if (!initPromise) {
    initPromise = initDB().then((database) => {
      db = database
      return database
    })
  }

  return initPromise
}
