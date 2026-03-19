import type { Task } from '~/types'

export const thailandTasks: Task[] = [
  {
    id: 'th1', city: '泰国', name: '在清迈放天灯', difficulty: 'medium', country: '泰国',
    desc: '清迈水灯节（Yi Peng）是世界最美节日之一，无数孔明灯同时升空，整片夜空都变成了星河。',
    objectives: ['参加Yi Peng或类似天灯活动', '亲手放飞一盏天灯', '拍摄天灯升空瞬间📸'],
    exp: 220, medal: { id: 'lantern', icon: '🏮', name: '清迈天灯放飞者', desc: '在星空下放飞心愿天灯' },
    location: { lat: 18.7883, lng: 98.9853, radius: 1000 },
  },
  // 曼谷
  {
    id: 'th-bk1', city: '曼谷', name: '大皇宫参观', difficulty: 'medium', country: '泰国',
    desc: '大皇宫是泰国王室的象征，玉佛寺内供奉着国宝翡翠佛。金碧辉煌的建筑群让人目不暇接，是曼谷最不可错过的景点。',
    objectives: ['参观玉佛寺与大雄宝殿', '在大皇宫外墙前拍照📸', '了解泰国王室历史'],
    exp: 160, medal: { id: 'grand-palace', icon: '👑', name: '大皇宫访客', desc: '参观泰国最神圣的宫殿' },
    location: { lat: 13.7510, lng: 100.4914, radius: 300 },
  },
  {
    id: 'th-bk2', city: '曼谷', name: '考山路背包客体验', difficulty: 'easy', country: '泰国',
    desc: '考山路是全球背包客的圣地，霓虹灯闪烁、街头酒吧林立、各国旅人汇聚。喝一杯泰式奶茶，融入这条传奇街道的喧嚣。',
    objectives: ['在考山路夜间漫步', '品尝路边摊的Pad Thai或芒果糯米饭', '在霓虹灯招牌前拍照📸'],
    exp: 80, medal: { id: 'khaosan', icon: '🎒', name: '考山路背包客', desc: '在全球背包客圣地留下足迹' },
    location: { lat: 13.7589, lng: 100.4974, radius: 200 },
  },
  {
    id: 'th-bk3', city: '曼谷', name: '丹嫩沙多水上市场', difficulty: 'easy', country: '泰国',
    desc: '丹嫩沙多是泰国最著名的水上市场，小船上堆满新鲜水果和现做美食。坐在长尾船上穿梭水道，是最地道的泰式体验。',
    objectives: ['乘坐长尾船穿梭水道', '在船上购买新鲜水果或小吃', '拍摄水上市场的热闹场景📸'],
    exp: 90, medal: { id: 'floating-market', icon: '🛶', name: '水上市场买手', desc: '在泰国最著名的水上市场购物' },
    location: { lat: 13.5233, lng: 99.9612, radius: 500 },
  },
  // 清迈追加
  {
    id: 'th-cm1', city: '清迈', name: '素帖山双龙寺', difficulty: 'easy', country: '泰国',
    desc: '双龙寺（素帖寺）是清迈最神圣的寺庙，金色佛塔在阳光下闪耀。登上306级台阶，可以俯瞰整个清迈城。',
    objectives: ['攀登306级龙形台阶', '在金色佛塔前祈福', '在观景台俯瞰清迈📸'],
    exp: 80, medal: { id: 'doi-suthep', icon: '🐉', name: '双龙寺朝圣者', desc: '登上清迈最神圣的山顶寺庙' },
    location: { lat: 18.8048, lng: 98.9217, radius: 300 },
  },
  {
    id: 'th-cm2', city: '清迈', name: '清迈周日夜市', difficulty: 'easy', country: '泰国',
    desc: '清迈周日夜市从塔佩门一直延伸到帕辛寺，绵延数公里。手工艺品、街头美食、即兴演出——这是清迈最有活力的夜晚。',
    objectives: ['从塔佩门出发逛夜市', '品尝至少三种街头小吃', '购买一件手工艺品留念'],
    exp: 70, medal: { id: 'cm-sunday-market', icon: '🌙', name: '清迈夜市客', desc: '在清迈最盛大的周日夜市寻宝' },
    location: { lat: 18.7876, lng: 98.9934, radius: 500 },
  },
  // 普吉
  {
    id: 'th-pk1', city: '普吉', name: '皮皮岛跳岛游', difficulty: 'medium', country: '泰国',
    desc: '皮皮岛群拥有碧蓝透明的海水和壮观的石灰岩悬崖，玛雅湾曾是电影《海滩》的取景地。乘快艇穿梭各岛，是安达曼海最美的体验。',
    objectives: ['乘快艇前往皮皮岛', '在玛雅湾或竹子岛浮潜', '拍摄皮皮岛观景台全景📸'],
    exp: 180, medal: { id: 'phi-phi', icon: '🏝️', name: '皮皮岛探险家', desc: '探索安达曼海的绝美海岛' },
    location: { lat: 7.7407, lng: 98.7784, radius: 1000 },
  },
  {
    id: 'th-pk2', city: '普吉', name: '芭东海滩冲浪', difficulty: 'easy', country: '泰国',
    desc: '芭东海滩是普吉岛最热闹的海滩，白天冲浪戏水，夜晚是酒吧街的狂欢。租一块冲浪板，在安达曼海的浪花中释放自己。',
    objectives: ['在芭东海滩租冲浪板体验冲浪', '在海滩拍摄日落📸', '逛芭东夜市品尝海鲜'],
    exp: 80, medal: { id: 'patong', icon: '🏄', name: '芭东弄潮儿', desc: '在普吉最热闹的海滩上冲浪' },
    location: { lat: 7.8961, lng: 98.2960, radius: 400 },
  },
]
