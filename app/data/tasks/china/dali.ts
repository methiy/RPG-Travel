import type { Task } from '~/types'

export const daliTasks: Task[] = [
  {
    id: 'cn5', city: '云南', name: '在大理古城看苍山洱海日落', difficulty: 'easy', country: '中国',
    desc: '大理古城与苍山洱海构成了中国最美的古城风景之一。骑车环洱海，在某个小渔村等待日落，是岁月静好的真实样本。',
    objectives: ['骑车环洱海一段', '在洱海边拍摄苍山倒影📸', '在大理古城品尝乳扇和玫瑰糕'],
    exp: 140, medal: { id: 'dali', icon: '🌊', name: '苍山洱海行者', desc: '骑游大理最美湖光山色' },
    location: { lat: 25.5969, lng: 100.1862, radius: 1000 },
  },
]
