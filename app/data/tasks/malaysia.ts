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
  {
    id: 'my-pg1', city: '槟城', name: '槟城壁画街', difficulty: 'easy', country: '马来西亚',
    desc: '乔治市的街头壁画是立陶宛艺术家Zacharevic的杰作，"姐弟共骑"和"少女骑单车"是最著名的两幅。穿梭在老街巷间寻找壁画，是槟城最有趣的探险。',
    objectives: ['找到"姐弟共骑"壁画并拍照📸', '沿壁画地图找到至少5幅街头艺术', '品尝槟城炒粿条或叻沙'],
    exp: 80, medal: { id: 'penang-mural', icon: '🎨', name: '槟城壁画猎人', desc: '在乔治市街巷中寻找街头艺术' },
    location: { lat: 5.4141, lng: 100.3288, radius: 400 },
  },
  {
    id: 'my-lk1', city: '兰卡威', name: '兰卡威天空之桥', difficulty: 'medium', country: '马来西亚',
    desc: '兰卡威天空之桥悬于海拔660米的山巅，全长125米的弧形桥面仅由一根支柱支撑。站在桥上俯瞰热带雨林和安达曼海，让人既兴奋又腿软。',
    objectives: ['乘坐缆车到达山顶站', '走过天空之桥全程', '在桥上拍摄热带雨林全景📸'],
    exp: 160, medal: { id: 'sky-bridge', icon: '🌉', name: '天空之桥行者', desc: '走过悬在云端的天空之桥' },
    location: { lat: 6.3818, lng: 99.6678, radius: 400 },
  },
  {
    id: 'my-kl1', city: '吉隆坡', name: '黑风洞印度教圣地', difficulty: 'easy', country: '马来西亚',
    desc: '黑风洞是马来西亚最著名的印度教圣地，272级彩虹阶梯通往巨大的石灰岩洞穴。洞口矗立着42米高的穆鲁干神金色巨像。',
    objectives: ['攀登272级彩虹阶梯', '参观洞内印度教神庙', '在穆鲁干神巨像前拍照📸'],
    exp: 90, medal: { id: 'batu-caves', icon: '🛕', name: '黑风洞朝圣者', desc: '攀登彩虹阶梯朝圣印度教圣地' },
    location: { lat: 3.2379, lng: 101.6840, radius: 300 },
  },
]
