import type { Task } from '~/types'

export const hongkongTasks: Task[] = [
  {
    id: 'cn3', city: '香港', name: '徒步麦理浩径第二段全程', difficulty: 'hard', country: '中国',
    desc: '从万宜水库东坝出发，穿越浪茄湾、西湾山顶，抵达咸田湾，最后趟水登船回西贡。全程约13-15公里，是香港最壮美的徒步路线。',
    objectives: ['从东坝出发徒步', '爬上西湾山顶（最难段）', '抵达咸田湾趟水登船📸'],
    exp: 300, medal: { id: 'maclehose', icon: '⛰️', name: '麦径勇士', desc: '完成香港最美徒步路线' },
    location: { lat: 22.3698, lng: 114.3790, radius: 1000 },
  },
]
