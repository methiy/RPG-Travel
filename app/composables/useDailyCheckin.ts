import type { CheckinState } from '~/types'

const STORAGE_KEY = 'travelrpg2_checkin'

const MILESTONES = [7, 14, 30] as const
const MILESTONE_INFO: Record<number, { medalId: string; icon: string; name: string; exp: number }> = {
  7: { medalId: 'streak-7', icon: '🔥', name: '一周坚持', exp: 50 },
  14: { medalId: 'streak-14', icon: '🔥', name: '两周不断', exp: 100 },
  30: { medalId: 'streak-30', icon: '🔥', name: '月度旅行家', exp: 200 },
}

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function loadLocal(): CheckinState {
  if (import.meta.server) return { lastDate: null, streak: 0, total: 0, maxStreak: 0 }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { lastDate: null, streak: 0, total: 0, maxStreak: 0 }
}

function saveLocal(state: CheckinState) {
  if (import.meta.server) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useDailyCheckin() {
  const state = useState<CheckinState>('daily-checkin', () => loadLocal())
  const { isLoggedIn } = useAuth()
  const { addExp, addMedal, loadFromServer: reloadGameState, state: gameState } = useGameState()
  const { show } = useAchievement()
  const dirty = useState<boolean>('game-state-dirty')

  const checkedToday = computed(() => state.value.lastDate === getTodayStr())

  const todayReward = computed(() => {
    if (checkedToday.value) return 0
    const nextStreak = state.value.lastDate === getYesterdayStr() ? state.value.streak + 1 : 1
    const bonus = Math.min((nextStreak - 1) * 2, 40)
    return 10 + bonus
  })

  const nextMilestone = computed(() => {
    const streak = state.value.streak
    for (const m of MILESTONES) {
      if (streak < m) return m
    }
    return null
  })

  function getYesterdayStr(): string {
    return new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  }

  async function loadCheckinStatus() {
    if (isLoggedIn.value) {
      try {
        const data = await $fetch('/api/checkin/status')
        state.value = {
          lastDate: data.lastDate,
          streak: data.streak,
          total: data.total,
          maxStreak: data.maxStreak,
        }
        saveLocal(state.value)
      } catch {
        // Fall back to localStorage
        state.value = loadLocal()
      }
    } else {
      state.value = loadLocal()
    }
  }

  async function doCheckin() {
    if (checkedToday.value) return

    if (isLoggedIn.value) {
      try {
        const res = await $fetch('/api/checkin/do', { method: 'POST' })
        if (res.alreadyDone) return

        state.value = {
          lastDate: getTodayStr(),
          streak: res.streak,
          total: res.total,
          maxStreak: res.maxStreak,
        }
        saveLocal(state.value)

        // Server already persisted EXP + medal to game_progress,
        // reload from server to get the authoritative state
        dirty.value = false
        await reloadGameState()

        if (res.milestone) {
          const info = MILESTONE_INFO[res.streak]
          if (info) {
            show({
              icon: info.icon,
              title: info.name,
              sub: `连续签到${res.streak}天`,
              exp: info.exp,
              medal: info.medalId,
            })
          }
        }
        return
      } catch {
        // Fall through to local checkin
      }
    }

    // Local-only checkin
    const today = getTodayStr()
    const yesterday = getYesterdayStr()
    const prev = state.value

    let newStreak: number
    if (prev.lastDate === yesterday) {
      newStreak = prev.streak + 1
    } else {
      newStreak = 1
    }

    const newTotal = prev.total + 1
    const newMaxStreak = Math.max(prev.maxStreak, newStreak)

    state.value = { lastDate: today, streak: newStreak, total: newTotal, maxStreak: newMaxStreak }
    saveLocal(state.value)

    const bonus = Math.min((newStreak - 1) * 2, 40)
    const earned = 10 + bonus
    addExp(earned)

    // Check milestone locally
    const milestoneInfo = MILESTONE_INFO[newStreak]
    if (milestoneInfo) {
      addExp(milestoneInfo.exp)
      addMedal(milestoneInfo.medalId)
      show({
        icon: milestoneInfo.icon,
        title: milestoneInfo.name,
        sub: `连续签到${newStreak}天`,
        exp: milestoneInfo.exp,
        medal: milestoneInfo.medalId,
      })
    }
  }

  return {
    state,
    checkedToday,
    todayReward,
    nextMilestone,
    loadCheckinStatus,
    doCheckin,
  }
}
