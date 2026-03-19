# RPG Travel Game - Phase 1 Design Spec

## Overview

A gamified travel RPG web application built with Nuxt 4 (Vue 3), inspired by the reference `DOC/rpg.html`. Players explore a world map of 8 continent-chapters, complete real-world travel tasks to earn EXP and medals, play 4 mini-games, and level up from beginner backpacker to cosmic traveler.

**Phase 1 scope**: World map + task system + medal wall + EXP/level system + 4 mini-games + per-chapter themed visuals.

**Future phases**: P2 backpack/collectibles, P3 skill tree, P4 weather system + daily check-in/weekly challenges.

## Architecture

### Tech Stack
- **Framework**: Nuxt 4 (Vue 3 + Vue Router 5)
- **State**: Composables with `useState` + localStorage persistence
- **Styling**: CSS variables + scoped styles, no external CSS frameworks
- **Data**: Static TypeScript data files (no backend)
- **SSR compat**: `<ClientOnly>` wrappers for localStorage-dependent rendering

### Project Structure

```
app/
├── app.vue                    # Root: global CSS vars + NuxtLayout
├── layouts/
│   └── default.vue            # TopBar + MainNav + <slot/>
├── pages/
│   ├── index.vue              # World map (chapter grid)
│   ├── chapter/[id].vue       # Chapter detail (city tabs + task grid)
│   ├── medals.vue             # Medal wall
│   └── games.vue              # Mini-games hub
├── components/
│   ├── TopBar.vue             # Avatar, level, EXP bar, stats
│   ├── MainNav.vue            # Navigation tabs
│   ├── ChapterCard.vue        # Chapter card for world map
│   ├── TaskCard.vue           # Task card in chapter view
│   ├── TaskModal.vue          # Task detail modal
│   ├── AchievementModal.vue   # Achievement popup
│   ├── MedalCard.vue          # Medal card
│   └── games/
│       ├── RouletteGame.vue   # Holiday roulette
│       ├── QuizGame.vue       # Travel quiz
│       ├── PackingGame.vue    # Packing challenge
│       └── MatchGame.vue      # Landmark matching
├── composables/
│   ├── useGameState.ts        # Core state (EXP, completed tasks, medals)
│   ├── useAchievement.ts      # Achievement modal logic
│   └── useChapterTheme.ts     # Per-chapter theme CSS variable injection
├── data/
│   ├── chapters.ts            # 8 chapter definitions
│   ├── tasks.ts               # All tasks by chapter
│   ├── medals.ts              # All medals
│   ├── quiz-questions.ts      # Quiz question bank (20+)
│   └── game-data.ts           # Roulette destinations, packing scenarios, landmarks
├── types/
│   └── index.ts               # TypeScript interfaces
```

## Data Model

### TypeScript Types

```typescript
interface Chapter {
  id: string
  name: string           // e.g. "🇯🇵 日本"
  subtitle: string
  emoji: string
  bg: string             // CSS gradient
  unlockExp: number
  cities: string[]
  tags: string[]
  description: string
  theme: ChapterTheme
}

interface ChapterTheme {
  primary: string        // Main accent color
  secondary: string      // Secondary accent
  cardBg: string         // Card background gradient
  pattern: string        // CSS background pattern/decoration
}

interface Task {
  id: string
  city: string
  name: string
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary'
  country: string
  desc: string
  objectives: string[]
  exp: number
  medal: Medal
}

interface Medal {
  id: string
  icon: string
  name: string
  desc: string
}

interface GameState {
  exp: number
  completed: string[]    // Task IDs
  medals: string[]       // Medal IDs
}

interface LevelInfo {
  lv: number
  title: string
  need: number
  cur: number
}
```

### Persistence

- Key: `travelrpg2` in localStorage
- Format: `{ exp: number, completed: string[], medals: string[] }`
- Composable `useGameState()` wraps read/write with reactive state

## Chapters (8 total, global expanded)

