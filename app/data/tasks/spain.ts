import type { Task } from '~/types'

export const spainTasks: Task[] = [
  {
    id: 'eu3', city: '西班牙', name: '在巴塞罗那看高迪建筑', difficulty: 'medium', country: '西班牙',
    desc: '圣家族大教堂是建了140年还没完工的奇迹，充满高迪天马行空的想象力。从外观到内部，每个细节都值得细看。',
    objectives: ['参观圣家族大教堂（需提前预约）', '游览奎尔公园📸', '在兰布拉大道享用西班牙海鲜饭'],
    exp: 210, medal: { id: 'sagrada', icon: '⛪', name: '高迪幻想游客', desc: '探索建了百年的疯狂大教堂' },
    location: { lat: 41.4036, lng: 2.1744, radius: 300 },
  },
  {
    id: 'es-md1', city: '马德里', name: '马德里普拉多博物馆', difficulty: 'medium', country: '西班牙',
    desc: '普拉多博物馆是世界三大美术馆之一，收藏了委拉斯开兹《宫娥》、戈雅《黑色绘画》等西班牙艺术巅峰之作。是马德里的文化灵魂。',
    objectives: ['欣赏委拉斯开兹《宫娥》', '参观戈雅展厅', '在博物馆咖啡厅休息品味艺术之旅'],
    exp: 160, medal: { id: 'prado', icon: '🖼️', name: '普拉多鉴赏家', desc: '在世界三大美术馆鉴赏西班牙大师杰作' },
    location: { lat: 40.4138, lng: -3.6921, radius: 200 },
  },
  {
    id: 'es-sv1', city: '塞维利亚', name: '塞维利亚弗拉门戈', difficulty: 'easy', country: '西班牙',
    desc: '弗拉门戈诞生于安达卢西亚，塞维利亚是它的灵魂之城。在小酒馆里观看一场激情四射的弗拉门戈表演，吉他声、掌声与舞者的热情融为一体。',
    objectives: ['在塞维利亚找一家传统弗拉门戈小酒馆', '观看一场完整的弗拉门戈表演', '在塞维利亚大教堂前打卡📸'],
    exp: 90, medal: { id: 'flamenco', icon: '💃', name: '弗拉门戈观者', desc: '在弗拉门戈的故乡感受热情之舞' },
    location: { lat: 37.3886, lng: -5.9823, radius: 400 },
  },
  {
    id: 'es-gr1', city: '格拉纳达', name: '格拉纳达阿尔罕布拉宫', difficulty: 'medium', country: '西班牙',
    desc: '阿尔罕布拉宫是摩尔人在欧洲的最后杰作，红色城堡内的精美伊斯兰几何花纹和狮子庭院令人叹为观止。是西班牙最热门的景点之一。',
    objectives: ['参观纳斯里德宫殿群', '在狮子庭院拍照📸', '在阿尔拜辛区远眺阿尔罕布拉宫日落'],
    exp: 200, medal: { id: 'alhambra', icon: '🕌', name: '阿尔罕布拉访客', desc: '探访摩尔人在欧洲的最后杰作' },
    location: { lat: 37.1761, lng: -3.5881, radius: 400 },
  },
  {
    id: 'es-bc1', city: '巴塞罗那', name: '兰布拉大道漫步', difficulty: 'easy', country: '西班牙',
    desc: '兰布拉大道是巴塞罗那最著名的步行街，从加泰罗尼亚广场一直延伸到海边。街头艺人、花市、博盖利亚市场——这条大道是巴塞罗那的缩影。',
    objectives: ['从加泰罗尼亚广场沿兰布拉大道走到海边', '逛博盖利亚市场品尝鲜榨果汁', '在哥伦布纪念塔前拍照📸'],
    exp: 70, medal: { id: 'rambla', icon: '🌳', name: '兰布拉漫步者', desc: '漫步巴塞罗那最著名的林荫大道' },
    location: { lat: 41.3818, lng: 2.1700, radius: 400 },
  },
]
