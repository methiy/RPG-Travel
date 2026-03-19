import type { Task } from '~/types'

export const wuhanTasks: Task[] = [
  {
    id: 'cn1', city: '武汉·宜昌', name: '乘船过葛洲坝船闸', difficulty: 'medium', country: '中国',
    desc: '参加两坝一峡一日游，亲历游轮从三斗坪缓缓驶过葛洲坝五级船闸，水落船降的过程需要约1小时，震撼无比。',
    objectives: ['乘坐三峡系列游轮出发', '穿越西陵峡欣赏峡谷风光', '亲历葛洲坝船闸水位变化'],
    exp: 160, medal: { id: 'gezhouba', icon: '⚓', name: '三峡航行者', desc: '穿越长江第一坝' },
    location: { lat: 30.7270, lng: 111.2726, radius: 500 },
  },
  {
    id: 'cn2', city: '武汉·宜昌', name: '站上三峡大坝坛子岭', difficulty: 'easy', country: '中国',
    desc: '三峡大坝是世界最大水电站。坛子岭是观看大坝的最佳位置，鸟瞰五级船闸和壮阔高峡平湖，感受中国工程奇迹。',
    objectives: ['乘电梯到坛子岭顶', '俯瞰三峡大坝全貌📸', '参观185观景平台感受"截断巫山云雨"'],
    exp: 130, medal: { id: 'dam', icon: '🏗️', name: '三峡大坝见证者', desc: '站上世界最大水电站观景台' },
    location: { lat: 30.8231, lng: 111.0037, radius: 500 },
  },
]
