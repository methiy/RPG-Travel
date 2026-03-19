import type { Task } from '~/types'

export const moroccoTasks: Task[] = [
  {
    id: 'af2', city: '摩洛哥', name: '穿越菲斯古城迷宫', difficulty: 'medium', country: '摩洛哥',
    desc: '菲斯古城（Fes el Bali）是世界上最大的无车城区，9000多条巷道组成的迷宫让GPS也失灵。',
    objectives: ['进入菲斯古城麦地那', '找到著名的皮革染坊', '在迷宫中找到一家传统手工艺店'],
    exp: 180, medal: { id: 'fes', icon: '🏺', name: '古城迷踪者', desc: '穿越世界最大无车迷宫' },
    location: { lat: 34.0621, lng: -4.9734, radius: 500 },
  },
]
