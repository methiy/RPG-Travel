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
  openHours?: string       // "09:00-17:00，周一闭馆"
  safetyNotes?: string[]   // ["山路湿滑注意"]
  photoTips?: string[]     // ["日落前1小时最佳"]
}

// 国家攻略
export interface CountryGuide {
  visa: string                 // "中国护照免签30天"
  currency: string             // "日元(JPY)，1CNY≈20JPY"
  language: string[]           // ["日语为主", "旅游区英语通用"]
  emergencyContacts: string[]  // ["警察: 110", "中国大使馆: 03-3403-3388"]
  bestSeasons: string          // "3-5月樱花季、10-11月红叶季"
  budgetRange: string          // "每日500-1500元"
  culturalDos: string[]        // ["进寺庙脱鞋", "鞠躬致谢"]
  culturalDonts: string[]      // ["不要在电车大声说话"]
  packingEssentials: string[]  // ["转换插头(A型)", "现金"]
  safetyNotes: string[]        // ["治安极好", "注意地震"]
}

// 城市攻略
export interface CityGuide {
  transport: string[]          // ["地铁发达，买Suica卡"]
  weather: string              // "夏季30-35°C，冬季0-10°C"
  localHighlights: string[]    // ["涩谷潮流", "浅草传统"]
  safetyTips: string[]         // ["歌舞伎町夜间注意"]
  recommendedDays: string      // "建议3-5天"
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
  guide?: CountryGuide
}

export interface City {
  id: string
  countryId: string
  name: string
  emoji: string
  description: string
  guide?: CityGuide
}

export interface CheckinPhoto {
  id?: number
  taskId: string
  dataUrl: string
  timestamp: number
  lat?: number
  lng?: number
  comment?: string
}

export interface AuthUser {
  id: number
  username: string
  displayName: string
}

// ── City Planner Types ────────────────────────────────
export interface MapMarkerData {
  id: string
  name: string
  lat: number
  lng: number
  color: string
  label?: string       // Day label like "D1-1"
  popupHtml?: string
}

// ── AI Types ────────────────────────────────────────────
export type AIProvider = 'openai' | 'claude' | 'deepseek' | 'gemini'

export interface AISettings {
  provider: AIProvider
  apiKey: string          // encrypted in DB, masked on client
  baseUrl?: string        // custom API endpoint
  model?: string          // model name override
}

export interface AIChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIPhotoAnalysis {
  scene: string           // 场景描述
  landmarks: string[]     // 地标识别
  diary: string           // 旅行日记
}

// ── City Planner Types ────────────────────────────────
export interface ItineraryDay {
  dayNum: number
  color: string
  tasks: Task[]
  totalExp: number
  foodSpots: string[]
  transport: string[]
  budget: string[]
  bestTimes: string[]
  tips: string[]
  localTips: string[]
  openHours: string[]
  safetyNotes: string[]
  photoTips: string[]
}

// ── Share/Export Types ────────────────────────────────
export type ShareTemplate = 'overview' | 'trip' | 'medals'

export interface OverviewSnapshot {
  username: string
  displayName: string
  avatar: string
  level: number
  title: string
  exp: number
  countriesCount: number
  citiesCount: number
  completedCount: number
  medalCount: number
  achievementCount: number
}

export interface TripSnapshot {
  username: string
  displayName: string
  avatar: string
  level: number
  title: string
  countryId: string
  countryName: string
  countryEmoji: string
  cities: string[]
  completedTasks: number
  totalTasks: number
  medals: Array<{ icon: string; name: string }>
  photos: string[]  // dataUrl strings, max 4
}

export interface MedalsSnapshot {
  username: string
  displayName: string
  avatar: string
  level: number
  title: string
  earnedMedals: Array<{ icon: string; name: string }>
  totalMedals: number
  rarestMedal: { icon: string; name: string } | null
}

export type ShareSnapshotData = OverviewSnapshot | TripSnapshot | MedalsSnapshot

export interface ShareRecord {
  id: string
  template: ShareTemplate
  snapshot: ShareSnapshotData
  createdAt: string
}
