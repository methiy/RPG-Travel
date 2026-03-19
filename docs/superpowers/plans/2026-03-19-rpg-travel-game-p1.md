# RPG Travel Game Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a gamified travel RPG as a Nuxt 4 app with world map, task system, medal wall, EXP/levels, 4 mini-games, and per-chapter themed visuals.

**Architecture:** Nuxt 4 SPA with file-based routing, Vue composables for state (localStorage persistence), static TS data files for game content. No backend. All game state stored client-side. Per-chapter CSS variable theming via composable.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, CSS custom properties, Canvas API (roulette wheel)

**Spec:** `docs/superpowers/specs/2026-03-19-rpg-travel-game-design.md`
**Reference:** `DOC/rpg.html` (monolithic HTML reference implementation)

---

## File Structure

```
app/
├── app.vue                          # Root: global CSS vars, page transition, NuxtLayout
├── layouts/
│   └── default.vue                  # Layout: TopBar + MainNav + <slot/>
├── pages/
│   ├── index.vue                    # World map page (chapter grid)
│   ├── chapter/
│   │   └── [id].vue                 # Chapter detail (city tabs + task grid)
│   ├── medals.vue                   # Medal wall page
│   └── games.vue                    # Mini-games hub page
├── components/
│   ├── TopBar.vue                   # Player stats bar (avatar, level, EXP, stats)
│   ├── MainNav.vue                  # Tab navigation (world/medals/games)
│   ├── ChapterCard.vue              # Chapter card for world map grid
│   ├── TaskCard.vue                 # Task card in chapter view
│   ├── TaskModal.vue                # Task detail/completion modal
│   ├── AchievementModal.vue         # Achievement celebration popup
│   ├── MedalCard.vue                # Single medal display card
│   └── games/
│       ├── RouletteGame.vue         # Holiday roulette wheel game
│       ├── QuizGame.vue             # Travel knowledge quiz game
│       ├── PackingGame.vue          # Packing challenge game
│       └── MatchGame.vue            # Landmark matching game
├── composables/
│   ├── useGameState.ts              # Core state: EXP, completed tasks, medals, persistence
│   ├── useAchievement.ts            # Achievement modal show/hide logic
│   └── useChapterTheme.ts           # Per-chapter CSS variable injection
├── data/
│   ├── chapters.ts                  # 8 chapter definitions with themes
│   ├── tasks.ts                     # All tasks organized by chapter ID
│   ├── medals.ts                    # Computed re-export: all medals from tasks + game medals
│   ├── quiz-questions.ts            # 20+ quiz questions with answers and explanations
│   └── game-data.ts                 # Roulette destinations, packing scenarios, landmarks
└── types/
    └── index.ts                     # All TypeScript interfaces
```

---

### Task 1: TypeScript Types & Data Files

**Files:**
- Create: `app/types/index.ts`
- Create: `app/data/chapters.ts`
- Create: `app/data/tasks.ts`
- Create: `app/data/medals.ts`
- Create: `app/data/quiz-questions.ts`
- Create: `app/data/game-data.ts`

- [ ] **Step 1: Create type definitions**

Create `app/types/index.ts`:

```typescript
export interface ChapterTheme {
  primary: string
  secondary: string
  cardBg: string
  pattern: string
}

export interface Chapter {
  id: string
  name: string
  subtitle: string
  emoji: string
  bg: string
  unlockExp: number
  cities: string[]
  tags: string[]
  description: string
  theme: ChapterTheme
}

export interface Medal {
  id: string
  icon: string
  name: string
  desc: string
}

export interface Task {
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

export interface GameState {
  exp: number
  completed: string[]
  medals: string[]
}

export interface LevelInfo {
  lv: number
  title: string
  need: number
  cur: number
}

export interface QuizQuestion {
  q: string
  opts: string[]
  ans: number
  exp: number
  explain: string
}

export interface RouletteDestination {
  name: string
  flags: string
  color: string
  desc: string
  best: string
}

export interface PackingScenario {
  id: string
  icon: string
  name: string
  must: string[]
  trap: string[]
  all: string[]
}

export interface Landmark {
  icon: string
  name: string
}
```

- [ ] **Step 2: Create chapters data**

Create `app/data/chapters.ts` with all 8 chapters. Export as `export const CHAPTERS: Chapter[] = [...]`. Each chapter includes a `theme` object with `primary`, `secondary`, `cardBg`, and `pattern` (CSS background-image string for decorative pseudo-elements). Copy chapters 1-6 from reference `DOC/rpg.html` lines 474-517, add theme objects, and add chapters 7 (africa) and 8 (oceania) per spec.

