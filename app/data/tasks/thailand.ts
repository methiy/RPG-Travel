import type { Task } from '~/types'

export const thailandTasks: Task[] = [
  {
    id: 'th1', city: '泰国', name: '在清迈放天灯', difficulty: 'medium', country: '泰国',
    desc: '清迈水灯节（Yi Peng）是世界最美节日之一，无数孔明灯同时升空，整片夜空都变成了星河。',
    objectives: ['参加Yi Peng或类似天灯活动', '亲手放飞一盏天灯', '拍摄天灯升空瞬间📸'],
    exp: 220, medal: { id: 'lantern', icon: '🏮', name: '清迈天灯放飞者', desc: '在星空下放飞心愿天灯' },
    location: { lat: 18.7883, lng: 98.9853, radius: 1000 },
  },
]
