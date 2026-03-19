import type { Task } from '~/types'

export const lhasaTasks: Task[] = [
  {
    id: 'cn4', city: '西藏', name: '在拉萨转动八廓街转经筒', difficulty: 'legendary', country: '中国',
    desc: '海拔3650米的拉萨，随朝圣者顺时针转动八廓街转经筒，感受藏传佛教最圣洁的朝圣之路，是一生必做的事。',
    objectives: ['办理西藏旅游许可证', '顺时针绕八廓街一圈', '在大昭寺前与朝圣者合影📸'],
    exp: 500, medal: { id: 'lhasa', icon: '🏔️', name: '雪域行者', desc: '踏上世界屋脊朝圣之路' },
    location: { lat: 29.6525, lng: 91.1718, radius: 500 },
  },
]