Full chapter data:
- japan: theme primary `#e8a0bf`, secondary `#c0392b`, cardBg `linear-gradient(135deg,#2d1a1e,#1a0a14)`, pattern: radial-gradient petal shapes
- korea: theme primary `#4a9eff`, secondary `#ff7675`, cardBg `linear-gradient(135deg,#0a1a2d,#1a0a20)`, pattern: wave gradient
- seasia: theme primary `#00b894`, secondary `#fdcb6e`, cardBg `linear-gradient(135deg,#0a2d1a,#1a200a)`, pattern: leaf silhouettes
- china: theme primary `#c0392b`, secondary `#f39c12`, cardBg `linear-gradient(135deg,#2d0a0a,#1a1a0a)`, pattern: cloud wisps
- europe: theme primary `#2c3e8c`, secondary `#dfe6e9`, cardBg `linear-gradient(135deg,#0a0a2d,#200a1a)`, pattern: vertical lines
- americas: theme primary `#e17055`, secondary `#8b6914`, cardBg `linear-gradient(135deg,#1a0a2d,#0a1a1a)`, pattern: desert gradient
- africa: unlockExp 1000, cities ['埃及','摩洛哥','迪拜','南非'], theme primary `#d4a017`, secondary `#a0522d`, cardBg `linear-gradient(135deg,#2d1a00,#1a0d0a)`, pattern: diamond lattice
- oceania: unlockExp 1500, cities ['澳大利亚','新西兰','斐济','大堡礁'], theme primary `#00cec9`, secondary `#fab1a0`, cardBg `linear-gradient(135deg,#0a2d2d,#0a1a20)`, pattern: dot pattern

- [ ] **Step 3: Create tasks data**

Create `app/data/tasks.ts`. Export as `export const TASKS: Record<string, Task[]> = { japan: [...], korea: [...], ... }`. Copy all tasks from reference `DOC/rpg.html` lines 519-651 for chapters 1-6 (japan, korea, seasia, china, europe, americas). Add chapter 7 (africa) tasks per spec:

```typescript
africa: [
  { id:'af1', city:'埃及', name:'站在吉萨金字塔前', difficulty:'easy', country:'埃及',
    desc:'吉萨金字塔群是古代世界七大奇迹中唯一现存的奇迹。站在胡夫金字塔前，感受4500年的时光重量。',
    objectives:['在胡夫金字塔前拍照📸','骑骆驼穿越沙漠','参观狮身人面像'],
    exp:100, medal:{id:'pyramid',icon:'🔺',name:'金字塔见证者',desc:'站在人类最古老的奇迹前'}},
  { id:'af2', city:'摩洛哥', name:'穿越菲斯古城迷宫', difficulty:'medium', country:'摩洛哥',
    desc:'菲斯古城（Fes el Bali）是世界上最大的无车城区，9000多条巷道组成的迷宫让GPS也失灵。',
    objectives:['进入菲斯古城麦地那','找到著名的皮革染坊','在迷宫中找到一家传统手工艺店'],
    exp:180, medal:{id:'fes',icon:'🏺',name:'古城迷踪者',desc:'穿越世界最大无车迷宫'}},
  { id:'af3', city:'迪拜', name:'登上哈利法塔观景台', difficulty:'medium', country:'阿联酋',
    desc:'哈利法塔828米，是世界第一高楼。在148层的观景台俯瞰整个迪拜，云层就在脚下。',
    objectives:['乘高速电梯到达148层','在观景台拍摄迪拜全景📸','观赏迪拜喷泉表演'],
    exp:200, medal:{id:'burj',icon:'🏗️',name:'云端登临者',desc:'站上世界最高建筑'}},
  { id:'af4', city:'南非', name:'在好望角打卡', difficulty:'medium', country:'南非',
    desc:'好望角是非洲大陆的西南端，大西洋与印度洋在此交汇。站在灯塔旁，感受两大洋的壮阔。',
    objectives:['徒步到好望角标志牌前📸','爬上开普角灯塔','观察沿途的野生动物'],
    exp:160, medal:{id:'cape',icon:'🌊',name:'好望角勇者',desc:'抵达非洲大陆西南端'}},
  { id:'af5', city:'迪拜', name:'穿越沙漠冲沙', difficulty:'hard', country:'阿联酋',
    desc:'乘坐越野车在金色沙丘上疯狂冲沙，是迪拜最刺激的户外体验。日落时分的沙漠美得不真实。',
    objectives:['乘坐4x4越野车进入沙漠','完成冲沙体验','在沙漠营地观看日落和肚皮舞'],
    exp:300, medal:{id:'desert',icon:'🏜️',name:'沙漠征服者',desc:'在金色沙丘上疯狂冲沙'}},
  { id:'af6', city:'南非', name:'克鲁格国家公园观五大兽', difficulty:'legendary', country:'南非',
    desc:'克鲁格国家公园是非洲最大的野生动物保护区之一。找齐非洲五大兽（狮子、大象、犀牛、水牛、豹）是终极Safari成就。',
    objectives:['参加清晨Safari游猎','拍摄到至少三种五大兽📸','在保护区内过夜'],
    exp:500, medal:{id:'safari',icon:'🦁',name:'非洲猎游者',desc:'在野生动物王国找齐五大兽'}},
]
```

