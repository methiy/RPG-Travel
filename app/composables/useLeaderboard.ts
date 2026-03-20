interface LeaderboardEntry {
  rank: number
  userId: number
  displayName: string
  exp: number
  completedCount: number
  medalCount: number
}

type SortBy = 'exp' | 'completed' | 'medals'

interface LeaderboardState {
  entries: LeaderboardEntry[]
  currentUserId: number | null
  loading: boolean
  sortBy: SortBy
}

export function useLeaderboard() {
  const state = useState<LeaderboardState>('leaderboard', () => ({
    entries: [],
    currentUserId: null,
    loading: false,
    sortBy: 'exp',
  }))

  async function fetchLeaderboard(sortBy: SortBy = state.value.sortBy) {
    state.value.loading = true
    state.value.sortBy = sortBy
    try {
      const data = await $fetch('/api/leaderboard', {
        params: { sort: sortBy, limit: 50 },
      })
      state.value.entries = data.leaderboard
      state.value.currentUserId = data.currentUserId
    } catch {
      // Silently fail
    } finally {
      state.value.loading = false
    }
  }

  const currentUserRank = computed(() => {
    if (!state.value.currentUserId) return null
    return state.value.entries.find(e => e.userId === state.value.currentUserId) ?? null
  })

  return {
    state,
    fetchLeaderboard,
    currentUserRank,
  }
}
