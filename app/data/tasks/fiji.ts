import type { Task } from '~/types'

export const fijiTasks: Task[] = [
  {
    id: 'oc5', city: '斐济', name: '在私人海岛浮潜', difficulty: 'medium', country: '斐济',
    desc: '斐济拥有300多个热带岛屿，透明的海水下是五彩斑斓的珊瑚花园。这里是南太平洋的天堂。',
    objectives: ['乘快艇前往外岛', '在珊瑚花园浮潜', '享受海岛BBQ午餐'],
    exp: 180, medal: { id: 'fiji', icon: '🏝️', name: '南太平洋岛民', desc: '发现斐济的天堂海岛' },
    location: { lat: -17.7742, lng: 177.2232, radius: 2000 },
  },
]
