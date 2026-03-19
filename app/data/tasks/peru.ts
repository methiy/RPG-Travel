import type { Task } from '~/types'

export const peruTasks: Task[] = [
  {
    id: 'pe1', city: '秘鲁', name: '登上马丘比丘观日出', difficulty: 'legendary', country: '秘鲁',
    desc: '云雾缭绕中的印加失落之城，海拔2430米。凌晨爬上太阳门等候日出从马丘比丘后山升起，是旅行者传说的终极成就。',
    objectives: ['持马丘比丘入场券', '凌晨攀登太阳门等日出', '在经典观景台拍摄全景📸'],
    exp: 600, medal: { id: 'machu', icon: '🏔️', name: '马丘比丘朝圣者', desc: '登上印加失落之城的巅峰' },
    location: { lat: -13.1631, lng: -72.5450, radius: 500 },
  },
]
