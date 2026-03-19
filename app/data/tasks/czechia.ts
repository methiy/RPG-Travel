import type { Task } from '~/types'

export const czechiaTasks: Task[] = [
  {
    id: 'cz-pr1', city: '布拉格', name: '布拉格城堡', difficulty: 'medium', country: '捷克',
    desc: '布拉格城堡是世界上最大的古城堡建筑群，圣维特大教堂的哥特式尖塔直插云霄。站在城堡平台上俯瞰布拉格红顶老城，美如中世纪画卷。',
    objectives: ['参观圣维特大教堂', '在城堡观景台俯瞰布拉格老城📸', '穿越黄金巷了解中世纪手工艺'],
    exp: 160, medal: { id: 'prague-castle', icon: '🏰', name: '布拉格城堡访客', desc: '探访世界最大的古城堡建筑群' },
    location: { lat: 50.0905, lng: 14.4003, radius: 400 },
  },
  {
    id: 'cz-pr2', city: '布拉格', name: '查理大桥日落', difficulty: 'easy', country: '捷克',
    desc: '查理大桥是布拉格最古老的石桥，桥上30座巴洛克雕像守望着伏尔塔瓦河。日落时分的金色光线洒在桥面上，是布拉格最浪漫的时刻。',
    objectives: ['在日落时分走上查理大桥', '在桥上与巴洛克雕像合影📸', '触摸圣约翰·内波穆克铜像许愿'],
    exp: 80, medal: { id: 'charles-bridge', icon: '🌉', name: '查理大桥行者', desc: '在布拉格最古老石桥上看日落' },
    location: { lat: 50.0865, lng: 14.4114, radius: 200 },
  },
  {
    id: 'cz-ck1', city: '克鲁姆洛夫', name: 'CK小镇童话世界', difficulty: 'easy', country: '捷克',
    desc: '克鲁姆洛夫（CK小镇）是联合国世界遗产，伏尔塔瓦河蜿蜒环绕着中世纪红顶小镇。站在城堡塔楼上俯瞰，宛如走进了童话世界。',
    objectives: ['登上城堡塔楼俯瞰CK小镇全景📸', '在伏尔塔瓦河边漫步', '品尝波西米亚传统烤肉卷（Trdelník）'],
    exp: 90, medal: { id: 'cesky-krumlov', icon: '🏘️', name: 'CK小镇探索者', desc: '探索波西米亚最美的童话小镇' },
    location: { lat: 48.8127, lng: 14.3175, radius: 400 },
  },
]
