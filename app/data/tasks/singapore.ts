import type { Task } from '~/types'

export const singaporeTasks: Task[] = [
  {
    id: 'sg1', city: '新加坡', name: '漫步滨海湾花园看夜间灯光秀', difficulty: 'easy', country: '新加坡',
    desc: 'Gardens by the Bay的超级树夜间灯光秀Garden Rhapsody是免费的，配合音乐的灯光变幻让人忘记时间。',
    objectives: ['游览花穹或云雾林温室', '观看超级树夜间灯光秀', '在滨海湾金沙外景拍照📸'],
    exp: 120, medal: { id: 'sg-garden', icon: '🌳', name: '花园城市居民', desc: '探索新加坡未来花园' },
    location: { lat: 1.2816, lng: 103.8636, radius: 300 },
  },
  {
    id: 'sg2', city: '新加坡', name: '在牛车水找到最地道的肉骨茶', difficulty: 'easy', country: '新加坡',
    desc: '牛车水（Chinatown）是新加坡华人文化的根，福建式肉骨茶加上白饭，是最接地气的新加坡早餐体验。',
    objectives: ['在牛车水找一家本地肉骨茶店', '完整吃完一套肉骨茶+油条', '在牛车水庙宇前打卡'],
    exp: 80, medal: { id: 'bak-kut-teh', icon: '🍖', name: '肉骨茶鉴赏家', desc: '在华人古街品尝南洋精髓' },
    location: { lat: 1.2833, lng: 103.8441, radius: 300 },
  },
]
