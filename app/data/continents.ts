import type { Continent } from '~/types'

export const CONTINENTS: Continent[] = [
  { id: 'asia', name: '亚洲', emoji: '🌏', unlockExp: 0, description: '从东方古都到热带海岛，亚洲之美无处不在' },
  { id: 'europe', name: '欧洲', emoji: '🏰', unlockExp: 300, description: '古堡、艺术与浪漫之旅' },
  { id: 'americas', name: '美洲', emoji: '🌎', unlockExp: 600, description: '自然奇观与多元文明' },
  { id: 'africa-me', name: '非洲与中东', emoji: '🌍', unlockExp: 1000, description: '古老文明与自然奇观' },
  { id: 'oceania', name: '大洋洲', emoji: '🏝️', unlockExp: 1500, description: '碧海蓝天与极限冒险' },
]
