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
  need: number           // EXP delta required for THIS level (not cumulative)
  cur: number            // EXP progress within current level (0 to need), used for EXP bar
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

EXP values are **per-level deltas** (not cumulative thresholds). The `levelInfo(exp)` function subtracts each level's `need` progressively from total EXP to determine current level and progress. At the max level (8), EXP continues to accumulate but the level no longer advances.

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
- Chapters 1-6: retain all tasks from reference file (tasks embedded with inline `medal: Medal` objects)
- Chapter 7 (Africa/Middle East): 6 new tasks:
  - af1: 埃及·站在吉萨金字塔前 (easy, 100 EXP, 🔺 金字塔见证者)
  - af2: 摩洛哥·穿越菲斯古城迷宫 (medium, 180 EXP, 🏺 古城迷踪者)
  - af3: 迪拜·登上哈利法塔观景台 (medium, 200 EXP, 🏗️ 云端登临者)
  - af4: 南非·在好望角打卡 (medium, 160 EXP, 🌊 好望角勇者)
  - af5: 迪拜·穿越沙漠冲沙 (hard, 300 EXP, 🏜️ 沙漠征服者)
  - af6: 南非·克鲁格国家公园观五大兽 (legendary, 500 EXP, 🦁 非洲猎游者)
- Chapter 8 (Oceania): 6 new tasks:
  - oc1: 澳大利亚·在悉尼歌剧院前打卡 (easy, 90 EXP, 🎭 歌剧院访客)
  - oc2: 澳大利亚·潜水大堡礁 (hard, 350 EXP, 🐠 大堡礁潜行者)
  - oc3: 新西兰·米尔福德峡湾巡游 (medium, 200 EXP, 🏔️ 峡湾探索者)
  - oc4: 新西兰·挑战皇后镇蹦极 (hard, 320 EXP, 🪂 极限勇者)
  - oc5: 斐济·在私人海岛浮潜 (medium, 180 EXP, 🏝️ 南太平洋岛民)
  - oc6: 大堡礁·乘直升机俯瞰心形礁 (legendary, 550 EXP, 💙 心形礁发现者)

### Medal Data Source
- `medals.ts` is a **computed re-export**: it collects all medals from `tasks.ts` (each task's inline `medal` field) plus the 3 game-only medals, and exports a flat `ALL_MEDALS` array. It is NOT the canonical source — task definitions are.
- `GameState.medals` stores medal IDs (`string[]`), looked up against `ALL_MEDALS` for display.

### Countries Stat
- Derived at render time: `new Set(completedTasks.map(t => t.country)).size`
- Each task has a `country` field (e.g. "日本", "韩国", "新加坡", "法国", "埃及", "澳大利亚", etc.)

## Medal System

- Each task has one exclusive medal
- 3 additional game medals: 旅行知识达人, 打包专家, 地标闪电手
- Medal wall page with filter: all / earned / locked
- Earned medals: gold border, glow effect
- Locked medals: grayscale, reduced opacity

## Mini-Games

### 🎡 Holiday Roulette
- 12 global destinations on Canvas wheel:
  1. 🇯🇵 日本·京都 — 千年古都 (🌸, 3月樱花/11月红叶)
  2. 🇰🇷 韩国·济州岛 — 火山岛 (🏝️, 9-10月)
  3. 🇸🇬 新加坡 — 花园城市 (🌆, 全年)
  4. 🇻🇳 越南·下龙湾 — 千岛石林 (🚢, 3-5月)
  5. 🇹🇭 泰国·清迈 — 古城文化 (🐘, 11-2月)
  6. 🇨🇳 中国·云南 — 彩云之南 (🌈, 3-5月/9-11月)
  7. 🇮🇩 巴厘岛 — 热带天堂 (🌺, 5-9月)
  8. 🇭🇰 香港 — 都市徒步 (🏙️, 10-12月)
  9. 🇪🇬 埃及·开罗 — 金字塔之国 (🔺, 10-4月)
  10. 🇦🇺 澳大利亚·悉尼 — 南半球明珠 (🦘, 9-11月)
  11. 🇧🇷 巴西·里约 — 桑巴之都 (💃, 12-3月)
  12. 🇫🇷 法国·巴黎 — 浪漫之都 (🗼, 4-6月/9-10月)
- 3 spins/day tracked via localStorage key `travelrpg2_roulette` with `{ date: new Date().toDateString(), spins: number }` (resets at local midnight)
- +15 EXP per spin
- Shows destination info + best travel season
- CSS cubic-bezier deceleration animation (4s)

### 🧭 Travel Quiz
- 20+ question bank, 10 random per round
- Multiple choice, instant feedback with explanation
- EXP varies per question: each question has its own `exp` value (15 or 20), defined in quiz-questions.ts data
- 80%+ score: +50 bonus EXP + "quiz master" medal

### 🧳 Packing Challenge
- 6 scenarios: beach, mountain, city, winter, desert (new), rainforest (new)
- Desert scenario: must items [防晒霜, 饮用水, 遮阳帽, 轻便长袖, 防沙围巾], trap items [厚羽绒服, 雨靴, 泳衣, 毛线手套]
- Rainforest scenario: must items [防蚊喷雾, 雨衣, 登山靴, 急救包, 防水背包], trap items [高跟鞋, 电吹风, 白色衬衫, 香水]
- Select correct items from pool; trap items shake on click
- Perfect pack: +80 EXP + medal

### 🃏 Landmark Matching
- 4x4 grid, 8 pairs of global landmarks:
  1. 🗼 东京塔  2. 🗽 自由女神  3. 🏯 姬路城  4. 🕌 泰姬陵
  5. ⛩️ 伏见稻荷  6. 🏛️ 帕特农神庙  7. 🌉 金门大桥  8. 🕍 圣家族
- Timer + flip counter
- Complete: +60 EXP; under 60s: "speed" medal

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
- Page transitions: use Nuxt default `fade` transition (opacity 0→1, 200ms ease) for all page navigations
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
- Accessibility (ARIA, keyboard nav) — known limitation
- Progress reset functionality — may add later
- "All cities" tab in chapter view — intentional omission, filter by city only
