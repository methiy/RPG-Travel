import type { Task } from '~/types'

export const uaeTasks: Task[] = [
  {
    id: 'af3', city: '迪拜', name: '登上哈利法塔观景台', difficulty: 'medium', country: '阿联酋',
    desc: '哈利法塔828米，是世界第一高楼。在148层的观景台俯瞰整个迪拜，云层就在脚下。',
    objectives: ['乘高速电梯到达148层', '在观景台拍摄迪拜全景📸', '观赏迪拜喷泉表演'],
    exp: 200, medal: { id: 'burj', icon: '🏗️', name: '云端登临者', desc: '站上世界最高建筑' },
    location: { lat: 25.1972, lng: 55.2744, radius: 300 },
  },
  {
    id: 'af5', city: '迪拜', name: '穿越沙漠冲沙', difficulty: 'hard', country: '阿联酋',
    desc: '乘坐越野车在金色沙丘上疯狂冲沙，是迪拜最刺激的户外体验。日落时分的沙漠美得不真实。',
    objectives: ['乘坐4x4越野车进入沙漠', '完成冲沙体验', '在沙漠营地观看日落和肚皮舞'],
    exp: 300, medal: { id: 'desert', icon: '🏜️', name: '沙漠征服者', desc: '在金色沙丘上疯狂冲沙' },
    location: { lat: 24.9500, lng: 55.4200, radius: 2000 },
  },
]
