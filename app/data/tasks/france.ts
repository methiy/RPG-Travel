import type { Task } from '~/types'

export const franceTasks: Task[] = [
  {
    id: 'eu1', city: '法国·巴黎', name: '在埃菲尔铁塔下许愿', difficulty: 'medium', country: '法国',
    desc: '巴黎的象征，无论白天还是夜晚都美得令人窒息。夜间每小时整点的闪光灯表演持续5分钟，是必等的浪漫时刻。',
    objectives: ['白天在铁塔下拍照📸', '等到整点欣赏灯光秀', '登上铁塔第二层俯瞰巴黎'],
    exp: 200, medal: { id: 'eiffel', icon: '🗼', name: '巴黎铁塔见证者', desc: '在浪漫之城许下心愿' },
    location: { lat: 48.8584, lng: 2.2945, radius: 300 },
  },
]
