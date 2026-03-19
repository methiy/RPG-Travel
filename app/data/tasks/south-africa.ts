import type { Task } from '~/types'

export const southAfricaTasks: Task[] = [
  {
    id: 'af4', city: '南非', name: '在好望角打卡', difficulty: 'medium', country: '南非',
    desc: '好望角是非洲大陆的西南端，大西洋与印度洋在此交汇。站在灯塔旁，感受两大洋的壮阔。',
    objectives: ['徒步到好望角标志牌前📸', '爬上开普角灯塔', '观察沿途的野生动物'],
    exp: 160, medal: { id: 'cape', icon: '🌊', name: '好望角勇者', desc: '抵达非洲大陆西南端' },
    location: { lat: -34.3568, lng: 18.4740, radius: 500 },
  },
  {
    id: 'af6', city: '南非', name: '克鲁格国家公园观五大兽', difficulty: 'legendary', country: '南非',
    desc: '克鲁格国家公园是非洲最大的野生动物保护区之一。找齐非洲五大兽（狮子、大象、犀牛、水牛、豹）是终极Safari成就。',
    objectives: ['参加清晨Safari游猎', '拍摄到至少三种五大兽📸', '在保护区内过夜'],
    exp: 500, medal: { id: 'safari', icon: '🦁', name: '非洲猎游者', desc: '在野生动物王国找齐五大兽' },
    location: { lat: -24.0167, lng: 31.4833, radius: 5000 },
  },
]
