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
  {
    id: 'au-ul1', city: '乌鲁鲁', name: '乌鲁鲁日落', difficulty: 'medium', country: '澳大利亚',
    desc: '乌鲁鲁（艾尔斯岩）是澳大利亚内陆的巨型红色巨石，在日落时从橙色变为深红再到紫色，是原住民心中最神圣的土地。',
    objectives: ['在日落观景区等待乌鲁鲁变色📸', '参加原住民文化体验活动', '在星空下享用沙漠晚餐'],
    exp: 200, medal: { id: 'uluru', icon: '🪨', name: '乌鲁鲁朝圣者', desc: '在澳大利亚红色心脏见证日落变色' },
    location: { lat: -25.3444, lng: 131.0369, radius: 2000 },
  },
  {
    id: 'au-ml1', city: '墨尔本', name: '墨尔本大洋路', difficulty: 'medium', country: '澳大利亚',
    desc: '大洋路是世界上最壮观的海滨公路之一，十二使徒岩在南大洋的波涛中矗立了千万年。沿途的悬崖、海浪和热带雨林让人目不暇接。',
    objectives: ['沿大洋路自驾或乘巴士', '在十二使徒岩观景台拍照📸', '在洛恩小镇停留品尝海鲜'],
    exp: 180, medal: { id: 'great-ocean-road', icon: '🛣️', name: '大洋路驾驶者', desc: '驾驶世界最壮观的海滨公路' },
    location: { lat: -38.6632, lng: 143.1047, radius: 2000 },
  },
]
