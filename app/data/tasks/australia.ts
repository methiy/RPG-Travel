import type { Task } from '~/types'

export const australiaTasks: Task[] = [
  {
    id: 'oc1', city: '澳大利亚', name: '在悉尼歌剧院前打卡', difficulty: 'easy', country: '澳大利亚',
    desc: '悉尼歌剧院是20世纪最具标志性的建筑之一，贝壳般的屋顶倒映在悉尼港的碧蓝海水中。',
    objectives: ['在歌剧院前广场拍照📸', '沿环形码头散步到海港大桥', '在岩石区品尝澳式咖啡'],
    exp: 90, medal: { id: 'opera', icon: '🎭', name: '歌剧院访客', desc: '打卡世界最美建筑之一' },
    location: { lat: -33.8568, lng: 151.2153, radius: 300 },
  },
  {
    id: 'oc2', city: '大堡礁', name: '潜水大堡礁', difficulty: 'hard', country: '澳大利亚',
    desc: '大堡礁是地球上最大的珊瑚礁系统，从太空都能看到。潜入水下，是进入另一个星球。',
    objectives: ['乘船前往外堡礁', '完成深潜或浮潜体验', '拍摄珊瑚和热带鱼📸'],
    exp: 350, medal: { id: 'reef', icon: '🐠', name: '大堡礁潜行者', desc: '潜入地球最大珊瑚礁' },
    location: { lat: -16.5000, lng: 145.7750, radius: 5000 },
  },
  {
    id: 'oc6', city: '大堡礁', name: '乘直升机俯瞰心形礁', difficulty: 'legendary', country: '澳大利亚',
    desc: '心形礁是大堡礁中一块天然形成的心形珊瑚礁，只有从空中才能看到完整的心形。',
    objectives: ['从艾尔利海滩搭乘直升机', '从空中拍摄心形礁全景📸', '飞越白天堂海滩'],
    exp: 550, medal: { id: 'heart-reef', icon: '💙', name: '心形礁发现者', desc: '从空中发现大自然的爱心' },
    location: { lat: -19.7590, lng: 148.9426, radius: 3000 },
  },
]
