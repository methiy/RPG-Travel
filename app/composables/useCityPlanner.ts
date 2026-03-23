import type { Task, ItineraryDay } from '~/types'
import { TASKS } from '~/data/tasks'
import { CITIES } from '~/data/cities'
import { COUNTRIES } from '~/data/countries'
import { getCityIdByName } from '~/data/city-name-map'

const DAY_COLORS = ['#4a9eff', '#00b894', '#fdcb6e', '#e17055', '#a29bfe', '#fd79a8', '#00cec9', '#fab1a0']

/** Haversine distance in km */
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Get tasks for a specific city (by Chinese name) in a country */
function getTasksForCity(countryId: string, cityName: string): Task[] {
  const tasks = TASKS[countryId] ?? []
  return tasks.filter(t => t.city === cityName)
}

/** Get all unique city names for a country */
function getCityNamesForCountry(countryId: string): string[] {
  const tasks = TASKS[countryId] ?? []
  const names = new Set<string>()
  for (const t of tasks) names.add(t.city)
  return [...names]
}

/** Get cities (from CITIES data) for a country */
function getCitiesForCountry(countryId: string) {
  return CITIES.filter(c => c.countryId === countryId)
}

/** Compute center point of tasks with locations */
function computeCenter(tasks: Task[]): { lat: number; lng: number } | null {
  const located = tasks.filter(t => t.location)
  if (located.length === 0) return null
  const sumLat = located.reduce((s, t) => s + t.location!.lat, 0)
  const sumLng = located.reduce((s, t) => s + t.location!.lng, 0)
  return { lat: sumLat / located.length, lng: sumLng / located.length }
}

/** Greedy nearest-neighbor sort */
function sortByNearest(tasks: Task[]): Task[] {
  const located = tasks.filter(t => t.location)
  const noLocation = tasks.filter(t => !t.location)

  if (located.length <= 1) return [...located, ...noLocation]

  const sorted: Task[] = []
  const remaining = [...located]

  // Start from the first task
  sorted.push(remaining.shift()!)

  while (remaining.length > 0) {
    const last = sorted[sorted.length - 1]
    let nearestIdx = 0
    let nearestDist = Infinity

    for (let i = 0; i < remaining.length; i++) {
      const d = haversine(
        last.location!.lat, last.location!.lng,
        remaining[i].location!.lat, remaining[i].location!.lng
      )
      if (d < nearestDist) {
        nearestDist = d
        nearestIdx = i
      }
    }
    sorted.push(remaining.splice(nearestIdx, 1)[0])
  }

  // Append tasks without location
  sorted.push(...noLocation)
  return sorted
}

/** Split tasks into days: max 4 per day, or split on >10km gap */
function splitIntoDays(sortedTasks: Task[], maxPerDay = 4, maxGapKm = 10): Task[][] {
  if (sortedTasks.length === 0) return []

  const days: Task[][] = [[]]

  for (let i = 0; i < sortedTasks.length; i++) {
    const task = sortedTasks[i]
    const currentDay = days[days.length - 1]

    // Check if we need a new day
    if (currentDay.length > 0) {
      const prevTask = currentDay[currentDay.length - 1]
      const needNewDay =
        currentDay.length >= maxPerDay ||
        (prevTask.location && task.location &&
          haversine(prevTask.location.lat, prevTask.location.lng, task.location.lat, task.location.lng) > maxGapKm)

      if (needNewDay) {
        days.push([])
      }
    }

    days[days.length - 1].push(task)
  }

  return days
}

/** Extract guide data from tasks for a day */
function extractGuideData(tasks: Task[]) {
  const foodSpots: string[] = []
  const transport: string[] = []
  const budget: string[] = []
  const bestTimes: string[] = []
  const tips: string[] = []
  const localTips: string[] = []

  for (const t of tasks) {
    if (!t.guide) continue
    if (t.guide.foodSpots?.length) foodSpots.push(...t.guide.foodSpots)
    if (t.guide.transport?.length) transport.push(...t.guide.transport)
    if (t.guide.budget) budget.push(t.guide.budget)
    if (t.guide.bestTime) bestTimes.push(`${t.name}: ${t.guide.bestTime}`)
    if (t.guide.tips?.length) tips.push(...t.guide.tips)
    if (t.guide.localTips?.length) localTips.push(...t.guide.localTips)
  }

  // Deduplicate
  return {
    foodSpots: [...new Set(foodSpots)],
    transport: [...new Set(transport)],
    budget: [...new Set(budget)],
    bestTimes: [...new Set(bestTimes)],
    tips: [...new Set(tips)],
    localTips: [...new Set(localTips)],
  }
}

/** Build itinerary days from selected tasks */
function buildItinerary(selectedTasks: Task[]): ItineraryDay[] {
  const sorted = sortByNearest(selectedTasks)
  const dayGroups = splitIntoDays(sorted)

  return dayGroups.map((tasks, idx) => {
    const guide = extractGuideData(tasks)
    return {
      dayNum: idx + 1,
      color: DAY_COLORS[idx % DAY_COLORS.length],
      tasks,
      totalExp: tasks.reduce((s, t) => s + t.exp, 0),
      ...guide,
    }
  })
}

export function useCityPlanner() {
  return {
    DAY_COLORS,
    haversine,
    getTasksForCity,
    getCityNamesForCountry,
    getCitiesForCountry,
    computeCenter,
    sortByNearest,
    splitIntoDays,
    extractGuideData,
    buildItinerary,
  }
}
