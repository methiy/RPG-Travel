import type { Task } from '~/types'
import { TASKS } from '~/data/tasks'
import { CONTINENTS } from '~/data/continents'
import { COUNTRIES } from '~/data/countries'
import { ALL_MEDALS } from '~/data/medals'

interface HighlightItem {
  icon: string
  value: number
  label: string
  color: string
}

interface ContinentProgressItem {
  id: string
  name: string
  emoji: string
  color: string
  completed: number
  total: number
  percent: number
  conquered: boolean
}

interface DifficultyItem {
  key: string
  label: string
  color: string
  count: number
  percent: number
}

interface CalendarDay {
  date: string
  count: number
  level: number
}

interface MilestoneItem {
  id: string
  icon: string
  name: string
  condition: string
  unlocked: boolean
}

export function useStats() {
  const { state, countriesCount, completedCount, medalCount } = useGameState()
  const { getPhotos } = usePhotoCheckin()

  const allTasks = computed(() => Object.values(TASKS).flat())

  const highlights = computed<HighlightItem[]>(() => {
    const completedSet = new Set(state.value.completed)
    const continentsVisited = new Set(
      allTasks.value
        .filter(t => completedSet.has(t.id))
        .map(t => {
          const country = COUNTRIES.find(c => c.id === t.country)
          return country?.continentId
        })
        .filter(Boolean),
    )
    return [
      { icon: '🌍', value: countriesCount.value, label: '个国家', color: '#4a9eff' },
      { icon: '🏅', value: medalCount.value, label: '枚勋章', color: '#ffd700' },
      { icon: '🗺️', value: continentsVisited.size, label: '大洲', color: '#a78bfa' },
      { icon: '⚡', value: state.value.exp, label: 'EXP', color: '#f59e0b' },
    ]
  })

  const continentColors: Record<string, string> = {
    asia: '#ff6b6b',
    europe: '#4a9eff',
    americas: '#ffd700',
    'africa-me': '#f59e0b',
    oceania: '#a78bfa',
  }

  const continentProgress = computed<ContinentProgressItem[]>(() => {
    const completedSet = new Set(state.value.completed)
    return CONTINENTS.map(continent => {
      const countriesInContinent = COUNTRIES.filter(c => c.continentId === continent.id)
      const countryIds = new Set(countriesInContinent.map(c => c.id))
      const tasksInContinent = allTasks.value.filter(t => countryIds.has(t.country))
      const completedInContinent = tasksInContinent.filter(t => completedSet.has(t.id))
      const total = tasksInContinent.length
      const completed = completedInContinent.length
      const percent = total > 0 ? Math.round(completed / total * 100) : 0
      return {
        id: continent.id,
        name: continent.name,
        emoji: continent.emoji,
        color: continentColors[continent.id] || '#4a9eff',
        completed,
        total,
        percent,
        conquered: total > 0 && completed === total,
      }
    })
  })

  const difficultyDistribution = computed<DifficultyItem[]>(() => {
    const completedSet = new Set(state.value.completed)
    const completedTasks = allTasks.value.filter(t => completedSet.has(t.id))
    const total = completedTasks.length || 1
    const diffs: { key: string; label: string; color: string }[] = [
      { key: 'easy', label: '简单', color: '#4ade80' },
      { key: 'medium', label: '中等', color: '#4a9eff' },
      { key: 'hard', label: '困难', color: '#f59e0b' },
      { key: 'legendary', label: '传奇', color: '#ef4444' },
    ]
    return diffs.map(d => {
      const count = completedTasks.filter(t => t.difficulty === d.key).length
      return { ...d, count, percent: Math.round(count / total * 100) }
    })
  })

  const activityCalendar = computed<CalendarDay[]>(() => {
    const photos = getPhotos()
    const countMap = new Map<string, number>()
    for (const p of photos) {
      if (!p.timestamp) continue
      const date = new Date(p.timestamp).toISOString().slice(0, 10)
      countMap.set(date, (countMap.get(date) || 0) + 1)
    }

    const days: CalendarDay[] = []
    const now = new Date()
    for (let i = 89; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      const count = countMap.get(dateStr) || 0
      const level = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : 3
      days.push({ date: dateStr, count, level })
    }
    return days
  })

  const milestones = computed<MilestoneItem[]>(() => {
    const completedSet = new Set(state.value.completed)
    const taskCount = completedSet.size
    const countryCount = countriesCount.value
    const medalCnt = medalCount.value
    const exp = state.value.exp

    const hasConqueredCountry = COUNTRIES.some(country => {
      const countryTasks = allTasks.value.filter(t => t.country === country.id)
      return countryTasks.length > 0 && countryTasks.every(t => completedSet.has(t.id))
    })

    const hasConqueredContinent = CONTINENTS.some(continent => {
      const countriesInContinent = COUNTRIES.filter(c => c.continentId === continent.id)
      const countryIds = new Set(countriesInContinent.map(c => c.id))
      const tasksInContinent = allTasks.value.filter(t => countryIds.has(t.country))
      return tasksInContinent.length > 0 && tasksInContinent.every(t => completedSet.has(t.id))
    })

    return [
      { id: 'first-task', icon: '🎒', name: '初出茅庐', condition: '完成第 1 个任务', unlocked: taskCount >= 1 },
      { id: 'ten-tasks', icon: '🌟', name: '十任达人', condition: '完成 10 个任务', unlocked: taskCount >= 10 },
      { id: 'hundred-tasks', icon: '💪', name: '百任勇士', condition: '完成 100 个任务', unlocked: taskCount >= 100 },
      { id: 'first-country', icon: '🏴', name: '首国征服', condition: '完成 1 个国家全部任务', unlocked: hasConqueredCountry },
      { id: 'five-countries', icon: '🗺️', name: '五国旅行家', condition: '去过 5 个国家', unlocked: countryCount >= 5 },
      { id: 'ten-medals', icon: '🏅', name: '勋章收藏家', condition: '获得 10 枚勋章', unlocked: medalCnt >= 10 },
      { id: 'continent-conquer', icon: '🌍', name: '大洲征服者', condition: '某大洲任务 100% 完成', unlocked: hasConqueredContinent },
      { id: 'exp-10k', icon: '🚀', name: 'EXP 破万', condition: '累计 10000 EXP', unlocked: exp >= 10000 },
    ]
  })

  return {
    highlights,
    continentProgress,
    difficultyDistribution,
    activityCalendar,
    milestones,
  }
}
