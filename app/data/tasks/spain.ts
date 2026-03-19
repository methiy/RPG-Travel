import type { Task } from '~/types'

export const spainTasks: Task[] = [
  {
    id: 'eu3', city: '西班牙', name: '在巴塞罗那看高迪建筑', difficulty: 'medium', country: '西班牙',
    desc: '圣家族大教堂是建了140年还没完工的奇迹，充满高迪天马行空的想象力。从外观到内部，每个细节都值得细看。',
    objectives: ['参观圣家族大教堂（需提前预约）', '游览奎尔公园📸', '在兰布拉大道享用西班牙海鲜饭'],
    exp: 210, medal: { id: 'sagrada', icon: '⛪', name: '高迪幻想游客', desc: '探索建了百年的疯狂大教堂' },
    location: { lat: 41.4036, lng: 2.1744, radius: 300 },
  },
]
