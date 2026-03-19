import type { Task } from '~/types'

export const indonesiaTasks: Task[] = [
  {
    id: 'id1', city: '巴厘岛', name: '在乌鲁瓦图看日落火舞', difficulty: 'medium', country: '印度尼西亚',
    desc: '乌鲁瓦图悬崖神庙海拔70米，是巴厘岛观日落的最佳地点。配合传统克差火舞，是整个巴厘岛最震撼的黄昏。',
    objectives: ['抵达乌鲁瓦图悬崖神庙', '观看克差火舞表演', '在崖边拍摄日落全景📸'],
    exp: 200, medal: { id: 'bali-sunset', icon: '🌅', name: '巴厘日落猎人', desc: '在印度洋上追逐完美落日' },
    location: { lat: -8.8291, lng: 115.0849, radius: 400 },
  },
]
