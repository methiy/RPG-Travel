import type { Task } from '~/types'

export const brazilTasks: Task[] = [
  {
    id: 'br-rj1', city: '里约热内卢', name: '里约基督像', difficulty: 'medium', country: '巴西',
    desc: '基督救世主像矗立在科科瓦多山顶，张开双臂俯瞰整个里约热内卢。登上山顶，在基督像脚下远眺糖面包山和科帕卡巴纳海滩，是南美最震撼的时刻。',
    objectives: ['乘小火车或面包车登上科科瓦多山', '在基督像脚下拍摄全景📸', '远眺糖面包山和里约海岸线'],
    exp: 180, medal: { id: 'cristo', icon: '✝️', name: '基督像朝圣者', desc: '在里约基督像脚下俯瞰南美明珠' },
    location: { lat: -22.9519, lng: -43.2105, radius: 300 },
  },
  {
    id: 'br-ig1', city: '伊瓜苏', name: '伊瓜苏瀑布', difficulty: 'medium', country: '巴西',
    desc: '伊瓜苏瀑布由275条瀑布组成，"魔鬼咽喉"处水帘从80米高处倾泻而下，水雾弥漫，轰鸣震耳。这是地球上最壮观的瀑布群。',
    objectives: ['沿栈道走到魔鬼咽喉观景台', '在瀑布前拍摄全景📸', '乘冲锋艇近距离感受瀑布水帘'],
    exp: 200, medal: { id: 'iguazu', icon: '💦', name: '伊瓜苏瀑布见证者', desc: '见证地球上最壮观的瀑布群' },
    location: { lat: -25.6953, lng: -54.4367, radius: 1000 },
  },
  {
    id: 'br-am1', city: '马瑙斯', name: '亚马逊雨林探险', difficulty: 'hard', country: '巴西',
    desc: '亚马逊雨林是地球之肺，从马瑙斯出发深入丛林，可以看到粉色河豚、巨型睡莲和各种奇异生物。这是地球上最原始的荒野体验。',
    objectives: ['乘船深入亚马逊河支流', '观察粉色河豚和热带生物', '在雨林营地过夜体验丛林之夜'],
    exp: 300, medal: { id: 'amazon', icon: '🌿', name: '亚马逊探险家', desc: '深入地球之肺探险' },
    location: { lat: -3.1190, lng: -60.0217, radius: 5000 },
  },
  {
    id: 'br-sp1', city: '圣保罗', name: '圣保罗涂鸦巷', difficulty: 'easy', country: '巴西',
    desc: '蝙蝠侠胡同（Beco do Batman）是圣保罗最著名的涂鸦艺术街区，整条巷子的墙壁被色彩鲜艳的涂鸦覆盖。是南美街头艺术的圣地。',
    objectives: ['在蝙蝠侠胡同漫步拍照📸', '欣赏并了解各幅涂鸦背后的故事', '在维拉马达莱纳区的咖啡馆休息'],
    exp: 80, medal: { id: 'batman-alley', icon: '🎨', name: '蝙蝠侠胡同探索者', desc: '在南美街头艺术圣地寻找灵感' },
    location: { lat: -23.5568, lng: -46.6847, radius: 200 },
  },
]
