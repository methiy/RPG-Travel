export interface ChapterTheme {
  primary: string
  secondary: string
  cardBg: string
  pattern: string
}

export interface Chapter {
  id: string
  name: string
  subtitle: string
  emoji: string
  bg: string
  unlockExp: number
  cities: string[]
  tags: string[]
  description: string
  theme: ChapterTheme
}

export interface TaskLocation {
  lat: number
  lng: number
  radius: number  // meters, how close you need to be
}

export interface Medal {
  id: string
  icon: string
  name: string
  desc: string
}

export interface TaskGuide {
  tips: string[]           // Practical travel tips
  foodSpots: string[]      // Recommended food/cafes
  transport: string[]      // How to get there
  bestTime: string         // Best time to visit
  budget: string           // Budget estimate
  localTips: string[]      // Local insider tips
}

export interface Task {
  id: string
  city: string
  name: string
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary'
  country: string
  desc: string
  objectives: string[]
  exp: number
  medal: Medal
  guide?: TaskGuide
  location?: TaskLocation
}

export interface GameState {
  exp: number
  completed: string[]
  medals: string[]
}

export interface LevelInfo {
  lv: number
  title: string
  need: number
  cur: number
}

export interface QuizQuestion {
  q: string
  opts: string[]
  ans: number
  exp: number
  explain: string
}

export interface RouletteDestination {
  name: string
  flags: string
  color: string
  desc: string
  best: string
}

export interface PackingScenario {
  id: string
  icon: string
  name: string
  must: string[]
  trap: string[]
  all: string[]
}

export interface Landmark {
  icon: string
  name: string
}

export interface Continent {
  id: string
  name: string
  emoji: string
  unlockExp: number
  description: string
}

export interface Country {
  id: string
  continentId: string
  name: string
  subtitle: string
  emoji: string
  bg: string
  cities: string[]      // city IDs
  tags: string[]
  description: string
  theme: ChapterTheme
}

export interface City {
  id: string
  countryId: string
  name: string
  emoji: string
  description: string
}
