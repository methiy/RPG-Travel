import type { Task } from '~/types'

export const peruTasks: Task[] = [
  {
    id: 'pe1', city: '秘鲁', name: '登上马丘比丘观日出', difficulty: 'legendary', country: '秘鲁',
    desc: '云雾缭绕中的印加失落之城，海拔2430米。凌晨爬上太阳门等候日出从马丘比丘后山升起，是旅行者传说的终极成就。',
    objectives: ['持马丘比丘入场券', '凌晨攀登太阳门等日出', '在经典观景台拍摄全景📸'],
    exp: 600, medal: { id: 'machu', icon: '🏔️', name: '马丘比丘朝圣者', desc: '登上印加失落之城的巅峰' },
    location: { lat: -13.1631, lng: -72.5450, radius: 500 },
  },
  {
    id: 'pe-cs1', city: '库斯科', name: '库斯科太阳神殿', difficulty: 'medium', country: '秘鲁',
    desc: '太阳神殿（Qoricancha）是印加帝国最重要的宗教场所，曾覆盖着数吨黄金。西班牙人在其基础上建了圣多明各教堂，两种文明在此重叠。',
    objectives: ['参观太阳神殿遗址', '观察印加石墙与西班牙教堂的融合', '在库斯科武器广场拍照📸'],
    exp: 160, medal: { id: 'qoricancha', icon: '🛕', name: '印加太阳神殿访客', desc: '在印加帝国最神圣的太阳神殿前致敬' },
    location: { lat: -13.5183, lng: -71.9755, radius: 300 },
  },
  {
    id: 'pe-lm1', city: '利马', name: '利马美食市场', difficulty: 'easy', country: '秘鲁',
    desc: '利马是南美洲的美食之都，Surquillo市场是当地人最爱的美食天堂。新鲜的Ceviche酸橘汁腌海鲜是秘鲁国菜，一口就让人爱上。',
    objectives: ['在Surquillo市场品尝新鲜Ceviche', '尝试秘鲁紫玉米汁（Chicha Morada）', '逛市场感受利马的烟火气📸'],
    exp: 80, medal: { id: 'lima-food', icon: '🍽️', name: '利马美食家', desc: '在南美美食之都品尝秘鲁国菜' },
    location: { lat: -12.1136, lng: -77.0268, radius: 400 },
  },
]