Add chapter 8 (oceania) tasks per spec:

```typescript
oceania: [
  { id:'oc1', city:'澳大利亚', name:'在悉尼歌剧院前打卡', difficulty:'easy', country:'澳大利亚',
    desc:'悉尼歌剧院是20世纪最具标志性的建筑之一，贝壳般的屋顶倒映在悉尼港的碧蓝海水中。',
    objectives:['在歌剧院前广场拍照📸','沿环形码头散步到海港大桥','在岩石区品尝澳式咖啡'],
    exp:90, medal:{id:'opera',icon:'🎭',name:'歌剧院访客',desc:'打卡世界最美建筑之一'}},
  { id:'oc2', city:'大堡礁', name:'潜水大堡礁', difficulty:'hard', country:'澳大利亚',
    desc:'大堡礁是地球上最大的珊瑚礁系统，从太空都能看到。潜入水下，是进入另一个星球。',
    objectives:['乘船前往外堡礁','完成深潜或浮潜体验','拍摄珊瑚和热带鱼📸'],
    exp:350, medal:{id:'reef',icon:'🐠',name:'大堡礁潜行者',desc:'潜入地球最大珊瑚礁'}},
  { id:'oc3', city:'新西兰', name:'米尔福德峡湾巡游', difficulty:'medium', country:'新西兰',
    desc:'米尔福德峡湾被称为"世界第八大奇迹"，瀑布从千米高的悬崖上倾泻而下，海豹在礁石上晒太阳。',
    objectives:['乘坐峡湾巡游船','穿越斯特林瀑布水帘','拍摄米特峰倒影📸'],
    exp:200, medal:{id:'milford',icon:'🏔️',name:'峡湾探索者',desc:'巡游世界第八大奇迹'}},
  { id:'oc4', city:'新西兰', name:'挑战皇后镇蹦极', difficulty:'hard', country:'新西兰',
    desc:'皇后镇是现代蹦极的发源地。从卡瓦劳大桥43米高处一跃而下，脚尖几乎触碰碧绿河水。',
    objectives:['前往卡瓦劳大桥蹦极中心','完成43米蹦极跳','获取蹦极证书📸'],
    exp:320, medal:{id:'bungee',icon:'🪂',name:'极限勇者',desc:'在蹦极发源地纵身一跃'}},
  { id:'oc5', city:'斐济', name:'在私人海岛浮潜', difficulty:'medium', country:'斐济',
    desc:'斐济拥有300多个热带岛屿，透明的海水下是五彩斑斓的珊瑚花园。这里是南太平洋的天堂。',
    objectives:['乘快艇前往外岛','在珊瑚花园浮潜','享受海岛BBQ午餐'],
    exp:180, medal:{id:'fiji',icon:'🏝️',name:'南太平洋岛民',desc:'发现斐济的天堂海岛'}},
  { id:'oc6', city:'大堡礁', name:'乘直升机俯瞰心形礁', difficulty:'legendary', country:'澳大利亚',
    desc:'心形礁是大堡礁中一块天然形成的心形珊瑚礁，只有从空中才能看到完整的心形。',
    objectives:['从艾尔利海滩搭乘直升机','从空中拍摄心形礁全景📸','飞越白天堂海滩'],
    exp:550, medal:{id:'heart-reef',icon:'💙',name:'心形礁发现者',desc:'从空中发现大自然的爱心'}},
]
```

- [ ] **Step 4: Create medals data**

Create `app/data/medals.ts`:

```typescript
import { TASKS } from './tasks'
import type { Medal } from '~/types'

const GAME_MEDALS: Medal[] = [
  { id: 'quiz-master', icon: '🧭', name: '旅行知识达人', desc: '问答全部答对' },
  { id: 'packing-pro', icon: '🧳', name: '打包专家', desc: '完美完成行李打包' },
  { id: 'match-speed', icon: '⚡', name: '地标闪电手', desc: '60秒内完成配对' },
]

export const ALL_MEDALS: Medal[] = [
  ...Object.values(TASKS).flat().map(t => t.medal),
  ...GAME_MEDALS,
]
```

- [ ] **Step 5: Create quiz questions data**

Create `app/data/quiz-questions.ts` — copy all 12 questions from reference `DOC/rpg.html` lines 951-963, then add 8+ new questions covering Africa, Middle East, Oceania topics (e.g., "哪个国家拥有世界最大的珊瑚礁系统？" → 澳大利亚; "金字塔位于哪个城市附近？" → 开罗/吉萨; etc.). Each question has `{ q, opts, ans, exp, explain }`.

- [ ] **Step 6: Create game data**

Create `app/data/game-data.ts` — contains:
- `export const DESTINATIONS: RouletteDestination[] = [...]` — 12 roulette destinations (copy 8 from reference lines 881-890, add 4 new: 埃及·开罗, 澳大利亚·悉尼, 巴西·里约, 法国·巴黎)
- `export const PACK_DESTS: PackingScenario[] = [...]` — 6 packing scenarios (copy 4 from reference lines 1028-1044, add desert and rainforest per spec)
- `export const LANDMARKS: Landmark[] = [...]` — 8 landmark pairs (copy from reference lines 1119-1123)

