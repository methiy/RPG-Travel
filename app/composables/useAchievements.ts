import { ACHIEVEMENTS } from '~/data/achievements'
import type { Achievement } from '~/data/achievements'
import { TASKS } from '~/data/tasks'
import { COUNTRIES } from '~/data/countries'

export interface AchievementStatus {
  achievement: Achievement
  unlocked: boolean
  current: number
  target: number
  progress: number  // 0-100
}

export function useAchievements() {
  const { state: gameState } = useGameState()
  const { state: checkinState } = useDailyCheckin()
  const { getPhotos } = usePhotoCheckin()

  const allTasks = Object.values(TASKS).flat()

  // Build taskId → countryId lookup (Task.country is Chinese name, we need countryId)
  const taskCountryIdMap = new Map<string, string>()
  for (const [countryId, tasks] of Object.entries(TASKS)) {
    for (const task of tasks) {
      taskCountryIdMap.set(task.id, countryId)
    }
  }

  const statuses = computed<AchievementStatus[]>(() => {
    return ACHIEVEMENTS.map((ach) => {
      const { current, target } = evaluateCondition(ach)
      const unlocked = current >= target
      const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0
      return { achievement: ach, unlocked, current, target, progress }
    })
  })

  const unlockedCount = computed(() => statuses.value.filter(s => s.unlocked).length)
  const totalCount = ACHIEVEMENTS.length

  function evaluateCondition(ach: Achievement): { current: number; target: number } {
    const completed = gameState.value.completed
    const cond = ach.condition

    switch (cond.type) {
      case 'tasks_total':
        return { current: completed.length, target: cond.count }

      case 'tasks_continent': {
        const countryIds = new Set(COUNTRIES.filter(c => c.continentId === cond.continentId).map(c => c.id))
        const count = completed.filter(id => {
          const cId = taskCountryIdMap.get(id)
          return cId ? countryIds.has(cId) : false
        }).length
        return { current: count, target: cond.count }
      }

      case 'tasks_country': {
        const countryTasks = TASKS[cond.countryId] ?? []
        const completedInCountry = countryTasks.filter(t => completed.includes(t.id)).length
        // count: 999 means "all tasks in country"
        const target = cond.count === 999 ? countryTasks.length : cond.count
        return { current: completedInCountry, target }
      }

      case 'countries_total': {
        const visitedCountryIds = new Set(
          completed.map(id => taskCountryIdMap.get(id)).filter(Boolean)
        )
        return { current: visitedCountryIds.size, target: cond.count }
      }

      case 'countries_continent': {
        const countryIds = new Set(COUNTRIES.filter(c => c.continentId === cond.continentId).map(c => c.id))
        const visitedInContinent = new Set(
          completed
            .map(id => taskCountryIdMap.get(id))
            .filter((cId): cId is string => !!cId && countryIds.has(cId))
        )
        return { current: visitedInContinent.size, target: cond.count }
      }

      case 'cities_total': {
        const cities = new Set(
          allTasks.filter(t => completed.includes(t.id)).map(t => t.city)
        )
        return { current: cities.size, target: cond.count }
      }

      case 'medals_total':
        return { current: gameState.value.medals.length, target: cond.count }

      case 'difficulty': {
        const count = allTasks.filter(
          t => t.difficulty === cond.difficulty && completed.includes(t.id)
        ).length
        return { current: count, target: cond.count }
      }

      case 'exp_total':
        return { current: gameState.value.exp, target: cond.amount }

      case 'streak':
        return { current: checkinState.value.maxStreak, target: cond.days }

      case 'photos_total':
        return { current: getPhotos().length, target: cond.count }

      case 'checkin_total':
        return { current: checkinState.value.total, target: cond.count }

      default:
        return { current: 0, target: 1 }
    }
  }

  return {
    statuses,
    unlockedCount,
    totalCount,
  }
}
