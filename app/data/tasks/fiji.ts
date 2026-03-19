import type { Task } from '~/types'

export const fijiTasks: Task[] = [
  {
    id: 'oc5', city: '斐济', name: '在私人海岛浮潜', difficulty: 'medium', country: '斐济',
    desc: '斐济拥有300多个热带岛屿，透明的海水下是五彩斑斓的珊瑚花园。这里是南太平洋的天堂。',
    objectives: ['乘快艇前往外岛', '在珊瑚花园浮潜', '享受海岛BBQ午餐'],
    exp: 180, medal: { id: 'fiji', icon: '🏝️', name: '南太平洋岛民', desc: '发现斐济的天堂海岛' },
    location: { lat: -17.7742, lng: 177.2232, radius: 2000 },
  },
  {
    id: 'fj-tr1', city: '斐济', name: '部落卡瓦仪式', difficulty: 'easy', country: '斐济',
    desc: '卡瓦（Kava）仪式是斐济最重要的传统文化体验，用卡瓦根磨成的饮料在椰壳碗中传递。喝下第一口卡瓦，你就正式成为部落的客人。',
    objectives: ['参加一场正式的卡瓦仪式', '按照传统礼仪饮用卡瓦', '与部落村民交流了解斐济文化📸'],
    exp: 80, medal: { id: 'kava-ceremony', icon: '🥥', name: '卡瓦仪式参与者', desc: '参加斐济传统部落的卡瓦迎宾仪式' },
    location: { lat: -17.8013, lng: 177.9520, radius: 2000 },
  },
]