- [ ] **Step 7: Verify data files compile**

Run: `cd /data/workspace && npx nuxi typecheck`
Expected: No TypeScript errors in data files.

- [ ] **Step 8: Commit**

```bash
git add app/types/ app/data/
git commit -m "feat: add TypeScript types and game data files

Add all type definitions, 8 chapters, tasks for all chapters including
new Africa/Middle East and Oceania content, quiz questions, roulette
destinations, packing scenarios, and landmark data."
```

---

### Task 2: Core Composables

**Files:**
- Create: `app/composables/useGameState.ts`
- Create: `app/composables/useAchievement.ts`
- Create: `app/composables/useChapterTheme.ts`

- [ ] **Step 1: Create useGameState composable**

Create `app/composables/useGameState.ts`:

```typescript
import type { GameState, LevelInfo } from '~/types'
import { TASKS } from '~/data/tasks'

const STORAGE_KEY = 'travelrpg2'

const LEVELS = [
  { lv: 1, title: '初级背包客', need: 100 },
  { lv: 2, title: '资深旅行者', need: 250 },
  { lv: 3, title: '环球探险家', need: 500 },
  { lv: 4, title: '世界漫游者', need: 900 },
  { lv: 5, title: '传奇旅行家', need: 1500 },
  { lv: 6, title: '地球行者', need: 2500 },
  { lv: 7, title: '星际旅人', need: 4000 },
  { lv: 8, title: '宇宙漫游者', need: 99999 },
]

const AVATARS = ['✈️', '🌍', '🗺️', '🧳', '🏅', '🌟', '👑', '🚀']

function loadState(): GameState {
  if (import.meta.server) return { exp: 0, completed: [], medals: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { exp: 0, completed: [], medals: [] }
}

function saveState(state: GameState) {
  if (import.meta.server) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useGameState() {
  const state = useState<GameState>('game-state', () => loadState())

  // IMPORTANT: This composable MUST be called during component setup() context.
  // On client, load from localStorage after hydration using onNuxtReady.
  if (import.meta.client) {
    onNuxtReady(() => {
      const loaded = loadState()
      state.value = loaded
    })
    watch(state, (val) => saveState(val), { deep: true })
  }

  const levelInfo = computed<LevelInfo>(() => {
    let rem = state.value.exp
    for (const l of LEVELS) {
      if (rem < l.need) return { ...l, cur: rem }
      rem -= l.need
    }
    const last = LEVELS[LEVELS.length - 1]
    return { ...last, cur: rem }
  })

  const avatar = computed(() => {
    const idx = Math.min(levelInfo.value.lv - 1, AVATARS.length - 1)
    return AVATARS[idx]
  })

  const completedCount = computed(() => state.value.completed.length)
  const medalCount = computed(() => state.value.medals.length)
  const countriesCount = computed(() => {
    const allTasks = Object.values(TASKS).flat()
    const countries = new Set(
      allTasks.filter(t => state.value.completed.includes(t.id)).map(t => t.country)
    )
    return countries.size
  })

  function completeTask(taskId: string, exp: number, medalId: string) {
    if (state.value.completed.includes(taskId)) return
    state.value.completed.push(taskId)
    state.value.exp += exp
    if (!state.value.medals.includes(medalId)) {
      state.value.medals.push(medalId)
    }
  }

  function addExp(amount: number) {
    state.value.exp += amount
  }

  function addMedal(medalId: string) {
    if (!state.value.medals.includes(medalId)) {
      state.value.medals.push(medalId)
    }
  }

  function hasMedal(medalId: string) {
    return state.value.medals.includes(medalId)
  }

  function isTaskCompleted(taskId: string) {
    return state.value.completed.includes(taskId)
  }

  return {
    state,
    levelInfo,
    avatar,
    completedCount,
    medalCount,
    countriesCount,
    completeTask,
    addExp,
    addMedal,
    hasMedal,
    isTaskCompleted,
  }
}
```

- [ ] **Step 2: Create useAchievement composable**

Create `app/composables/useAchievement.ts`:

```typescript
interface AchievementData {
  icon: string
  title: string
  sub: string
  exp: number
  medal: string
}

export function useAchievement() {
  const visible = useState('achievement-visible', () => false)
  const data = useState<AchievementData>('achievement-data', () => ({
    icon: '', title: '', sub: '', exp: 0, medal: '',
  }))

  function show(info: AchievementData) {
    data.value = info
    visible.value = true
  }

  function close() {
    visible.value = false
  }

  return { visible, data, show, close }
}
```

- [ ] **Step 3: Create useChapterTheme composable**

Create `app/composables/useChapterTheme.ts`:

