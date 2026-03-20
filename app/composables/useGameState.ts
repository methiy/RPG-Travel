import type { GameState, LevelInfo } from '~/types'
import { TASKS } from '~/data/tasks'
import { LEVELS, AVATARS } from '~/data/levels'

const STORAGE_KEY = 'travelrpg2'

function loadLocalState(): GameState {
  if (import.meta.server) return { exp: 0, completed: [], medals: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { exp: 0, completed: [], medals: [] }
}

function saveLocalState(s: GameState) {
  if (import.meta.server) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

/** Merge local and server state: pick whichever has more progress */
function mergeStates(local: GameState, server: GameState): GameState {
  // Use the one with higher exp as base, then union completed/medals
  const mergedCompleted = [...new Set([...local.completed, ...server.completed])]
  const mergedMedals = [...new Set([...local.medals, ...server.medals])]
  const mergedExp = Math.max(local.exp, server.exp)
  return { exp: mergedExp, completed: mergedCompleted, medals: mergedMedals }
}

export function useGameState() {
  const state = useState<GameState>('game-state', () => loadLocalState())
  const { isLoggedIn } = useAuth()

  // Sync queue: only one PUT in flight at a time
  let syncPromise: Promise<void> | null = null

  async function syncToServer(): Promise<void> {
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
    } catch {
      // Silently fail — localStorage has the backup
    }
  }

  /** Queue a sync — waits for any in-flight sync to finish first */
  function queueSync() {
    if (!isLoggedIn.value) return
    if (syncPromise) {
      syncPromise = syncPromise.then(() => syncToServer())
    } else {
      syncPromise = syncToServer().finally(() => { syncPromise = null })
    }
  }

  if (import.meta.client) {
    // On app ready: merge local + server data (neither side blindly wins)
    onNuxtReady(async () => {
      if (isLoggedIn.value) {
        try {
          const serverData = await $fetch('/api/progress')
          const local = loadLocalState()
          const merged = mergeStates(local, {
            exp: serverData.exp,
            completed: serverData.completed,
            medals: serverData.medals,
          })
          state.value = merged
          saveLocalState(merged)
          // Push merged result back to server if local had extra data
          if (merged.exp > serverData.exp
            || merged.completed.length > serverData.completed.length
            || merged.medals.length > serverData.medals.length) {
            queueSync()
          }
        } catch {
          // Server unreachable — keep localStorage data
          state.value = loadLocalState()
        }
      } else {
        state.value = loadLocalState()
      }
    })

    // Watch for changes: save to localStorage immediately, sync on debounce
    let syncTimeout: ReturnType<typeof setTimeout> | null = null
    watch(state, (val) => {
      saveLocalState(val)
      if (isLoggedIn.value) {
        if (syncTimeout) clearTimeout(syncTimeout)
        syncTimeout = setTimeout(() => queueSync(), 300)
      }
    }, { deep: true })

    // Flush pending sync on page unload so data is never lost
    window.addEventListener('beforeunload', () => {
      if (syncTimeout) {
        clearTimeout(syncTimeout)
      }
      // Use fetch with keepalive for reliable delivery during unload
      if (isLoggedIn.value) {
        const snapshot = JSON.stringify({
          exp: state.value.exp,
          completed: state.value.completed,
          medals: state.value.medals,
        })
        try {
          fetch('/api/progress', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: snapshot,
            keepalive: true,
          })
        } catch {
          // Last resort — data is still in localStorage
        }
      }
    })
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
