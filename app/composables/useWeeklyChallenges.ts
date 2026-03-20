import { TASKS } from '~/data/tasks'
import { COUNTRIES } from '~/data/countries'
import { CONTINENTS } from '~/data/continents'

const STORAGE_KEY = 'travelrpg2_weekly_challenges'

export interface WeeklyChallenge {
  id: string
  weekKey: string        // 'YYYY-Www' format
  icon: string
  title: string
  desc: string
  type: 'tasks' | 'country' | 'continent' | 'difficulty' | 'photos'
  target: number
  exp: number            // reward EXP
  /** Filter used to count progress */
  filter: {
    countryId?: string
    continentId?: string
    difficulty?: string
  }
}

interface ChallengeProgress {
  weekKey: string
  completed: string[]    // challenge IDs completed this week
  claimed: string[]      // challenge IDs with claimed rewards
}

function getWeekKey(): string {
  const now = new Date()
  const yearStart = new Date(now.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((now.getTime() - yearStart.getTime()) / 86400000)
  const weekNum = Math.ceil((dayOfYear + yearStart.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

function getWeekEnd(): Date {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0=Sun
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  const end = new Date(now)
  end.setDate(end.getDate() + daysUntilSunday)
  end.setHours(23, 59, 59, 999)
  return end
}

/** Simple seeded random from week key — returns [0, 1) */
function seededRandom(seed: string): () => number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  return () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff
    // Ensure strictly less than 1 to avoid array out-of-bounds
    return (hash % 10000) / 10000
  }
}

function generateChallenges(weekKey: string): WeeklyChallenge[] {
  const rng = seededRandom(weekKey)
  const challenges: WeeklyChallenge[] = []

  // Challenge 1: Country-specific task challenge
  const countriesWithTasks = COUNTRIES.filter(c => {
    return (TASKS[c.id]?.length ?? 0) >= 3
  })
  const country = countriesWithTasks[Math.floor(rng() * countriesWithTasks.length)] ?? countriesWithTasks[0]!
  const countryTaskCount = TASKS[country.id]?.length ?? 0
  const countryTarget = Math.min(3, countryTaskCount)
  challenges.push({
    id: `${weekKey}-country`,
    weekKey,
    icon: '🗺️',
    title: `探索${country.name}`,
    desc: `本周在${country.name}完成 ${countryTarget} 个任务`,
    type: 'country',
    target: countryTarget,
    exp: countryTarget * 30,
    filter: { countryId: country.id },
  })

  // Challenge 2: Difficulty-based challenge
  const difficulties = [
    { key: 'easy', label: '简单', target: 5, exp: 60 },
    { key: 'medium', label: '中等', target: 3, exp: 80 },
    { key: 'hard', label: '困难', target: 2, exp: 100 },
  ]
  const diff = difficulties[Math.floor(rng() * difficulties.length)] ?? difficulties[0]!
  challenges.push({
    id: `${weekKey}-difficulty`,
    weekKey,
    icon: '⚔️',
    title: `${diff.label}挑战`,
    desc: `本周完成 ${diff.target} 个${diff.label}难度任务`,
    type: 'difficulty',
    target: diff.target,
    exp: diff.exp,
    filter: { difficulty: diff.key },
  })

  // Challenge 3: Continent exploration
  const continent = CONTINENTS[Math.floor(rng() * CONTINENTS.length)] ?? CONTINENTS[0]!
  challenges.push({
    id: `${weekKey}-continent`,
    weekKey,
    icon: continent.emoji,
    title: `${continent.name}探险`,
    desc: `本周在${continent.name}完成 2 个任务`,
    type: 'continent',
    target: 2,
    exp: 70,
    filter: { continentId: continent.id },
  })

  return challenges
}

function loadProgress(): ChallengeProgress {
  if (import.meta.server) return { weekKey: '', completed: [], claimed: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data.weekKey === getWeekKey()) return data
    }
  } catch {}
  return { weekKey: getWeekKey(), completed: [], claimed: [] }
}

function saveProgress(progress: ChallengeProgress) {
  if (import.meta.server) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function useWeeklyChallenges() {
  const weekKey = getWeekKey()
  const challenges = generateChallenges(weekKey)

  const progress = useState<ChallengeProgress>('weekly-challenges', () => loadProgress())

  // Reset if week changed
  if (import.meta.client && progress.value.weekKey !== weekKey) {
    progress.value = { weekKey, completed: [], claimed: [] }
    saveProgress(progress.value)
  }

  const { state: gameState } = useGameState()
  const { getPhotos } = usePhotoCheckin()

  const allTasks = Object.values(TASKS).flat()

  // Build taskId → countryId lookup (Task.country is Chinese name, we need countryId)
  const taskCountryIdMap = new Map<string, string>()
  for (const [countryId, tasks] of Object.entries(TASKS)) {
    for (const task of tasks) {
      taskCountryIdMap.set(task.id, countryId)
    }
  }

  function getChallengeProgress(challenge: WeeklyChallenge): number {
    const completed = gameState.value.completed

    switch (challenge.type) {
      case 'country': {
        const cId = challenge.filter.countryId
        return completed.filter(id => taskCountryIdMap.get(id) === cId).length
      }
      case 'difficulty': {
        return allTasks.filter(
          t => t.difficulty === challenge.filter.difficulty && completed.includes(t.id)
        ).length
      }
      case 'continent': {
        const countryIds = new Set(
          COUNTRIES.filter(c => c.continentId === challenge.filter.continentId).map(c => c.id)
        )
        return completed.filter(id => {
          const cId = taskCountryIdMap.get(id)
          return cId ? countryIds.has(cId) : false
        }).length
      }
      case 'photos':
        return getPhotos().length
      default:
        return completed.length
    }
  }

  const challengeStatuses = computed(() => {
    return challenges.map(ch => {
      const current = getChallengeProgress(ch)
      const isComplete = current >= ch.target
      const isClaimed = progress.value.claimed.includes(ch.id)
      return {
        challenge: ch,
        current: Math.min(current, ch.target),
        isComplete,
        isClaimed,
      }
    })
  })

  const { addExp } = useGameState()

  function claimReward(challengeId: string) {
    const status = challengeStatuses.value.find(s => s.challenge.id === challengeId)
    if (!status || !status.isComplete || status.isClaimed) return

    addExp(status.challenge.exp)
    progress.value.claimed.push(challengeId)
    saveProgress(progress.value)
  }

  const weekEnd = getWeekEnd()

  return {
    challenges: challengeStatuses,
    weekEnd,
    weekKey,
    claimReward,
  }
}