```typescript
import { CHAPTERS } from '~/data/chapters'

const DEFAULT_THEME = {
  primary: '#4a9eff',
  secondary: '#7b5ea7',
  cardBg: 'linear-gradient(135deg, #131828, #0d1020)',
}

export function useChapterTheme(chapterId?: Ref<string> | string) {
  function applyTheme(id: string | undefined) {
    if (import.meta.server) return
    const el = document.documentElement
    if (!id) {
      el.style.setProperty('--theme-primary', DEFAULT_THEME.primary)
      el.style.setProperty('--theme-secondary', DEFAULT_THEME.secondary)
      el.style.setProperty('--theme-card-bg', DEFAULT_THEME.cardBg)
      el.style.removeProperty('--theme-pattern')
      return
    }
    const chapter = CHAPTERS.find(c => c.id === id)
    if (!chapter) return
    el.style.setProperty('--theme-primary', chapter.theme.primary)
    el.style.setProperty('--theme-secondary', chapter.theme.secondary)
    el.style.setProperty('--theme-card-bg', chapter.theme.cardBg)
    el.style.setProperty('--theme-pattern', chapter.theme.pattern)
  }

  onMounted(() => {
    const id = typeof chapterId === 'string' ? chapterId : chapterId?.value
    applyTheme(id)
  })

  onBeforeUnmount(() => {
    applyTheme(undefined)
  })

  if (chapterId && typeof chapterId !== 'string') {
    watch(chapterId, (id) => applyTheme(id))
  }

  return { applyTheme }
}
```

- [ ] **Step 4: Verify composables compile**

Run: `cd /data/workspace && npx nuxi typecheck`
Expected: No TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add app/composables/
git commit -m "feat: add core composables for game state, achievements, and chapter themes

useGameState: EXP, levels, task completion, medal tracking with localStorage
useAchievement: achievement modal show/hide state
useChapterTheme: per-chapter CSS variable injection with cleanup"
```

---

### Task 3: App Root, Layout & Navigation

**Files:**
- Modify: `app/app.vue`
- Create: `app/layouts/default.vue`
- Create: `app/components/TopBar.vue`
- Create: `app/components/MainNav.vue`
- Create: `app/components/AchievementModal.vue`
- Modify: `nuxt.config.ts`

- [ ] **Step 1: Update nuxt.config.ts**

Add `app/` dir config and page transitions:

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    head: {
      title: '🌍 旅行者传说 - 全球旅游RPG',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      ],
    },
  },
})
```

- [ ] **Step 2: Update app.vue with global CSS**

Replace `app/app.vue` with root component that defines all CSS custom properties (copy CSS variables from reference `DOC/rpg.html` lines 9-12), global reset styles, scrollbar styles, keyframe animations (`fadeInUp`, `bounce`, `shake`), and the page transition CSS (`.fade-enter-active`, `.fade-leave-active`). The template should contain just `<NuxtLayout><NuxtPage /></NuxtLayout>`.

Key CSS variables to define:
```css
:root {
  --bg: #07090f;
  --bg2: #0d1020;
  --bg3: #131828;
  --border: #1e2d4a;
  --accent: #4a9eff;
  --accent2: #7b5ea7;
  --gold: #ffd700;
  --green: #3ddc84;
  --red: #ff5555;
  --text: #e8eaf6;
  --muted: #6b7fa3;
  --theme-primary: #4a9eff;
  --theme-secondary: #7b5ea7;
  --theme-card-bg: linear-gradient(135deg, #131828, #0d1020);
}
```

- [ ] **Step 3: Create TopBar component**

Create `app/components/TopBar.vue`. Wrap the reactive content in `<ClientOnly>` with a fallback skeleton. Use `useGameState()` to read `levelInfo`, `avatar`, `completedCount`, `medalCount`, `countriesCount`, `state.exp`. Layout matches reference `DOC/rpg.html` lines 283-301: logo, avatar, player name/title, EXP bar, stats row.

- [ ] **Step 4: Create MainNav component**

Create `app/components/MainNav.vue` with 3 NuxtLink tabs: 🗺️ 世界地图 (`/`), 🏅 勋章墙 (`/medals`), 🎮 小游戏 (`/games`). Use `useRoute()` for active class. Style matches reference lines 38-42.

- [ ] **Step 5: Create AchievementModal component**

Create `app/components/AchievementModal.vue`. Uses `useAchievement()` composable. Shows overlay with bounce icon, title, subtitle, EXP amount, medal text, and "继续冒险 ✨" close button. Style matches reference lines 258-269.

- [ ] **Step 6: Create default layout**

Create `app/layouts/default.vue`:

```vue
<template>
  <div>
    <TopBar />
    <MainNav />
    <slot />
    <AchievementModal />
  </div>
</template>
```

- [ ] **Step 7: Verify the app renders**

Run: `cd /data/workspace && npx nuxi dev --port 3000 &`
Open `http://localhost:3000` — should see TopBar with default stats, MainNav with 3 tabs, empty page content.
Kill dev server after verification.

- [ ] **Step 8: Commit**

