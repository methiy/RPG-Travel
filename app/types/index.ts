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

export interface Medal {
  id: string
  icon: string
  name: string
  desc: string
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
