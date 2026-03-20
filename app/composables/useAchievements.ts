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
        const countryIds = COUNTRIES.filter(c => c.continentId === cond.continentId).map(c => c.id)
        const tasksInContinent = allTasks.filter(t => countryIds.includes(t.country))
        const count = tasksInContinent.filter(t => completed.includes(t.id)).length
        return { current: count, target: cond.count }
      }

      case 'tasks_country': {
        const countryTasks = allTasks.filter(t => t.country === cond.countryId)
        const completedInCountry = countryTasks.filter(t => completed.includes(t.id)).length
        // count: 999 means "all tasks in country"
        const target = cond.count === 999 ? countryTasks.length : cond.count
        return { current: completedInCountry, target }
      }

      case 'countries_total': {
        const countries = new Set(
          allTasks.filter(t => completed.includes(t.id)).map(t => t.country)
        )
        return { current: countries.size, target: cond.count }
      }

      case 'countries_continent': {
        const countryIds = COUNTRIES.filter(c => c.continentId === cond.continentId).map(c => c.id)
        const visitedCountries = new Set(
          allTasks
            .filter(t => completed.includes(t.id) && countryIds.includes(t.country))
            .map(t => t.country)
        )
        return { current: visitedCountries.size, target: cond.count }
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
