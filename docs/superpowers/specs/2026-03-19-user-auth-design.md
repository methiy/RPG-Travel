# User Authentication & Cloud Progress Sync Design

**Date**: 2026-03-19
**Project**: 旅行者传说 (Travel RPG)
**Status**: Approved

## Overview

Add user registration/login system with server-side game progress storage, enabling:
1. Cloud sync — users can continue progress across devices
2. Multi-player support — each person has independent save data
3. Social foundation — user accounts enable future leaderboards, friends, sharing

## Technology Stack

- **Backend**: Nuxt built-in server (`server/` directory, Nitro/h3)
- **Database**: SQLite via `better-sqlite3` — stored at `data/travelrpg.db`
- **Password hashing**: `bcryptjs` (pure JS, no native compilation needed; salt rounds = 10)
- **Authentication**: httpOnly signed cookie (no JWT)
- **Deployment target**: Node.js server (self-hosted)

## Data Model

### `users` table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | User ID |
| username | TEXT | UNIQUE NOT NULL | Login identifier |
| display_name | TEXT | NOT NULL | Display nickname |
| password_hash | TEXT | NOT NULL | bcrypt hashed password |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Registration time |

### `game_progress` table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | INTEGER | PRIMARY KEY, FK → users.id | Owner |
| exp | INTEGER | DEFAULT 0 | Experience points |
| completed | TEXT | DEFAULT '[]' | JSON array of completed task IDs |
| medals | TEXT | DEFAULT '[]' | JSON array of earned medal IDs |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update time |

Design notes:
- Game progress schema mirrors existing localStorage format (`{exp, completed, medals}`) for easy migration
- JSON columns for arrays keep schema simple — no extra join tables needed
- Sufficient for future leaderboard queries (`SELECT username, exp FROM users JOIN game_progress ...`)

## API Routes

All routes under `server/api/`:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register new user (username, password, display_name) |
| POST | `/api/auth/login` | No | Login (username, password) → set cookie |
| POST | `/api/auth/logout` | Yes | Logout → clear cookie |
| GET | `/api/auth/me` | Yes | Get current user info |
| GET | `/api/progress` | Yes | Get user's game progress |
| PUT | `/api/progress` | Yes | Save/update game progress |

### Register (`POST /api/auth/register`)

**Request body**: `{ username: string, password: string, displayName: string }`

**Validation**:
- username: 2-20 chars, alphanumeric + underscore only, unique
- password: minimum 6 chars
- displayName: 1-20 chars

**Response**: `{ user: { id, username, displayName } }` + sets auth cookie

Successful registration automatically logs the user in and redirects to `/`.

**Errors**: 400 (validation), 409 (username taken)

### Login (`POST /api/auth/login`)

**Request body**: `{ username: string, password: string }`

**Response**: `{ user: { id, username, displayName } }` + sets auth cookie

**Errors**: 401 (invalid credentials)

### Progress (`GET/PUT /api/progress`)

**GET response**: `{ exp: number, completed: string[], medals: string[] }`

**PUT request body**: `{ exp: number, completed: string[], medals: string[] }`

**Validation**:
- `exp`: non-negative integer
- `completed`: array of strings, max 5000 entries, each max 100 chars
- `medals`: array of strings, max 1000 entries, each max 100 chars

**Conflict strategy**: Last-write-wins for v1. Acceptable since a single user rarely plays on two devices simultaneously. Future improvement: optimistic locking via `updated_at`.

**PUT response**: `{ success: true }`

## Authentication Flow

### Cookie-based session:
1. On login/register, server creates a signed cookie containing user ID
2. Cookie is `httpOnly` (no JS access), `sameSite: lax`, `path: /`, `maxAge: 30 days`
3. Server middleware (`server/middleware/auth.ts`) reads cookie on every request
4. Parsed user info is set to `event.context.user`
5. Protected API routes check for `event.context.user`

