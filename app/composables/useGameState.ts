import type { GameState, LevelInfo } from '~/types'
import { TASKS } from '~/data/tasks'

const STORAGE_KEY = 'travelrpg2'

const LEVELS: { lv: number; title: string; need: number }[] = [
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

function loadLocalState(): GameState {
  if (import.meta.server) return { exp: 0, completed: [], medals: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { exp: 0, completed: [], medals: [] }
}

function saveLocalState(state: GameState) {
  if (import.meta.server) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

let syncTimeout: ReturnType<typeof setTimeout> | null = null

async function syncToServer(state: GameState) {
  try {
    await $fetch('/api/progress', {
      method: 'PUT',
      body: { exp: state.exp, completed: state.completed, medals: state.medals },
    })
  } catch {
    // Silently fail — localStorage has the backup
  }
}

export function useGameState() {
  const state = useState<GameState>('game-state', () => loadLocalState())
  const { isLoggedIn } = useAuth()

  if (import.meta.client) {
    onNuxtReady(async () => {
      // If logged in, load from server; otherwise fall back to localStorage
      if (isLoggedIn.value) {
        await loadFromServer()
      } else {
        const loaded = loadLocalState()
        state.value = loaded
      }
    })

    watch(state, (val) => {
      // Always save to localStorage as cache
      saveLocalState(val)

      // Debounced sync to server when logged in
      if (isLoggedIn.value) {
        if (syncTimeout) clearTimeout(syncTimeout)
        syncTimeout = setTimeout(() => syncToServer(val), 500)
      }
    }, { deep: true })
  }

  /** Load progress from server (call after login) */
  async function loadFromServer() {
    try {
      const data = await $fetch('/api/progress')
      state.value = {
        exp: data.exp,
        completed: data.completed,
        medals: data.medals,
      }
      saveLocalState(state.value)
    } catch {
      // Fall back to localStorage
    }
  }

  /** Check if localStorage has data that server doesn't */
  function getLocalMigrationData(): GameState | null {
    const local = loadLocalState()
    if (local.exp === 0 && local.completed.length === 0 && local.medals.length === 0) {
      return null
    }
    return local
  }

  /** Upload local data to server */
  async function migrateLocalToServer() {
    const local = loadLocalState()
    try {
      await $fetch('/api/progress', {
        method: 'PUT',
        body: { exp: local.exp, completed: local.completed, medals: local.medals },
      })
      state.value = local
    } catch {
      // Keep local data if upload fails
    }
  }

  const levelInfo = computed<LevelInfo>(() => {
    let rem = state.value.exp
    for (const l of LEVELS) {
      if (rem < l.need) return { lv: l.lv, title: l.title, need: l.need, cur: rem }
      rem -= l.need
    }
    const last = LEVELS[LEVELS.length - 1]!
    return { lv: last.lv, title: last.title, need: last.need, cur: rem }
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
    state, levelInfo, avatar, completedCount, medalCount, countriesCount,
    completeTask, addExp, addMedal, hasMedal, isTaskCompleted,
    loadFromServer, getLocalMigrationData, migrateLocalToServer,
  }
}
