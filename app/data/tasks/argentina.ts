import type { Task } from '~/types'

export const argentinaTasks: Task[] = [
  {
    id: 'ar-ba1', city: '布宜诺斯艾利斯', name: '布宜诺斯探戈秀', difficulty: 'easy', country: '阿根廷',
    desc: '探戈诞生于布宜诺斯艾利斯的街头，是阿根廷的灵魂之舞。在博卡区的小酒馆里看一场探戈表演，感受音乐、热情和忧伤的完美交织。',
    objectives: ['在博卡区或圣特尔莫区找一家探戈秀场', '观看一场完整的探戈表演', '在卡米尼托彩色街拍照📸'],
    exp: 90, medal: { id: 'tango', icon: '💃', name: '探戈之夜', desc: '在探戈的故乡感受灵魂之舞' },
    location: { lat: -34.6345, lng: -58.3631, radius: 400 },
  },
  {
    id: 'ar-pg1', city: '埃尔卡拉法特', name: '佩里托莫雷诺冰川', difficulty: 'hard', country: '阿根廷',
    desc: '佩里托莫雷诺冰川是世界上少数还在前进的冰川，冰面面积相当于整个布宜诺斯艾利斯市区。巨大的冰块断裂坠入湖中的瞬间，声如雷鸣。',
    objectives: ['在栈道上观赏冰川正面📸', '等待并拍摄冰川崩塌的壮观瞬间', '参加冰川迷你徒步体验'],
    exp: 280, medal: { id: 'perito-moreno', icon: '🧊', name: '冰川行者', desc: '在前进中的冰川上行走' },
    location: { lat: -50.4967, lng: -73.1378, radius: 1000 },
  },
  {
    id: 'ar-us1', city: '乌斯怀亚', name: '乌斯怀亚世界尽头', difficulty: 'medium', country: '阿根廷',
    desc: '乌斯怀亚是世界最南端的城市，被称为"世界尽头"。站在比格尔海峡畔远眺南极方向，在"世界尽头邮局"寄一张明信片，是旅行者的终极浪漫。',
    objectives: ['在"世界尽头"标志牌前拍照📸', '在世界尽头邮局寄明信片', '乘船游览比格尔海峡看海豹和企鹅'],
    exp: 200, medal: { id: 'ushuaia', icon: '🌍', name: '世界尽头旅人', desc: '抵达世界最南端的城市' },
    location: { lat: -54.8019, lng: -68.3030, radius: 500 },
  },
]