### Cookie signing:
- Use `h3`'s built-in `setCookie`/`getCookie` with a secret from environment variable `AUTH_SECRET`
- Simple signed cookie approach (HMAC), no external session store needed
- `AUTH_SECRET` is required at startup — server fails fast if not set
- Generate with: `openssl rand -hex 32` (minimum 32 bytes recommended)

## Frontend Changes

### New Pages

1. **`app/pages/login.vue`** — Login form
   - Username + password fields
   - "No account? Register" link
   - Dark RPG theme consistent with existing UI
   - Error display for invalid credentials

2. **`app/pages/register.vue`** — Registration form
   - Username + display name + password + confirm password
   - "Already have an account? Login" link
   - Client-side validation + server error display

### Route Protection

**Client middleware** (`app/middleware/auth.ts`):
- Checks if user is logged in (via `useAuth` composable)
- Unauthenticated users → redirect to `/login`
- Authenticated users on `/login` or `/register` → redirect to `/`

### Composable Changes

**New `useAuth` composable** (`app/composables/useAuth.ts`):
- Manages auth state (current user, loading, error)
- `login(username, password)` — calls API, sets state
- `register(username, password, displayName)` — calls API, sets state
- `logout()` — calls API, clears state, redirects to `/login`
- `fetchUser()` — calls `/api/auth/me` to check if session is valid (called on app init)

**Modified `useGameState` composable**:
- On init: load progress from server API instead of only localStorage
- On state change (task complete, medal earned, EXP gain): sync to server API
- Keep localStorage as local cache for offline resilience
- Server data takes priority over localStorage on conflict

### Data Migration

On first login, handle all four scenarios:
1. **No local data + no server data** → start fresh (default)
2. **Local data + no server data** → prompt: "Found local save (Level X, Y tasks). Import?" If yes, upload to server
3. **No local data + server data exists** → load from server (normal cross-device login)
4. **Local data + server data exists** → server data takes priority (already synced from another device)

After successful migration (scenario 2), only clear localStorage after confirmed server upload success.

### TopBar Changes

- Display user's `displayName` instead of generic label
- Add logout button/icon

## New Dependencies

```
better-sqlite3    — SQLite driver (synchronous API; acceptable for small-scale self-hosted use)
bcryptjs           — Password hashing (pure JS, no native compilation needed)
```

Note: `better-sqlite3` uses synchronous APIs which block the event loop. For the expected scale (dozens of concurrent users), this is fine. If scaling becomes a concern, migrate to `drizzle` + `libsql`.

### Database versioning

For v1, tables are created via `CREATE TABLE IF NOT EXISTS` on startup. Since the project is pre-production, schema changes can be handled by recreating the database. A proper migration system (versioned SQL files) should be added before production launch with real user data.

## File Structure (new files)

```
server/
  database/
    index.ts           — DB connection & initialization (create tables)
  middleware/
    auth.ts            — Cookie parsing, set event.context.user
  api/
    auth/
      register.post.ts — Registration endpoint
      login.post.ts    — Login endpoint
      logout.post.ts   — Logout endpoint
      me.get.ts        — Current user endpoint
    progress/
      index.get.ts     — Get progress
      index.put.ts     — Save progress
  utils/
    auth.ts            — Cookie sign/verify helpers
app/
  pages/
    login.vue          — Login page
    register.vue       — Register page
  composables/
    useAuth.ts         — Auth state management
  middleware/
    auth.ts            — Client-side route guard
```

## Security Considerations

- Passwords hashed with bcryptjs (never stored in plain text)
- httpOnly cookies prevent XSS token theft
- Input validation on all endpoints (prevent SQL injection via parameterized queries)
- Rate limiting not included in v1 (can add later if needed)
- CORS not needed (same-origin, cookie-based)

## Out of Scope (Future)

- Password reset / forgot password
- Email verification
- OAuth / third-party login
- Rate limiting
- Account deletion
- Admin panel
- Avatar upload
- Friend system / leaderboards (enabled by this design, built separately)
