import type { Task } from '~/types'

export const malaysiaTasks: Task[] = [
  {
    id: 'my1', city: '马来西亚', name: '在马六甲骑三轮车逛鸡场街', difficulty: 'easy', country: '马来西亚',
    desc: '马六甲是世界遗产古城，装饰华丽的三轮车是最当地的游览方式，鸡场街的娘惹美食和古董店让时光倒流。',
    objectives: ['在荷兰红屋广场打卡📸', '乘坐三轮车游鸡场街', '品尝娘惹菜或鸡饭粒'],
    exp: 90, medal: { id: 'malacca', icon: '🚲', name: '古城探索者', desc: '游历南洋风情古城' },
    location: { lat: 2.1946, lng: 102.2501, radius: 400 },
  },
  {
    id: 'my2', city: '马来西亚', name: '登上吉隆坡双子塔', difficulty: 'medium', country: '马来西亚',
    desc: '高452米的双子塔曾是世界第一高楼，登顶观景台可以俯瞰整个KL，41层的天桥是最佳拍照点。',
    objectives: ['购买双子塔登顶门票', '参观41层空中走廊', '在顶层观景台留念📸'],
    exp: 180, medal: { id: 'klcc', icon: '🏙️', name: '双塔之顶', desc: '征服世界最高双子楼' },
    location: { lat: 3.1578, lng: 101.7117, radius: 300 },
  },
]