```bash
git add app/app.vue app/layouts/ app/components/TopBar.vue app/components/MainNav.vue app/components/AchievementModal.vue nuxt.config.ts
git commit -m "feat: add app shell with layout, TopBar, MainNav, and AchievementModal

Dark cyberpunk theme, sticky top bar with player stats, tab navigation,
achievement celebration popup, page fade transitions."
```

---

### Task 4: World Map Page & Chapter Card

**Files:**
- Create: `app/pages/index.vue`
- Create: `app/components/ChapterCard.vue`

- [ ] **Step 1: Create ChapterCard component**

Create `app/components/ChapterCard.vue`:
- Props: `chapter: Chapter`
- Uses `useGameState()` to check if locked (`state.exp < chapter.unlockExp`)
- Computes progress: count completed tasks for this chapter / total tasks
- Template: banner with emoji + lock overlay, chapter name, subtitle, progress bar, tags
- Click handler: if locked → `alert()` lock hint; if unlocked → `navigateTo('/chapter/' + chapter.id)`
- Hover: card lifts + border glows with chapter's `theme.primary`
- Style matches reference lines 53-72

- [ ] **Step 2: Create world map page**

Create `app/pages/index.vue`:
- Header: "🌍 世界地图" title + description
- Grid of `ChapterCard` components, one per chapter from `CHAPTERS`
- Wrap in `<ClientOnly>` for EXP-dependent lock state
- Style: chapters-grid with `repeat(auto-fill, minmax(280px, 1fr))`

- [ ] **Step 3: Verify world map renders**

Run dev server, navigate to `/`. Should see 8 chapter cards. First 4 unlocked, last 4 locked (with lock overlay and EXP requirement). Cards should show themed gradients on banners.

- [ ] **Step 4: Commit**

```bash
git add app/pages/index.vue app/components/ChapterCard.vue
git commit -m "feat: add world map page with 8 chapter cards

Displays all chapters in responsive grid, locked/unlocked state based on
player EXP, progress bars, themed card banners."
```

---

### Task 5: Chapter Detail Page & Task System

**Files:**
- Create: `app/pages/chapter/[id].vue`
- Create: `app/components/TaskCard.vue`
- Create: `app/components/TaskModal.vue`

- [ ] **Step 1: Create TaskCard component**

Create `app/components/TaskCard.vue`:
- Props: `task: Task`, `done: boolean`
- Shows: task name, difficulty badge (color coded: green/orange/red/purple), location, EXP reward, medal name
- If done: shows "✅ 已完成" indicator, card has green border, slightly faded
- Click: emits `click` event
- Style matches reference lines 84-102

- [ ] **Step 2: Create TaskModal component**

Create `app/components/TaskModal.vue`:
- Props: `task: Task | null`, `visible: boolean`
- Emits: `close`, `complete`
- Template: overlay → modal with banner (medal icon), title, meta tags (city, difficulty, country, done status), description section, objectives list, rewards section (EXP box + medal showcase), complete button (disabled if done), close button
- Complete button calls `emit('complete', task.id)`
- Overlay click calls `emit('close')`
- Style matches reference lines 105-140

- [ ] **Step 3: Create chapter detail page**

Create `app/pages/chapter/[id].vue`:
- Gets `id` from `useRoute().params.id`
- Finds chapter from `CHAPTERS`, redirects to `/` if not found or locked
- Uses `useChapterTheme(id)` for themed visuals
- Breadcrumb: "🌍 世界地图" link + " › " + chapter name
- City tabs: buttons for each city in `chapter.cities`, first active by default
- Tasks grid: filter tasks by current city, show `TaskCard` for each
- TaskModal: controlled by `selectedTask` ref + `showModal` ref
- On complete: calls `useGameState().completeTask()`, closes modal, shows achievement via `useAchievement().show()`
- Decorative background using `::before` pseudo-element with `var(--theme-pattern)`
- Style matches reference lines 75-82 (city tabs), 84-102 (tasks grid)

- [ ] **Step 4: Verify chapter navigation and task completion**

Run dev server:
1. Click Japan chapter → should navigate to `/chapter/japan`
2. Should see city tabs (东京, 大阪·京都, etc.)
3. Should see themed colors (pink/red for Japan)
4. Click a task → modal opens with details
5. Click "Complete" → achievement popup, EXP increases in TopBar
6. Task shows as completed
7. Navigate back to world map → Japan progress bar should update

- [ ] **Step 5: Commit**

```bash
git add app/pages/chapter/ app/components/TaskCard.vue app/components/TaskModal.vue
git commit -m "feat: add chapter detail page with city tabs, task cards, and completion flow

Per-chapter themed visuals, city filtering, task modal with objectives and
rewards, completion with EXP/medal awards and achievement popup."
```

---

### Task 6: Medal Wall Page

**Files:**
- Create: `app/pages/medals.vue`
- Create: `app/components/MedalCard.vue`

- [ ] **Step 1: Create MedalCard component**

