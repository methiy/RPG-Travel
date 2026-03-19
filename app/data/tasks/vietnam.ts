import type { Task } from '~/types'

export const vietnamTasks: Task[] = [
  {
    id: 'vn-hn1', city: '河内', name: '还剑湖漫步', difficulty: 'easy', country: '越南',
    desc: '还剑湖是河内的心脏，传说中黎太祖在此还剑给金龟。湖心的玉山祠红桥如画，清晨太极拳的老人和傍晚散步的市民让这里充满生活气息。',
    objectives: ['沿还剑湖步道漫步一圈', '走过栖旭桥参观玉山祠', '在湖边长椅上喝一杯越南咖啡'],
    exp: 80, medal: { id: 'hoan-kiem', icon: '🏛️', name: '还剑湖行者', desc: '漫步河内千年古湖' },
    location: { lat: 21.0288, lng: 105.8525, radius: 300 },
  },
  {
    id: 'vn-hn2', city: '河内', name: '三十六行街品河粉', difficulty: 'easy', country: '越南',
    desc: '河内老城区三十六行街已有千年历史，每条街以一种行当命名。在路边小板凳上蹲着吃一碗热气腾腾的Pho，是最正宗的河内早餐仪式。',
    objectives: ['在三十六行街找一家本地Pho店', '品尝正宗河内牛肉河粉', '逛至少三条不同行当的老街'],
    exp: 70, medal: { id: 'pho-hanoi', icon: '🍜', name: '河粉鉴赏家', desc: '在河内老街品尝最正宗的越南河粉' },
    location: { lat: 21.0340, lng: 105.8500, radius: 400 },
  },
  {
    id: 'vn-hcm1', city: '胡志明市', name: '胡志明中央邮局', difficulty: 'easy', country: '越南',
    desc: '中央邮局由法国建筑师设计，拱形大厅和精美壁画保留了殖民时期的优雅。在这里寄一张明信片，是穿越时空的浪漫。',
    objectives: ['参观中央邮局的法式拱形大厅', '在邮局内寄一张明信片', '在红教堂前拍照📸'],
    exp: 70, medal: { id: 'hcm-post', icon: '📮', name: '法式邮局访客', desc: '在百年法式邮局寄出跨越时空的明信片' },
    location: { lat: 10.7798, lng: 106.6990, radius: 200 },
  },
  {
    id: 'vn-hcm2', city: '胡志明市', name: '古芝地道探险', difficulty: 'medium', country: '越南',
    desc: '古芝地道是越战时期的地下军事网络，全长超过250公里。钻入狭窄的地道中，亲身感受战争年代的艰难与智慧。',
    objectives: ['进入古芝地道参观地下设施', '体验钻入原始尺寸地道', '了解越战时期的地道战术'],
    exp: 160, medal: { id: 'cu-chi', icon: '🕳️', name: '地道探险者', desc: '深入越战时期的250公里地下迷宫' },
    location: { lat: 11.1417, lng: 106.4625, radius: 500 },
  },
  {
    id: 'vn-dn1', city: '岘港', name: '巴拿山金桥打卡', difficulty: 'medium', country: '越南',
    desc: '金桥（Golden Bridge）由两只巨大的石手托起，悬浮于巴拿山1400米高处的云雾之中。这座梦幻之桥已成为越南最具标志性的新地标。',
    objectives: ['乘缆车登上巴拿山', '在金桥上拍摄打卡照📸', '游览巴拿山法式小镇'],
    exp: 150, medal: { id: 'golden-bridge', icon: '🌉', name: '金桥行者', desc: '走过云端上的巨手金桥' },
    location: { lat: 15.9952, lng: 107.9958, radius: 500 },
  },
  {
    id: 'vn-ha1', city: '会安', name: '会安古镇放灯', difficulty: 'easy', country: '越南',
    desc: '会安古镇每到夜晚就变成灯笼的海洋，五彩斑斓的丝绸灯笼倒映在秋盆河上。在河边放一盏莲花灯，许一个心愿，是越南最浪漫的体验。',
    objectives: ['在古镇内逛灯笼街', '在秋盆河边放一盏莲花灯', '拍摄来远桥（日本廊桥）夜景📸'],
    exp: 90, medal: { id: 'hoi-an', icon: '🏮', name: '会安灯笼人', desc: '在灯笼之城放灯许愿' },
    location: { lat: 15.8801, lng: 108.3380, radius: 400 },
  },
]
