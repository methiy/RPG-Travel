import type { Task } from '~/types'

export const franceTasks: Task[] = [
  {
    id: 'eu1', city: '法国·巴黎', name: '在埃菲尔铁塔下许愿', difficulty: 'medium', country: '法国',
    desc: '巴黎的象征，无论白天还是夜晚都美得令人窒息。夜间每小时整点的闪光灯表演持续5分钟，是必等的浪漫时刻。',
    objectives: ['白天在铁塔下拍照📸', '等到整点欣赏灯光秀', '登上铁塔第二层俯瞰巴黎'],
    exp: 200, medal: { id: 'eiffel', icon: '🗼', name: '巴黎铁塔见证者', desc: '在浪漫之城许下心愿' },
    location: { lat: 48.8584, lng: 2.2945, radius: 300 },
  },
  {
    id: 'fr-vs1', city: '凡尔赛', name: '凡尔赛宫镜厅', difficulty: 'medium', country: '法国',
    desc: '凡尔赛宫镜厅有357面镜子和20盏巨型水晶吊灯，是路易十四奢华权力的象征。阳光穿过落地窗反射在镜墙上，整个大厅金光闪闪。',
    objectives: ['参观镜厅并拍照📸', '游览凡尔赛宫花园', '了解路易十四与法国大革命的历史'],
    exp: 180, medal: { id: 'versailles', icon: '👑', name: '凡尔赛宫访客', desc: '走进太阳王的金碧辉煌殿堂' },
    location: { lat: 48.8049, lng: 2.1204, radius: 500 },
  },
  {
    id: 'fr-lv1', city: '巴黎', name: '卢浮宫看蒙娜丽莎', difficulty: 'medium', country: '法国',
    desc: '卢浮宫是世界上参观人数最多的博物馆，蒙娜丽莎、断臂维纳斯和胜利女神是三大镇馆之宝。一天根本看不完，但那一抹微笑已值回票价。',
    objectives: ['在蒙娜丽莎前驻足', '找到断臂维纳斯和萨莫色雷斯的胜利女神', '在玻璃金字塔前拍照📸'],
    exp: 200, medal: { id: 'louvre', icon: '🖼️', name: '卢浮宫鉴赏家', desc: '在世界最大博物馆邂逅蒙娜丽莎' },
    location: { lat: 48.8606, lng: 2.3376, radius: 300 },
  },
  {
    id: 'fr-nc1', city: '尼斯', name: '尼斯天使湾', difficulty: 'easy', country: '法国',
    desc: '天使湾（Baie des Anges）拥有地中海最美的海岸线，蔚蓝色的海水在阳光下闪耀。沿英国人漫步道散步，是蔚蓝海岸最经典的享受。',
    objectives: ['沿英国人漫步道散步', '在天使湾海滩晒太阳', '品尝尼斯沙拉和Socca薄饼'],
    exp: 90, medal: { id: 'nice-bay', icon: '🏖️', name: '蔚蓝海岸客', desc: '在地中海最美海湾享受阳光' },
    location: { lat: 43.6947, lng: 7.2562, radius: 400 },
  },
  {
    id: 'fr-pv1', city: '普罗旺斯', name: '普罗旺斯薰衣草田', difficulty: 'medium', country: '法国',
    desc: '每年6-8月，普罗旺斯的薰衣草田绽放成紫色花海，塞南克修道院前的薰衣草田是最经典的画面。空气中弥漫着薰衣草的芬芳。',
    objectives: ['在瓦伦索勒或塞南克修道院拍摄薰衣草田📸', '购买当地薰衣草精油或香皂', '品尝薰衣草冰淇淋或蜂蜜'],
    exp: 160, medal: { id: 'provence-lavender', icon: '💜', name: '薰衣草田行者', desc: '置身普罗旺斯紫色花海' },
    location: { lat: 43.9283, lng: 5.4342, radius: 2000 },
  },
  {
    id: 'fr-ly1', city: '里昂', name: '里昂美食之旅', difficulty: 'easy', country: '法国',
    desc: '里昂是法国的美食之都，传统小酒馆（Bouchon）是里昂美食的精髓。里昂式沙拉、猪肚和奶油奶酪——每一口都是法式烹饪的极致。',
    objectives: ['在传统Bouchon餐厅用餐', '品尝里昂特色菜（里昂沙拉或猪肚）', '逛保罗·博古斯室内市场'],
    exp: 80, medal: { id: 'lyon-food', icon: '🍷', name: '里昂美食家', desc: '在法国美食之都品尝正宗Bouchon' },
    location: { lat: 45.7640, lng: 4.8357, radius: 400 },
  },
]