| # | ID | Name | Unlock EXP | Cities |
|---|-----|------|-----------|--------|
| 1 | japan | 🇯🇵 日本 | 0 | 东京, 大阪·京都, 奈良·宇治, 其他 |
| 2 | korea | 🇰🇷 韩国 | 0 | 首尔, 济州岛, 釜山, 庆州 |
| 3 | seasia | 🌴 东南亚 | 0 | 新加坡, 马来西亚, 泰国, 巴厘岛 |
| 4 | china | 🇨🇳 中国 | 0 | 武汉·宜昌, 香港, 西藏, 云南 |
| 5 | europe | 🇪🇺 欧洲 | 300 | 法国·巴黎, 意大利, 西班牙, 东欧 |
| 6 | americas | 🌎 美洲 | 600 | 美国, 墨西哥, 秘鲁, 巴西 |
| 7 | africa | 🌍 非洲与中东 | 1000 | 埃及, 摩洛哥, 迪拜, 南非 |
| 8 | oceania | 🏝️ 大洋洲 | 1500 | 澳大利亚, 新西兰, 斐济, 大堡礁 |

## Level System

| Level | Title | EXP Required | Avatar |
|-------|-------|-------------|--------|
| 1 | 初级背包客 | 100 | ✈️ |
| 2 | 资深旅行者 | 250 | 🌍 |
| 3 | 环球探险家 | 500 | 🗺️ |
| 4 | 世界漫游者 | 900 | 🧳 |
| 5 | 传奇旅行家 | 1500 | 🏅 |
| 6 | 地球行者 | 2500 | 🌟 |
| 7 | 星际旅人 | 4000 | 👑 |
| 8 | 宇宙漫游者 | ∞ | 🚀 |

EXP is cumulative. Each level requires the listed EXP amount beyond the previous level.

## Task System

### Difficulty → EXP Range
- Easy: 70-100 EXP
- Medium: 150-220 EXP
- Hard: 300-400 EXP
- Legendary: 500-600 EXP

### Task Completion Flow
1. Player clicks task card → TaskModal opens
2. Modal shows: description, objectives checklist, rewards preview, medal showcase
3. Player clicks "Complete" → EXP added, medal awarded, state saved
4. AchievementModal pops up with animation
5. Task card shows "completed" state

### Task Data
- Chapters 1-6: retain all tasks from reference file
- Chapter 7 (Africa/Middle East): ~6 new tasks (pyramids, Sahara, Dubai, safari, etc.)
- Chapter 8 (Oceania): ~6 new tasks (Great Barrier Reef, Sydney, Milford Sound, etc.)

## Medal System

- Each task has one exclusive medal
- 3 additional game medals: 旅行知识达人, 打包专家, 地标闪电手
- Medal wall page with filter: all / earned / locked
- Earned medals: gold border, glow effect
- Locked medals: grayscale, reduced opacity

## Mini-Games

### 🎡 Holiday Roulette
- 12 global destinations on Canvas wheel
- 3 spins/day (localStorage date tracking)
- +15 EXP per spin
- Shows destination info + best travel season
- CSS cubic-bezier deceleration animation (4s)

### 🧭 Travel Quiz
- 20+ question bank, 10 random per round
- Multiple choice, instant feedback with explanation
- +15-30 EXP per correct answer
- 80%+ score: +50 bonus EXP + "quiz master" medal

### 🧳 Packing Challenge
- 6 scenarios: beach, mountain, city, winter, desert (new), rainforest (new)
- Select correct items from pool; trap items shake on click
- Perfect pack: +80 EXP + medal

### 🃏 Landmark Matching
- 4x4 grid, 8 pairs of global landmarks
- Timer + flip counter
- Complete: +60 EXP; under 60s: "speed" medal
- Expanded landmarks: pyramids, Sydney Opera House, Burj Khalifa, etc.

## Per-Chapter Themed Visuals

Each chapter has a unique visual identity applied when entering its detail page.

### Theme Definitions

| Chapter | Primary | Secondary | Atmosphere | Pattern |
|---------|---------|-----------|-----------|---------|
| 🇯🇵 Japan | `#e8a0bf` sakura pink | `#c0392b` vermillion | Cherry blossoms, wafuu patterns | Radial petal shapes |
| 🇰🇷 Korea | `#4a9eff` sky blue | `#ff7675` coral | Ocean waves, hanok lines | Wave gradient |
| 🌴 SE Asia | `#00b894` tropical green | `#fdcb6e` mango | Palm leaves, tropical flora | Leaf silhouettes |
| 🇨🇳 China | `#c0392b` palace red | `#f39c12` glaze gold | Ink wash clouds, auspicious patterns | Cloud wisps |
| 🇪🇺 Europe | `#2c3e8c` royal blue | `#dfe6e9` marble | Classical ornaments, arch silhouettes | Vertical lines |
| 🌎 Americas | `#e17055` sunset orange | `#8b6914` canyon brown | Cactus, totem patterns | Desert gradient |
| 🌍 Africa/ME | `#d4a017` desert gold | `#a0522d` terracotta | Sand dunes, geometric patterns | Diamond lattice |
| 🏝️ Oceania | `#00cec9` ocean teal | `#fab1a0` coral pink | Waves, aboriginal dot art | Dot pattern |

