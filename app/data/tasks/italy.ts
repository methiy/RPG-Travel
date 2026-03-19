import type { Task } from '~/types'

export const italyTasks: Task[] = [
  {
    id: 'eu2', city: '意大利', name: '在罗马竞技场感受历史', difficulty: 'medium', country: '意大利',
    desc: '斗兽场矗立了近2000年，站在这里你能感受到整个罗马帝国的重量。周边的罗马广场是免费的历史露天博物馆。',
    objectives: ['入场参观竞技场内部', '在罗马广场漫步', '品尝传统罗马冰淇淋（gelato）'],
    exp: 220, medal: { id: 'colosseum', icon: '🏛️', name: '罗马帝国访客', desc: '踏入2000年历史的斗兽场' },
    location: { lat: 41.8902, lng: 12.4922, radius: 200 },
  },
  {
    id: 'it-fl1', city: '佛罗伦萨', name: '佛罗伦萨乌菲齐美术馆', difficulty: 'medium', country: '意大利',
    desc: '乌菲齐美术馆收藏了波提切利《维纳斯的诞生》、达芬奇《天使报喜》等文艺复兴巅峰之作。走进这里，就是走进了一部活的西方艺术史。',
    objectives: ['参观波提切利《维纳斯的诞生》', '欣赏达芬奇和拉斐尔的作品', '在美术馆露台拍摄老桥全景📸'],
    exp: 180, medal: { id: 'uffizi', icon: '🎨', name: '文艺复兴鉴赏家', desc: '在文艺复兴殿堂鉴赏大师杰作' },
    location: { lat: 43.7677, lng: 11.2553, radius: 200 },
  },
  {
    id: 'it-vn1', city: '威尼斯', name: '威尼斯贡多拉', difficulty: 'medium', country: '意大利',
    desc: '贡多拉是威尼斯的灵魂，黑色的小船穿梭在狭窄的运河中，船夫哼着意大利小曲。坐在贡多拉上看威尼斯，是独一无二的体验。',
    objectives: ['乘坐贡多拉穿梭威尼斯运河', '经过叹息桥', '在圣马可广场散步📸'],
    exp: 160, medal: { id: 'gondola', icon: '🚣', name: '贡多拉旅人', desc: '乘坐贡多拉穿梭水城威尼斯' },
    location: { lat: 45.4408, lng: 12.3155, radius: 500 },
  },
  {
    id: 'it-am1', city: '阿马尔菲', name: '阿马尔菲海岸公路', difficulty: 'medium', country: '意大利',
    desc: '阿马尔菲海岸公路被誉为世界最美公路之一，蜿蜒在陡峭悬崖与蔚蓝大海之间。五彩缤纷的小镇点缀在崖壁上，每个转弯都是一张明信片。',
    objectives: ['沿阿马尔菲海岸公路驾驶或乘巴士', '在波西塔诺小镇停留拍照📸', '在海岸边品尝柠檬酒Limoncello'],
    exp: 180, medal: { id: 'amalfi', icon: '🛣️', name: '海岸线驾驶者', desc: '驾驶世界最美海岸公路' },
    location: { lat: 40.6340, lng: 14.6027, radius: 1000 },
  },
  {
    id: 'it-ml1', city: '米兰', name: '米兰大教堂登顶', difficulty: 'easy', country: '意大利',
    desc: '米兰大教堂是世界上最大的哥特式教堂之一，屋顶有3400多座雕像。登上教堂天台，在尖塔和飞扶壁之间漫步，仿佛置身石雕森林。',
    objectives: ['登上米兰大教堂屋顶', '在天台尖塔间拍照📸', '参观教堂内部和地下遗迹'],
    exp: 90, medal: { id: 'duomo-milano', icon: '⛪', name: '米兰大教堂访客', desc: '登上世界最大哥特式教堂的屋顶' },
    location: { lat: 45.4642, lng: 9.1920, radius: 200 },
  },
  {
    id: 'it-ps1', city: '比萨', name: '比萨斜塔托塔照', difficulty: 'easy', country: '意大利',
    desc: '比萨斜塔倾斜近4度却屹立800多年不倒，是建筑史上的奇迹。在草坪上摆出各种"扶塔"姿势拍照，是全球游客的保留节目。',
    objectives: ['在奇迹广场草坪上拍摄创意托塔照📸', '登上斜塔294级台阶', '参观比萨大教堂和洗礼堂'],
    exp: 70, medal: { id: 'pisa', icon: '🗼', name: '比萨斜塔客', desc: '在世界最著名的斜塔前创意打卡' },
    location: { lat: 43.7230, lng: 10.3966, radius: 200 },
  },
]