Create `app/components/MedalCard.vue`:
- Props: `medal: Medal`, `earned: boolean`
- Earned state: gold border, glow, shows icon + name + desc + "✅ 已获得"
- Locked state: grayscale, opacity 0.35, shows icon + name + "未解锁"
- Style matches reference lines 150-158

- [ ] **Step 2: Create medals page**

Create `app/pages/medals.vue`:
- Header: "🏅 勋章收藏馆" + description
- Filter buttons: 全部 / 已获得 / 未解锁 (reactive `filter` ref)
- Grid of `MedalCard` components from `ALL_MEDALS`, filtered by state
- Sort: earned medals first, then locked
- Wrap medal grid in `<ClientOnly>`
- Style matches reference lines 143-158

- [ ] **Step 3: Verify medal wall**

Navigate to `/medals`. Should show all medals (mostly locked). Complete a task, then check that the corresponding medal shows as earned.

- [ ] **Step 4: Commit**

```bash
git add app/pages/medals.vue app/components/MedalCard.vue
git commit -m "feat: add medal wall page with filter and earned/locked states"
```

---

### Task 7: Mini-Games — Roulette & Quiz

**Files:**
- Create: `app/pages/games.vue`
- Create: `app/components/games/RouletteGame.vue`
- Create: `app/components/games/QuizGame.vue`

- [ ] **Step 1: Create games page shell**

Create `app/pages/games.vue`:
- Header: "🎮 旅行小游戏" + description
- `activeGame` ref (null | 'roulette' | 'quiz' | 'packing' | 'match')
- When `activeGame` is null: show 4 game cards (icon, title, desc, reward tag)
- When a game is active: hide menu, show corresponding game component + "← 返回游戏列表" button
- Style: games-grid with `repeat(auto-fill, minmax(260px, 1fr))`
- Match reference lines 350-378 for game card layout

- [ ] **Step 2: Create RouletteGame component**

Create `app/components/games/RouletteGame.vue`:
- Uses Canvas to draw 12-slice wheel (copy drawing logic from reference lines 891-908). Draw the wheel once on mount. Spin by applying CSS `transform: rotate(Xdeg)` to the canvas element itself — do NOT redraw the canvas during animation.
- Spin state tracked in localStorage key `travelrpg2_roulette` with `{ date, spins }` — resets daily via `new Date().toDateString()` comparison
- Spin animation: CSS `transform: rotate()` with `transition: 4s cubic-bezier(.1,.7,.1,1)`
- On spin complete (4.2s timeout): show result panel with destination name, emoji, description, best season
- Awards +15 EXP per spin via `useGameState().addExp(15)`
- Disable button when 3 spins used today
- Match reference logic lines 917-948

- [ ] **Step 3: Create QuizGame component**

Create `app/components/games/QuizGame.vue`:
- On start: shuffle questions, pick 10, reset score
- Show: progress (N/10), current EXP hint, question text, 4 option buttons
- On answer: disable all buttons, highlight correct (green) / wrong (red), show feedback with explanation, show "下一题" button
- Correct answer: add question's `exp` to score and to game state
- After 10 questions: show score summary with icon (🏆/🌟/📚 based on percentage)
- 80%+ score (8+ correct out of 10 questions): +50 bonus EXP + "quiz-master" medal
- "再来一轮" button restarts
- Match reference logic lines 965-1025

- [ ] **Step 4: Verify roulette and quiz**

Run dev server, navigate to `/games`:
1. Click roulette → wheel spins, shows result, EXP increases
2. Spin 3 times → button disabled, count shows 0
3. Click quiz → questions appear, answering works, score shows at end

- [ ] **Step 5: Commit**

```bash
git add app/pages/games.vue app/components/games/RouletteGame.vue app/components/games/QuizGame.vue
git commit -m "feat: add games page with roulette wheel and travel quiz

Canvas roulette with daily spin limit, quiz with 20+ question bank,
scoring, medals, and EXP rewards."
```

---

### Task 8: Mini-Games — Packing & Matching

**Files:**
- Create: `app/components/games/PackingGame.vue`
- Create: `app/components/games/MatchGame.vue`

- [ ] **Step 1: Create PackingGame component**

Create `app/components/games/PackingGame.vue`:
- Setup phase: 6 destination buttons (beach/mountain/city/winter/desert/rainforest), select one → enable "开始打包" button
- Game phase: shows destination title, instructions, empty suitcase area, shuffled items pool
- Click item: if trap → add `wrong-pick` class with shake animation; if valid → toggle selected, move to/from suitcase display
- Submit: count correct items vs. `must` list, show result (perfect/good/bad) with EXP reward
- Perfect pack: +80 EXP + "packing-pro" medal; 60%+: +40 EXP; below: +10 EXP
- Match reference logic lines 1028-1116

- [ ] **Step 2: Create MatchGame component**

