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
  {
    id: 'nz-hb1', city: '玛塔玛塔', name: '霍比屯中土世界', difficulty: 'easy', country: '新西兰',
    desc: '霍比屯是《指环王》和《霍比特人》的拍摄地，44个霍比特人洞穴完整保留在翠绿的牧场上。走进袋底洞，仿佛踏入了中土世界。',
    objectives: ['参加霍比屯官方导览', '在袋底洞门前拍照📸', '在绿龙酒馆品尝一杯霍比特人啤酒'],
    exp: 90, medal: { id: 'hobbiton', icon: '🧝', name: '霍比屯居民', desc: '在中土世界的霍比特人故乡做客' },
    location: { lat: -37.8722, lng: 175.6830, radius: 500 },
  },
  {
    id: 'nz-rt1', city: '罗托鲁阿', name: '罗托鲁阿地热', difficulty: 'easy', country: '新西兰',
    desc: '罗托鲁阿是新西兰的地热奇观之城，到处冒着蒸汽和硫磺味。Wai-O-Tapu的香槟池呈现出不真实的绿色和橙色，是地球上最奇幻的地热景观。',
    objectives: ['参观Wai-O-Tapu地热仙境', '在香槟池前拍摄彩色温泉📸', '体验毛利文化村的Haka战舞'],
    exp: 90, medal: { id: 'rotorua-thermal', icon: '♨️', name: '地热探索者', desc: '探索新西兰最奇幻的地热仙境' },
    location: { lat: -38.1368, lng: 176.2497, radius: 500 },
  },
]
