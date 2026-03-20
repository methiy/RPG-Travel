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

export function useGameState() {
  const state = useState<GameState>('game-state', () => loadLocalState())
  const { isLoggedIn } = useAuth()

  // Dirty flag: set when local state has unsaved changes
  // Prevents loadFromServer from overwriting local changes
  const dirty = useState<boolean>('game-state-dirty', () => false)

  // Single sync promise to prevent concurrent PUT requests
  let syncPromise: Promise<void> | null = null
  let syncTimeout: ReturnType<typeof setTimeout> | null = null

  async function syncToServer() {
    // Take a snapshot of current state to send
    const snapshot: GameState = {
      exp: state.value.exp,
      completed: [...state.value.completed],
      medals: [...state.value.medals],
    }
    try {
      await $fetch('/api/progress', {
        method: 'PUT',
        body: snapshot,
      })
      dirty.value = false
    } catch {
      // Silently fail — localStorage has the backup
    }
  }

  function scheduleSyncToServer() {
    if (!isLoggedIn.value) return
    if (syncTimeout) clearTimeout(syncTimeout)
    syncTimeout = setTimeout(() => {
      // Chain syncs to avoid concurrent PUT requests
      if (syncPromise) {
        syncPromise = syncPromise.then(() => syncToServer())
      } else {
        syncPromise = syncToServer().finally(() => { syncPromise = null })
      }
    }, 300)
  }

  if (import.meta.client) {
    onNuxtReady(async () => {
      // Only load from server if no local unsaved changes
      if (isLoggedIn.value && !dirty.value) {
        await loadFromServer()
      }
    })

    watch(state, (val) => {
      // Always save to localStorage immediately
      saveLocalState(val)

      // Schedule debounced sync to server
      scheduleSyncToServer()
    }, { deep: true })
  }

  /** Load progress from server (call after login) */
  async function loadFromServer() {
    // Don't overwrite unsaved local changes
    if (dirty.value) return

    try {
      const data = await $fetch('/api/progress')
      // Double-check dirty flag — user may have acted while request was in flight
      if (dirty.value) return

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
      dirty.value = false
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
    dirty.value = true
    state.value.completed.push(taskId)
    state.value.exp += exp
    if (!state.value.medals.includes(medalId)) {
      state.value.medals.push(medalId)
    }
  }

  function addExp(amount: number) {
    dirty.value = true
    state.value.exp += amount
  }

  function addMedal(medalId: string) {
    if (!state.value.medals.includes(medalId)) {
      dirty.value = true
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
