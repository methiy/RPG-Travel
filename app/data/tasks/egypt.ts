import type { Task } from '~/types'

export const egyptTasks: Task[] = [
  {
    id: 'af1', city: '埃及', name: '站在吉萨金字塔前', difficulty: 'easy', country: '埃及',
    desc: '吉萨金字塔群是古代世界七大奇迹中唯一现存的奇迹。站在胡夫金字塔前，感受4500年的时光重量。',
    objectives: ['在胡夫金字塔前拍照📸', '骑骆驼穿越沙漠', '参观狮身人面像'],
    exp: 100, medal: { id: 'pyramid', icon: '🔺', name: '金字塔见证者', desc: '站在人类最古老的奇迹前' },
    location: { lat: 29.9792, lng: 31.1342, radius: 500 },
  },
  {
    id: 'eg-lx1', city: '卢克索', name: '卢克索帝王谷', difficulty: 'medium', country: '埃及',
    desc: '帝王谷是古埃及法老们的最终安息之地，图坦卡蒙的陵墓就在这里被发现。走进地下墓室，墙壁上的彩色壁画历经三千年依然鲜艳。',
    objectives: ['进入帝王谷参观至少2座法老陵墓', '欣赏墓室内的彩色壁画📸', '参观卢克索神庙的日落'],
    exp: 180, medal: { id: 'valley-kings', icon: '👑', name: '帝王谷探索者', desc: '探访法老们沉睡三千年的地下宫殿' },
    location: { lat: 25.7402, lng: 32.6014, radius: 500 },
  },
  {
    id: 'eg-as1', city: '阿斯旺', name: '阿斯旺尼罗河', difficulty: 'easy', country: '埃及',
    desc: '阿斯旺是尼罗河最美的一段，金色沙漠紧邻碧蓝河水。乘坐三角帆船（Felucca）在尼罗河上漂流，看日落将沙丘染成金色。',
    objectives: ['乘坐三角帆船在尼罗河上漂流', '观赏尼罗河日落📸', '参观菲莱神庙（伊西斯神庙）'],
    exp: 90, medal: { id: 'aswan-nile', icon: '⛵', name: '尼罗河漂流者', desc: '在阿斯旺的尼罗河上扬帆漂流' },
    location: { lat: 24.0889, lng: 32.8998, radius: 500 },
  },
]
