# Nuxt 4 Travel RPG - Data Export Feature Design Document

## Project Overview
- **Type**: Nuxt 4 (Vue 3 + Vue Router 5) Travel RPG Game
- **Architecture**: Client-side with localStorage + Server backend (Nitro)
- **Storage**: localStorage for client-side, Database for server (when logged in)
- **Language**: Chinese (游戏语言为中文)

---

## 1. CORE DATA STRUCTURES

### 1.1 GameState (核心进度数据)
**Location**: `app/types/index.ts` + `app/composables/useGameState.ts`

```typescript
interface GameState {
  exp: number          // Total experience points earned
  completed: string[]  // Array of completed task IDs
  medals: string[]     // Array of earned medal IDs
}
```

**Key Features**:
- Dual-storage: localStorage (primary) + Server sync (if logged in)
- Auto-merge logic on login (uses whichever has more progress)
- Real-time sync with 300ms debounce

**Storage Locations**:
- Client: `localStorage['travelrpg2']`
- Server: Database table (via `/api/progress` endpoints)

### 1.2 LevelInfo (等级信息)
**Location**: `app/data/levels.ts`

```typescript
interface LevelInfo {
  lv: number      // Current level (1-8)
  title: string   // Level title (e.g., "初级背包客", "传奇旅行家")
  need: number    // EXP needed for current level
  cur: number     // Current EXP in this level
}
```

**Levels**:
1. Lv.1 初级背包客 - 100 EXP
2. Lv.2 资深旅行者 - 250 EXP
3. Lv.3 环球探险家 - 500 EXP
4. Lv.4 世界漫游者 - 900 EXP
5. Lv.5 传奇旅行家 - 1500 EXP
6. Lv.6 地球行者 - 2500 EXP
7. Lv.7 星际旅人 - 4000 EXP
8. Lv.8 宇宙漫游者 - 99999 EXP

**Avatars**: ['✈️', '🌍', '🗺️', '🧳', '🏅', '🌟', '👑', '🚀']

---

## 2. TASKS & ACHIEVEMENTS

### 2.1 Task Structure
**Location**: `app/types/index.ts` + `app/data/tasks/**/*.ts`

```typescript
interface Task {
  id: string                           // Unique ID
  city: string                         // City name
  name: string                         // Task name
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary'
  country: string                      // Country ID
  desc: string                         // Description
  objectives: string[]                 // Task objectives
  exp: number                          // EXP reward
  medal: Medal                         // Medal earned
  guide?: TaskGuide                    // Detailed travel guide
  location?: TaskLocation              // GPS coordinates + radius
}

interface Medal {
  id: string
  icon: string
  name: string
  desc: string
}

interface TaskLocation {
  lat: number      // Latitude
  lng: number      // Longitude
  radius: number   // Distance in meters (how close you need to be)
}
```

**Task Data Structure**:
- **Organized by Country**: `app/data/tasks/{country}.ts`
- **Nested for China**: `app/data/tasks/china/{city}.ts`
- **Total**: 100+ tasks across 30+ countries/regions

**Difficulty Distribution** (tracked in profile):
- 🌱 简单 (Easy)
- ⚔️ 中等 (Medium)
- 🔥 困难 (Hard)
- ⭐ 传奇 (Legendary)

### 2.2 Medals (勋章)
**Location**: `app/data/medals.ts`

Two types:
1. **Task Medals**: Earned from completing tasks (one per task)
2. **Game Medals**: Earned from mini-games (6 medals)
   - 🧭 旅行知识达人 (Quiz Master)
   - 🧳 打包专家 (Packing Pro)
   - ⚡ 地标闪电手 (Landmark Speed)
   - 🏳️ 国旗达人 (Flag Master)
   - 📏 距离感达人 (Distance Master)
   - 💰 汇率达人 (Currency Master)

### 2.3 Achievements (成就)
**Location**: `app/data/achievements.ts`

**Categories**:
1. **Explorer** (探索者) - Location-based achievements
   - Task completions (1, 5, 15, 30, 50, 100)
   - Countries visited (3, 8, 15)
   - Cities visited (5, 20, 50)
   - Continent mastery (all countries per continent)
   - Country master (complete all tasks in country)

2. **Collector** (收藏家)
   - Medals earned (5, 20, 50)

