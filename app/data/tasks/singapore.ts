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
  {
    id: 'sg-st1', city: '新加坡', name: '圣淘沙环球影城', difficulty: 'medium', country: '新加坡',
    desc: '新加坡环球影城是东南亚唯一的环球影城，变形金刚3D对决和木乃伊复仇记是招牌项目。一整天的尖叫与欢笑，是新加坡最快乐的地方。',
    objectives: ['体验变形金刚3D对决', '挑战太空堡垒双轨过山车', '与好莱坞电影角色合影📸'],
    exp: 180, medal: { id: 'uss', icon: '🎢', name: '环球影城冒险家', desc: '征服东南亚唯一的环球影城' },
    location: { lat: 1.2540, lng: 103.8238, radius: 400 },
  },
  {
    id: 'sg-li1', city: '新加坡', name: '小印度文化街', difficulty: 'easy', country: '新加坡',
    desc: '小印度是新加坡最色彩斑斓的街区，花环、香料、纱丽和宝莱坞音乐充斥着每条街巷。维拉马卡里雅曼兴都庙是新加坡最古老的印度教寺庙。',
    objectives: ['游览维拉马卡里雅曼兴都庙', '在竹脚中心品尝印度美食', '在彩色建筑前拍照📸'],
    exp: 70, medal: { id: 'little-india', icon: '🕌', name: '小印度探索者', desc: '探索新加坡最斑斓的文化街区' },
    location: { lat: 1.3066, lng: 103.8518, radius: 300 },
  },
  {
    id: 'sg-ch1', city: '新加坡', name: '樟宜机场星耀瀑布', difficulty: 'easy', country: '新加坡',
    desc: '樟宜机场星耀樟宜（Jewel）的室内瀑布高达40米，是世界最高的室内瀑布。夜间灯光秀让瀑布变成梦幻的光影世界。',
    objectives: ['在汇丰银行雨漩涡前拍照📸', '逛星空花园空中步道', '观赏夜间灯光秀'],
    exp: 70, medal: { id: 'jewel', icon: '💎', name: '星耀瀑布观者', desc: '在世界最美机场观赏室内瀑布' },
    location: { lat: 1.3602, lng: 103.9894, radius: 300 },
  },
]
