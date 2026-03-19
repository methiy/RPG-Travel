import type { Task } from '~/types'

export const germanyTasks: Task[] = [
  {
    id: 'de-bl1', city: '柏林', name: '柏林墙东边画廊', difficulty: 'easy', country: '德国',
    desc: '东边画廊是柏林墙保存最完整的一段，1.3公里的墙面上有100多幅来自世界各地艺术家的壁画。"兄弟之吻"是最著名的一幅。',
    objectives: ['找到"兄弟之吻"壁画并拍照📸', '沿东边画廊走完全程', '了解柏林墙的历史与倒塌故事'],
    exp: 90, medal: { id: 'berlin-wall', icon: '🖼️', name: '柏林墙见证者', desc: '在柏林墙遗址见证历史与艺术' },
    location: { lat: 52.5055, lng: 13.4397, radius: 500 },
  },
  {
    id: 'de-ns1', city: '菲森', name: '新天鹅堡童话', difficulty: 'medium', country: '德国',
    desc: '新天鹅堡是路德维希二世的梦幻城堡，迪士尼睡美人城堡的原型。白色城堡矗立在阿尔卑斯山间，宛如从童话书中走出来。',
    objectives: ['参观新天鹅堡内部', '在玛丽安桥上拍摄城堡全景📸', '游览附近的高天鹅堡'],
    exp: 180, medal: { id: 'neuschwanstein', icon: '🏰', name: '新天鹅堡访客', desc: '走进迪士尼城堡的原型' },
    location: { lat: 47.5576, lng: 10.7498, radius: 500 },
  },
  {
    id: 'de-mu1', city: '慕尼黑', name: '慕尼黑啤酒花园', difficulty: 'easy', country: '德国',
    desc: '慕尼黑的啤酒花园是巴伐利亚文化的精髓，在栗树荫下喝一升新鲜扎啤，配上白肠和椒盐卷饼，是最正宗的德国体验。',
    objectives: ['在英国花园或谷物市场啤酒花园坐下', '点一升巴伐利亚啤酒', '品尝白肠配甜芥末和椒盐卷饼'],
    exp: 80, medal: { id: 'biergarten', icon: '🍺', name: '啤酒花园常客', desc: '在巴伐利亚栗树荫下畅饮鲜啤' },
    location: { lat: 48.1351, lng: 11.5820, radius: 400 },
  },
  {
    id: 'de-mu2', city: '慕尼黑', name: '宝马博物馆', difficulty: 'easy', country: '德国',
    desc: '宝马博物馆和宝马世界（BMW Welt）是汽车爱好者的天堂，从经典老爷车到未来概念车，展示了德国精密制造的极致。',
    objectives: ['参观宝马博物馆的经典车型展', '在BMW Welt体验最新车型', '在博物馆标志性建筑前拍照📸'],
    exp: 70, medal: { id: 'bmw-museum', icon: '🏎️', name: '宝马世界访客', desc: '在宝马总部探索德国汽车文化' },
    location: { lat: 48.1770, lng: 11.5562, radius: 300 },
  },
]