3. **Challenge** (挑战者)
   - Difficulty-based (easy, medium, hard, legendary)
   - EXP milestones (500, 2000, 5000)

4. **Social** (社交)
   - Photo uploads (1, 10, 30)

**Total Achievements**: 40+

---

## 3. PHOTOS & TIMELINE

### 3.1 CheckinPhoto (打卡照片)
**Location**: `app/types/index.ts` + `app/composables/usePhotoCheckin.ts`

```typescript
interface CheckinPhoto {
  id?: number              // Server-assigned ID
  taskId: string          // Associated task ID
  dataUrl: string         // Base64 image data (800px max, JPEG 0.7)
  timestamp: number       // Unix timestamp (milliseconds)
  lat?: number            // GPS latitude
  lng?: number            // GPS longitude
  comment?: string        // User comment (max 500 chars)
}
```

**Storage**:
- Client: `localStorage['travelrpg2_photos']` (max 100 photos)
- Server: Database table (via `/api/photos` endpoints)
- Images: Base64-encoded JPEG (resized to 800px max)

**Timeline Data** (`app/pages/timeline.vue`):
Combines photos + completed tasks (without photos):
- Photo entries have 📷 icon + photoUrl
- Task-only entries have ✅ icon + no photo
- All sorted by timestamp (newest first)
- Grouped by date

---

## 4. GEOGRAPHIC DATA

### 4.1 Continents (大洲)
**Location**: `app/data/continents.ts`

```
- Asia (亚洲)
- Europe (欧洲)
- Americas (美洲)
- Africa & Middle East (非洲中东)
- Oceania (大洋洲)
```

### 4.2 Countries (国家)
**Location**: `app/data/countries.ts`

30+ countries total, including:
- Japan, China, South Korea, Thailand, Vietnam, etc. (Asia)
- France, Germany, Italy, UK, etc. (Europe)
- USA, Brazil, Peru, Argentina, etc. (Americas)
- And many more...

Each country includes:
- City list
- Country guide (visa, currency, language, etc.)
- Theme colors
- Description

### 4.3 Cities (城市)
**Location**: `app/data/cities.ts`

100+ cities total. Each city links to:
- Country ID
- City guide (transport, weather, highlights, etc.)
- Tasks within that city

---

## 5. USER PROFILE STATISTICS

**Displayed on `/pages/profile.vue`**:

```typescript
// Core Stats (区域 2)
- completedCount: number        // Tasks completed / Total tasks
- medalCount: number            // Medals earned / Total medals
- countriesCount: number        // Countries visited / Total countries
- citiesCount: number           // Cities visited / Total cities

// Continental Progress (区域 3)
- continentProgress[].visited   // Countries visited per continent
- continentProgress[].total     // Total countries per continent

// Difficulty Distribution (区域 4)
- difficultyStats[]             // Counts by difficulty level

// Recent Items (区域 5-6)
- recentMedals: Medal[]         // Last 6 medals earned
- recentPhotos: CheckinPhoto[]  // Last 4 photos taken
```

---

## 6. USER AUTHENTICATION

### 6.1 AuthUser (用户账户)
**Location**: `app/types/index.ts` + `app/composables/useAuth.ts`

```typescript
interface AuthUser {
  id: number
  username: string
  displayName: string
}
```

**Features**:
- Local registration/login
- Server-side user database
- Session management via middleware
- Progress & photos synced per user

---

## 7. DATA EXPORT CANDIDATES

### High-Value Export Data:

#### 1. **Game Progress Data**
```
- Total EXP
- Current Level & Title
- Completed Tasks (with details)
- Earned Medals (with details)
- Achievements (locked/unlocked status)
```

#### 2. **Geographic Exploration Data**
```
- Countries visited (with dates if available)
- Cities visited
- Continental progress
- Completion by difficulty level
```

#### 3. **Photo & Timeline Data**
```
- All check-in photos (with coordinates, dates, comments)
- AI photo analysis results (if available)
- Timeline entries in chronological order
```

#### 4. **User Profile Summary**
```
- Username & display name
- Profile creation date
- Current level & avatar
- Total play statistics
```

#### 5. **Game Statistics**
```
- Task completion stats by:
  - Country
  - Continent
  - Difficulty level
  - City
- Medal collection progress
- Achievement statistics
```

