import type { Task } from '~/types'

export const newZealandTasks: Task[] = [
  {
    id: 'oc3', city: '新西兰', name: '米尔福德峡湾巡游', difficulty: 'medium', country: '新西兰',
    desc: '米尔福德峡湾被称为"世界第八大奇迹"，瀑布从千米高的悬崖上倾泻而下，海豹在礁石上晒太阳。',
    objectives: ['乘坐峡湾巡游船', '穿越斯特林瀑布水帘', '拍摄米特峰倒影📸'],
    exp: 200, medal: { id: 'milford', icon: '🏔️', name: '峡湾探索者', desc: '巡游世界第八大奇迹' },
    location: { lat: -44.6414, lng: 167.8975, radius: 1000 },
  },
  {
    id: 'oc4', city: '新西兰', name: '挑战皇后镇蹦极', difficulty: 'hard', country: '新西兰',
    desc: '皇后镇是现代蹦极的发源地。从卡瓦劳大桥43米高处一跃而下，脚尖几乎触碰碧绿河水。',
    objectives: ['前往卡瓦劳大桥蹦极中心', '完成43米蹦极跳', '获取蹦极证书📸'],
    exp: 320, medal: { id: 'bungee', icon: '🪂', name: '极限勇者', desc: '在蹦极发源地纵身一跃' },
    location: { lat: -45.0312, lng: 168.6626, radius: 300 },
  },
]