### Theme Switching Mechanism
- `useChapterTheme(chapterId)` composable injects CSS custom properties
- On chapter page mount: set `--theme-primary`, `--theme-secondary`, `--theme-card-bg` on document root
- On chapter page unmount: restore global defaults
- Affected elements: TopBar border accent, task card highlight, progress bar fill, modal decorations
- Background patterns: CSS `::before`/`::after` pseudo-elements with `background-image` gradients/SVG, no external images

### World Map Page
- Stays in global dark theme
- Each ChapterCard banner uses its own theme gradient
- Hover: card border glows with chapter's primary color

## UI Design

### Global Style (Dark Cyberpunk)
- Background layers: `#07090f`, `#0d1020`, `#131828`
- Accent: `#4a9eff` blue + `#7b5ea7` purple
- Functional: `#ffd700` gold, `#3ddc84` green, `#ff5555` red
- Font stack: PingFang SC, Microsoft YaHei, Segoe UI, sans-serif
- Cards: rounded 12-16px, hover float + glow shadow

### Responsive
- Grid: `repeat(auto-fill, minmax(280px, 1fr))`
- TopBar: flex-wrap on small screens
- Nav: horizontal scroll
- Modals: max-width 540px, 90vw on mobile

### Animations
- `fadeInUp`: modal/panel entrance (opacity 0→1, translateY 16→0)
- `bounce`: achievement icon (scale 1→1.15→1)
- `shake`: wrong item selection (translateX ±6px)
- Roulette: `cubic-bezier(.1,.7,.1,1)` 4s spin
- EXP bar: `transition: width 1s ease`

### Nuxt-Specific
- Global CSS variables defined in `app.vue` `<style>`
- Component styles use `<style scoped>`
- `<ClientOnly>` wraps all localStorage-dependent rendering
- Page transitions via Nuxt's built-in `<NuxtPage>` transition support
- Navigation via `<NuxtLink>` and `navigateTo()`

## Component Specifications

### TopBar.vue
- Props: none (reads from useGameState)
- Displays: avatar emoji, player name "旅行者", title (from level), LV number, EXP bar (current/needed), stats row (tasks, medals, countries, total EXP)
- Sticky top, backdrop-filter blur

### MainNav.vue
- 3 tabs: 🗺️ 世界地图 (/) | 🏅 勋章墙 (/medals) | 🎮 小游戏 (/games)
- Active tab highlighted with accent border-bottom
- Uses NuxtLink with active class detection

### ChapterCard.vue
- Props: chapter data
- Shows: themed banner with emoji, lock overlay if insufficient EXP, name, subtitle, progress bar, tags
- Click: navigateTo(`/chapter/${id}`) or show lock hint

### TaskCard.vue
- Props: task data, completed boolean
- Shows: name, difficulty badge (color-coded), location, EXP reward, medal name, done indicator
- Click: emits open-modal event

### TaskModal.vue
- Props: task data, visible boolean
- Shows: medal icon banner, title, meta tags, description, objectives list, rewards with medal showcase
- "Complete" button → calls useGameState().completeTask()
- Overlay click or close button to dismiss

### AchievementModal.vue
- Props: icon, title, subtitle, exp, medal text
- Full-screen overlay with centered card
- Bounce animation on icon
- "继续冒险 ✨" dismiss button

### Games
- Each game component is self-contained
- Games page shows 4 game cards; clicking one hides the menu and shows the game panel
- "← 返回游戏列表" button returns to menu
- All games call useGameState() to add EXP and medals

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Large data files bloat bundle | Data files are tree-shakeable TS; only imported where needed |
| SSR hydration mismatch from localStorage | All reactive localStorage reads wrapped in `<ClientOnly>` |
| Theme switching flicker on navigation | Apply theme in `onMounted` with nextTick; use CSS transitions |
| Canvas roulette not reactive | Redraw in onMounted; canvas is presentation-only |

## Out of Scope (Phase 1)

- Backpack/inventory system (P2)
- Skill tree (P3)
- Weather system (P4)
- Daily check-in / weekly challenges (P4)
- Backend / user accounts / cloud save
- i18n (Chinese only for now)
- Sound effects / music
