import type { Task } from '~/types'

export const usaTasks: Task[] = [
  {
    id: 'us1', city: '美国', name: '在纽约时代广场跨年', difficulty: 'hard', country: '美国',
    desc: '纽约时代广场跨年是全球最著名的跨年倒计时，数十万人聚集，水晶球缓缓降落，是人类最大的共同仪式之一。',
    objectives: ['提前6小时占据好位置', '完整观看水晶球降落仪式', '在时代广场霓虹灯下留影📸'],
    exp: 380, medal: { id: 'times-sq', icon: '🎆', name: '时代广场跨年者', desc: '参与全球最大跨年倒计时' },
    location: { lat: 40.7580, lng: -73.9855, radius: 300 },
  },
  {
    id: 'us-sf1', city: '旧金山', name: '金门大桥骑行', difficulty: 'easy', country: '美国',
    desc: '金门大桥是旧金山的标志，橘红色的悬索桥横跨金门海峡。骑自行车从渔人码头出发穿越大桥到索萨利托，是最经典的旧金山体验。',
    objectives: ['租自行车从渔人码头出发', '骑行穿越金门大桥全程', '在索萨利托小镇拍摄大桥远景📸'],
    exp: 90, medal: { id: 'golden-gate', icon: '🌉', name: '金门大桥骑手', desc: '骑行穿越旧金山标志性大桥' },
    location: { lat: 37.8199, lng: -122.4783, radius: 500 },
  },
  {
    id: 'us-la1', city: '洛杉矶', name: '好莱坞星光大道', difficulty: 'easy', country: '美国',
    desc: '好莱坞星光大道上镶嵌着2700多颗名人星星，是全球电影文化的朝圣地。在好莱坞标志牌前拍照，感受梦工厂的魅力。',
    objectives: ['在星光大道上找到最爱明星的星星📸', '在中国剧院前与手印合影', '在格里菲斯天文台远眺好莱坞标志'],
    exp: 80, medal: { id: 'hollywood', icon: '⭐', name: '好莱坞追星人', desc: '在好莱坞星光大道追逐明星足迹' },
    location: { lat: 34.1016, lng: -118.3267, radius: 400 },
  },
  {
    id: 'us-gc1', city: '亚利桑那', name: '大峡谷南缘日落', difficulty: 'medium', country: '美国',
    desc: '大峡谷是地球上最壮观的地质奇观，科罗拉多河用600万年雕刻出深达1600米的峡谷。站在南缘看日落，红色岩层在金光中层层变幻。',
    objectives: ['抵达大峡谷南缘观景台', '等待并拍摄峡谷日落📸', '沿Rim Trail步道徒步'],
    exp: 200, medal: { id: 'grand-canyon', icon: '🏜️', name: '大峡谷朝圣者', desc: '在地球最壮观峡谷前看日落' },
    location: { lat: 36.0544, lng: -112.1401, radius: 2000 },
  },
  {
    id: 'us-lv1', city: '拉斯维加斯', name: '拉斯维加斯大道夜游', difficulty: 'easy', country: '美国',
    desc: 'Las Vegas Strip是世界上最璀璨的大道，每家酒店都是一座梦幻王国。百乐宫喷泉秀、威尼斯人运河和纽约纽约过山车——在这里，一切皆有可能。',
    objectives: ['沿Las Vegas Strip夜间漫步', '观赏百乐宫喷泉灯光秀', '在赌场体验一把轮盘或老虎机'],
    exp: 90, medal: { id: 'vegas-strip', icon: '🎰', name: '拉斯维加斯夜行者', desc: '在世界最璀璨的大道上夜游' },
    location: { lat: 36.1147, lng: -115.1728, radius: 500 },
  },
  {
    id: 'us-hw1', city: '夏威夷', name: '夏威夷威基基海滩冲浪', difficulty: 'medium', country: '美国',
    desc: '威基基海滩是现代冲浪运动的发源地，钻石头山是它的天然背景。在温暖的太平洋浪花中学冲浪，是最纯正的夏威夷Aloha体验。',
    objectives: ['在威基基海滩租冲浪板学冲浪', '在钻石头山前拍摄海滩全景📸', '品尝Poke Bowl夏威夷鱼生饭'],
    exp: 180, medal: { id: 'waikiki', icon: '🏄', name: '夏威夷冲浪者', desc: '在冲浪发源地踏浪飞驰' },
    location: { lat: 21.2765, lng: -157.8268, radius: 500 },
  },
  {
    id: 'us-ny1', city: '纽约', name: '自由女神像登顶', difficulty: 'medium', country: '美国',
    desc: '自由女神像是美国的象征，高93米的铜像矗立在自由岛上。登上皇冠观景台，透过窗户俯瞰纽约港，是美国最具仪式感的体验。',
    objectives: ['乘渡轮前往自由岛', '参观自由女神像基座博物馆', '在岛上拍摄曼哈顿天际线📸'],
    exp: 160, medal: { id: 'statue-liberty', icon: '🗽', name: '自由女神朝圣者', desc: '在自由之岛仰望美国的象征' },
    location: { lat: 40.6892, lng: -74.0445, radius: 300 },
  },
  {
    id: 'us-ny2', city: '纽约', name: '中央公园漫步', difficulty: 'easy', country: '美国',
    desc: '中央公园是纽约钢铁森林中的绿色绿洲，面积比摩纳哥还大。在毕士达喷泉旁坐下，看纽约客跑步、遛狗、弹吉他——这是纽约最真实的生活画面。',
    objectives: ['在毕士达喷泉前拍照📸', '沿The Mall林荫道漫步', '租一条小船在湖上划船'],
    exp: 70, medal: { id: 'central-park', icon: '🌳', name: '中央公园漫步者', desc: '在纽约绿色心脏中感受城市脉搏' },
    location: { lat: 40.7829, lng: -73.9654, radius: 500 },
  },
]