---

## 8. EXPORT FORMAT CONSIDERATIONS

### Recommended Export Formats:

1. **JSON** (最全面 - Most Complete)
   - Preserves all data structure
   - Import-friendly
   - Size: ~50-500KB depending on photos

2. **CSV** (最兼容 - Most Compatible)
   - Task completion records
   - Achievement list
   - Photo metadata (without base64)

3. **HTML Report** (最可读 - Most Readable)
   - Beautiful travel summary
   - Statistics visualizations
   - Photo gallery

4. **PDF** (最专业 - Most Professional)
   - Print-friendly report
   - Travel passport style
   - Photo gallery with metadata

### Data to Include/Exclude:

**Include**:
- All user progress
- Timestamps
- Geographic coordinates
- Comments
- Metadata

**Exclude**:
- Base64 images (offer separate image downloads)
- Server-assigned IDs (use taskId instead)
- Intermediate cache data

---

## 9. EXISTING SERVER ENDPOINTS

### Progress Endpoints:
- `GET /api/progress` - Fetch user's game state
- `PUT /api/progress` - Save/sync game state

### Photos Endpoints:
- `GET /api/photos` - Fetch all user photos
- `POST /api/photos` - Save new photo
- `PUT /api/photos/[id]` - Update photo comment

### Other Endpoints:
- `GET /api/auth/me` - Current user info
- Various leaderboard & feed endpoints

---

## 10. IMPLEMENTATION APPROACH

### Option A: Client-Side Only
- Export localStorage data directly
- Pros: Simple, fast, no server load
- Cons: Photos as base64 (large files)

### Option B: Server-Side Aggregation
- Create `/api/export` endpoint
- Aggregate all user data
- Return as ZIP with JSON + separate image files
- Pros: Optimized, cleaner export
- Cons: Server processing required

### Option C: Hybrid
- Server aggregates structured data (JSON)
- Client handles local photos
- Offers multiple format options

### Recommended: **Option C (Hybrid)**
- Best performance & flexibility
- Can offer JSON, CSV, PDF, HTML
- Server-side JSON generation for completeness
- Client-side or server-side image handling options

---

## 11. DATA VOLUME ESTIMATES

Assuming active player with 50 completed tasks, 20 photos:

- GameState: ~2KB
- Metadata/Achievements: ~5KB
- Photo metadata: ~10KB
- 20 photos @ 100KB each: ~2MB
- **Total**: ~2MB per user

If 1000 users: ~2GB total (manageable)

---

## 12. PRIVACY & SECURITY CONSIDERATIONS

✅ **Include in Export**:
- User's own progress
- User's own photos
- User's own statistics

❌ **Do NOT Include**:
- Other users' data
- Leaderboard rankings (link to live page instead)
- Server-side authentication tokens

---

## 13. KEY FILES SUMMARY

| Purpose | File Location |
|---------|---------------|
| Type Definitions | `app/types/index.ts` |
| Game State | `app/composables/useGameState.ts` |
| Photos | `app/composables/usePhotoCheckin.ts` |
| Achievements | `app/composables/useAchievements.ts` + `app/data/achievements.ts` |
| Profile Page | `app/pages/profile.vue` |
| Timeline Page | `app/pages/timeline.vue` |
| Photos Page | `app/pages/photos.vue` |
| Tasks Data | `app/data/tasks/**/*.ts` |
| Countries Data | `app/data/countries.ts` |
| Medals Data | `app/data/medals.ts` |
| Levels Data | `app/data/levels.ts` |
| Progress API | `server/api/progress/**` |
| Photos API | `server/api/photos/**` |

---

## 14. EXPORT FEATURE ROADMAP

### Phase 1: Basic Export
- [ ] JSON export (GameState + metadata)
- [ ] CSV export (task completion list)
- [ ] Client-side implementation

### Phase 2: Enhanced Export
- [ ] HTML report generation
- [ ] Photo export options
- [ ] Server-side aggregation API

### Phase 3: Advanced Features
- [ ] PDF report
- [ ] Import functionality
- [ ] Scheduled exports
- [ ] Cloud storage integration

---

**Document Generated**: 2026-04-02  
**Nuxt Version**: 4  
**Vue Version**: 3  
**Database**: Nitro/Server-side persistent storage

