import type { Task } from '~/types'

export const usaTasks: Task[] = [
  {
    id: 'us1', city: '美国', name: '在纽约时代广场跨年', difficulty: 'hard', country: '美国',
    desc: '纽约时代广场跨年是全球最著名的跨年倒计时，数十万人聚集，水晶球缓缓降落，是人类最大的共同仪式之一。',
    objectives: ['提前6小时占据好位置', '完整观看水晶球降落仪式', '在时代广场霓虹灯下留影📸'],
    exp: 380, medal: { id: 'times-sq', icon: '🎆', name: '时代广场跨年者', desc: '参与全球最大跨年倒计时' },
    location: { lat: 40.7580, lng: -73.9855, radius: 300 },
  },
]
