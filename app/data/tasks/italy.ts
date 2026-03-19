import type { Task } from '~/types'

export const italyTasks: Task[] = [
  {
    id: 'eu2', city: '意大利', name: '在罗马竞技场感受历史', difficulty: 'medium', country: '意大利',
    desc: '斗兽场矗立了近2000年，站在这里你能感受到整个罗马帝国的重量。周边的罗马广场是免费的历史露天博物馆。',
    objectives: ['入场参观竞技场内部', '在罗马广场漫步', '品尝传统罗马冰淇淋（gelato）'],
    exp: 220, medal: { id: 'colosseum', icon: '🏛️', name: '罗马帝国访客', desc: '踏入2000年历史的斗兽场' },
    location: { lat: 41.8902, lng: 12.4922, radius: 200 },
  },
]