Create `app/components/games/MatchGame.vue`:
- Init: duplicate 8 landmarks into 16 cards, shuffle, render 4x4 grid
- Each card shows "?" face-down, click to flip (show icon)
- Two-card comparison: match → mark matched (green); no match → flip back after 800ms
- Lock clicks during comparison
- Timer counts up every second, flip counter increments on each pair attempt
- All 8 pairs matched → end game, +60 EXP, show restart button
- If completed in ≤60s → "match-speed" medal
- Achievement popup on completion
- Match reference logic lines 1118-1182

- [ ] **Step 3: Wire packing and match into games page**

Update `app/pages/games.vue` template to add `<PackingGame>` and `<MatchGame>` branches in the `activeGame` conditional rendering (the games page was created in Task 7 with only roulette and quiz wired up).

- [ ] **Step 4: Verify all 4 games**

Run dev server:
1. Packing: select desert → pack items → submit → see score
2. Match: flip cards → match pairs → complete → check time medal

- [ ] **Step 5: Commit**

```bash
git add app/components/games/PackingGame.vue app/components/games/MatchGame.vue app/pages/games.vue
git commit -m "feat: add packing challenge and landmark matching mini-games

6 packing scenarios including new desert/rainforest, 4x4 matching grid
with timer and speed medal."
```

---

### Task 9: Chapter Theme Decorations & Polish

**Files:**
- Modify: `app/pages/chapter/[id].vue` (add background patterns)
- Modify: `app/components/ChapterCard.vue` (add hover glow with theme color)
- Modify: `app/app.vue` (polish global styles)

- [ ] **Step 1: Add chapter background decorative patterns**

Update `app/pages/chapter/[id].vue` — add a `::before` pseudo-element on the chapter page container that uses `var(--theme-pattern)` as `background-image`. Each chapter's pattern is a CSS gradient or repeating pattern defined in the chapter's `theme.pattern` string:

- Japan: `radial-gradient(circle at 20% 80%, rgba(232,160,191,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(232,160,191,0.06) 0%, transparent 50%)`
- Korea: `linear-gradient(180deg, rgba(74,158,255,0.03) 0%, transparent 40%)`
- SE Asia: `radial-gradient(ellipse at 50% 100%, rgba(0,184,148,0.05) 0%, transparent 60%)`
- China: `radial-gradient(ellipse at 30% 10%, rgba(192,57,43,0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 90%, rgba(243,156,18,0.04) 0%, transparent 50%)`
- Europe: `repeating-linear-gradient(90deg, rgba(44,62,140,0.02) 0px, rgba(44,62,140,0.02) 1px, transparent 1px, transparent 60px)`
- Americas: `linear-gradient(135deg, rgba(225,112,85,0.04) 0%, transparent 50%)`
- Africa: `repeating-linear-gradient(45deg, rgba(212,160,23,0.03) 0px, transparent 10px, transparent 20px)`
- Oceania: `radial-gradient(circle at 25% 25%, rgba(0,206,201,0.04) 0%, transparent 30%), radial-gradient(circle at 75% 75%, rgba(0,206,201,0.04) 0%, transparent 30%)`

The pseudo-element should be `position: fixed; inset: 0; z-index: 0; pointer-events: none;`.

- [ ] **Step 2: Add chapter-themed hover glow to ChapterCard**

Update `app/components/ChapterCard.vue` — on hover, the card border color should use the chapter's `theme.primary` via inline style binding. Add `box-shadow: 0 12px 30px rgba(primary, 0.2)` on hover using the chapter's primary color.

- [ ] **Step 3: Polish global styles in app.vue**

Ensure `app/app.vue` includes:
- Custom scrollbar styling (thin, dark)
- `.empty` class for empty states
- Fade page transition CSS:
```css
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
```

- [ ] **Step 4: Full end-to-end test**

Run dev server and verify complete flow:
1. World map → all 8 chapters visible, locked ones show EXP requirement
2. Click Japan → themed pink/red visuals, background decoration visible
3. Complete multiple tasks → EXP bar grows, level up title changes, avatar changes
4. Check medals page → earned medals glow gold
5. Play all 4 mini-games → EXP rewards work
6. Accumulate 300+ EXP → Europe chapter unlocks
7. Navigate between all pages → transitions are smooth

- [ ] **Step 5: Commit**

```bash
git add app/pages/chapter/ app/components/ChapterCard.vue app/app.vue
git commit -m "feat: add chapter theme decorations, hover effects, and visual polish

Per-chapter background patterns, themed hover glow on cards, global
scrollbar styling, page transition animations."
```

---

### Task 10: Final Review & Cleanup

**Files:**
- All files created in Tasks 1-9

- [ ] **Step 1: Run typecheck**

Run: `cd /data/workspace && npx nuxi typecheck`
Expected: No errors.

- [ ] **Step 2: Run build**

Run: `cd /data/workspace && npx nuxi build`
Expected: Build completes successfully.

- [ ] **Step 3: Fix any issues found**

Address any TypeScript errors, build warnings, or rendering issues discovered in steps 1-2.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: fix build issues and final cleanup for Phase 1"
```
