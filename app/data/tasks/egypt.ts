import type { Task } from '~/types'

export const egyptTasks: Task[] = [
  {
    id: 'af1', city: '埃及', name: '站在吉萨金字塔前', difficulty: 'easy', country: '埃及',
    desc: '吉萨金字塔群是古代世界七大奇迹中唯一现存的奇迹。站在胡夫金字塔前，感受4500年的时光重量。',
    objectives: ['在胡夫金字塔前拍照📸', '骑骆驼穿越沙漠', '参观狮身人面像'],
    exp: 100, medal: { id: 'pyramid', icon: '🔺', name: '金字塔见证者', desc: '站在人类最古老的奇迹前' },
    location: { lat: 29.9792, lng: 31.1342, radius: 500 },
  },
]
