import type { Task } from '~/types'

export const moroccoTasks: Task[] = [
  {
    id: 'af2', city: '摩洛哥', name: '穿越菲斯古城迷宫', difficulty: 'medium', country: '摩洛哥',
    desc: '菲斯古城（Fes el Bali）是世界上最大的无车城区，9000多条巷道组成的迷宫让GPS也失灵。',
    objectives: ['进入菲斯古城麦地那', '找到著名的皮革染坊', '在迷宫中找到一家传统手工艺店'],
    exp: 180, medal: { id: 'fes', icon: '🏺', name: '古城迷踪者', desc: '穿越世界最大无车迷宫' },
    location: { lat: 34.0621, lng: -4.9734, radius: 500 },
  },
  {
    id: 'ma-mk1', city: '马拉喀什', name: '马拉喀什集市', difficulty: 'easy', country: '摩洛哥',
    desc: '德吉玛·艾尔法纳广场是马拉喀什的心脏，白天是集市和耍蛇人的天下，夜晚变成露天大排档。周围的苏克小巷售卖香料、地毯和皮具。',
    objectives: ['在德吉玛广场观看街头表演', '在苏克巷里砍价购买纪念品', '在广场夜市品尝摩洛哥塔吉锅📸'],
    exp: 80, medal: { id: 'marrakech-souk', icon: '🏺', name: '马拉喀什集市客', desc: '在北非最热闹的集市中探宝' },
    location: { lat: 31.6258, lng: -7.9891, radius: 400 },
  },
  {
    id: 'ma-cc1', city: '舍夫沙万', name: '舍夫沙万蓝城', difficulty: 'easy', country: '摩洛哥',
    desc: '舍夫沙万是摩洛哥的"蓝色珍珠"，整座小城被涂成深浅不一的蓝色。漫步在蓝色的巷弄间，仿佛走进了一幅莫奈的画作。',
    objectives: ['在蓝色小巷中漫步拍照📸', '找到最美的蓝色阶梯', '在城中的咖啡馆品尝薄荷茶'],
    exp: 80, medal: { id: 'chefchaouen', icon: '💙', name: '蓝城漫步者', desc: '在摩洛哥蓝色珍珠中迷失' },
    location: { lat: 35.1688, lng: -5.2636, radius: 400 },
  },
  {
    id: 'ma-sh1', city: '撒哈拉', name: '撒哈拉骑骆驼', difficulty: 'medium', country: '摩洛哥',
    desc: '从梅尔祖卡出发骑骆驼进入撒哈拉沙漠，在金色沙丘上看日落和星空。夜晚在沙漠营地听柏柏尔人唱歌打鼓，是一生难忘的体验。',
    objectives: ['骑骆驼穿越撒哈拉沙丘', '在沙漠营地观看日落和满天星空📸', '体验柏柏尔人的篝火晚会'],
    exp: 250, medal: { id: 'sahara-camel', icon: '🐪', name: '撒哈拉骆驼骑手', desc: '骑骆驼穿越世界最大沙漠' },
    location: { lat: 31.0802, lng: -4.0133, radius: 5000 },
  },
]
