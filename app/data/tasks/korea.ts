import type { Task } from '~/types'

export const koreaTasks: Task[] = [
  {
    id: 'kr1', city: '首尔', name: '爬上首尔南山N塔', difficulty: 'easy', country: '韩国',
    desc: '南山是首尔的制高点，N首尔塔俯瞰整个汉城盆地。挂上爱情锁，看首尔夜景，是最经典的首尔打卡。',
    objectives: ['徒步或乘缆车上南山', '在爱情锁栏杆前打卡', '观赏首尔360°夜景📸'],
    exp: 100, medal: { id: 'n-tower', icon: '🗼', name: '首尔守望者', desc: '俯瞰千年古都夜景' },
    location: { lat: 37.5512, lng: 126.9882, radius: 300 },
  },
  {
    id: 'kr2', city: '首尔', name: '在广藏市场吃韩式美食', difficulty: 'easy', country: '韩国',
    desc: '广藏市场是首尔最古老的传统市场，生拌牛肉、绿豆煎饼、紫菜包饭——一条街吃遍韩式传统小吃。',
    objectives: ['品尝生拌牛肉（yukhoe）', '吃绿豆煎饼（bindaetteok）', '在市场内转满一圈'],
    exp: 70, medal: { id: 'gwangjang', icon: '🥩', name: '广藏市场吃货', desc: '征服首尔最老传统市场' },
    location: { lat: 37.5700, lng: 126.9997, radius: 300 },
  },
  {
    id: 'kr3', city: '济州岛', name: '游览济州岛牛岛', difficulty: 'easy', country: '韩国',
    desc: '从城山港乘渡轮15分钟即达牛岛，透明蓝绿色海水令人窒息。牛岛花生冰淇淋是必吃当地名物。',
    objectives: ['从城山港乘渡轮到牛岛', '品尝牛岛花生冰淇淋', '拍摄牛岛海岸全景📸'],
    exp: 100, medal: { id: 'udo', icon: '🏝️', name: '牛岛探险家', desc: '发现济州最美离岛' },
    location: { lat: 33.5040, lng: 126.9543, radius: 500 },
  },
  {
    id: 'kr4', city: '济州岛', name: '登上城山日出峰看日出', difficulty: 'medium', country: '韩国',
    desc: '城山日出峰是世界自然遗产，凌晨爬上这座形似古城的火山口，等待日出从大海升起，是济州最史诗级的体验。',
    objectives: ['凌晨4:30出发上山', '在火山口边等待日出', '日出后下山逛渔村市场'],
    exp: 180, medal: { id: 'sunrise-peak', icon: '🌅', name: '城山追日者', desc: '在世遗火山口等候日出' },
    location: { lat: 33.4581, lng: 126.9425, radius: 300 },
  },
  {
    id: 'kr5', city: '釜山', name: '在甘川文化村打卡', difficulty: 'easy', country: '韩国',
    desc: '甘川文化村是釜山的"马丘比丘"，五彩斑斓的房屋层叠在山坡上，弯弯曲曲的小巷里藏着无数艺术装置。',
    objectives: ['找到小王子雕像打卡📸', '沿指示牌游览全村', '购买一份手绘地图留念'],
    exp: 90, medal: { id: 'gamcheon', icon: '🎨', name: '甘川艺术探索者', desc: '发现釜山最美彩色山城' },
    location: { lat: 35.0975, lng: 129.0108, radius: 400 },
  },
  {
    id: 'kr6', city: '庆州', name: '骑车游览庆州古墓群', difficulty: 'medium', country: '韩国',
    desc: '庆州是韩国的"西安"，新罗王朝的千年古都。骑着自行车穿梭在巨大圆形古墓群之间，是最接近历史的方式。',
    objectives: ['租自行车或电动车', '绕大陵苑古墓群一圈', '在石窟庵或佛国寺拍照📸'],
    exp: 160, medal: { id: 'gyeongju', icon: '🏛️', name: '新罗遗迹探访者', desc: '骑游千年古都庆州' },
    location: { lat: 35.8354, lng: 129.2190, radius: 500 },
  },
  // 首尔追加
  {
    id: 'kr-se1', city: '首尔', name: '景福宫穿韩服', difficulty: 'easy', country: '韩国',
    desc: '穿上华丽的韩服走进景福宫，可以免门票入场。在古老的宫殿前拍照，仿佛穿越回朝鲜王朝的宫廷时光。',
    objectives: ['在景福宫附近租一套韩服', '穿韩服进入景福宫参观', '在勤政殿前拍摄宫廷风照片📸'],
    exp: 90, medal: { id: 'gyeongbok-hanbok', icon: '👘', name: '景福宫韩服人', desc: '穿韩服穿越回朝鲜王朝' },
    location: { lat: 37.5796, lng: 126.9770, radius: 400 },
  },
  {
    id: 'kr-se2', city: '首尔', name: '北村韩屋村漫步', difficulty: 'easy', country: '韩国',
    desc: '北村韩屋村保存着600年历史的传统韩屋，青瓦石墙的巷弄间可以远眺首尔塔。是首尔最具传统韵味的街区。',
    objectives: ['沿北村八景路线漫步', '在韩屋巷弄中拍照📸', '参观一间传统工艺体验馆'],
    exp: 70, medal: { id: 'bukchon', icon: '🏘️', name: '北村探索者', desc: '漫步600年历史的韩屋村' },
    location: { lat: 37.5826, lng: 126.9850, radius: 300 },
  },
  // 济州岛追加
  {
    id: 'kr-jj1', city: '济州岛', name: '汉拿山登顶', difficulty: 'hard', country: '韩国',
    desc: '汉拿山是韩国最高峰（1947m），也是济州岛的脊梁。从观音寺或城板岳线路攀登，穿越亚热带到寒带的垂直植被带。',
    objectives: ['选择登山路线出发', '登顶白鹿潭火山口', '在山顶拍摄济州全景📸'],
    exp: 300, medal: { id: 'hallasan', icon: '⛰️', name: '汉拿山征服者', desc: '征服韩国最高峰' },
    location: { lat: 33.3617, lng: 126.5292, radius: 1000 },
  },
  // 釜山追加
  {
    id: 'kr-bs1', city: '釜山', name: '海云台海滩日出', difficulty: 'easy', country: '韩国',
    desc: '海云台是韩国最著名的海滩，凌晨的金色日出从水平线升起，沙滩上只有海浪声和晨风。是釜山最宁静的时刻。',
    objectives: ['凌晨5点前抵达海云台海滩', '等待并拍摄日出📸', '在海滩旁的早餐店吃一碗猪肉汤饭'],
    exp: 80, medal: { id: 'haeundae-sunrise', icon: '🏖️', name: '海云台观日者', desc: '在韩国最美海滩迎接日出' },
    location: { lat: 35.1587, lng: 129.1604, radius: 400 },
  },
  {
    id: 'kr-bs2', city: '釜山', name: '海东龙宫寺', difficulty: 'easy', country: '韩国',
    desc: '海东龙宫寺是韩国唯一建在海边悬崖上的寺庙，浪涛拍打着石阶，佛像面朝大海。日出时分的龙宫寺美到令人窒息。',
    objectives: ['沿石阶下到海边龙宫寺', '在海水观音前祈福', '拍摄海岸线与寺庙的壮观全景📸'],
    exp: 80, medal: { id: 'yonggungsa', icon: '🐉', name: '龙宫寺访客', desc: '探访海边悬崖上的千年古刹' },
    location: { lat: 35.1884, lng: 129.2233, radius: 300 },
  },
  // 大邱
  {
    id: 'kr-dg1', city: '大邱', name: '西门市场夜市', difficulty: 'easy', country: '韩国',
    desc: '西门市场是大邱最大的传统市场，夜市摊位汇聚韩国各地小吃。烤扁饺子、辣炒年糕、煎饼——一条街吃到撑。',
    objectives: ['傍晚时分前往西门市场夜市', '品尝至少三种韩式小吃', '在市场内转满一圈感受大邱烟火气'],
    exp: 70, medal: { id: 'seomun', icon: '🍢', name: '西门市场食客', desc: '在大邱最大市场吃遍韩式小吃' },
    location: { lat: 35.8691, lng: 128.5808, radius: 300 },
  },
  // 全州
  {
    id: 'kr-jj2', city: '全州', name: '全州韩屋村拌饭', difficulty: 'easy', country: '韩国',
    desc: '全州是韩国拌饭的故乡，全州韩屋村保存着800多栋传统韩屋。在古色古香的韩屋餐厅里吃一碗正宗全州拌饭，是味蕾的朝圣。',
    objectives: ['游览全州韩屋村', '在传统韩屋餐厅品尝全州拌饭', '拍摄韩屋村全景📸'],
    exp: 80, medal: { id: 'jeonju-bibimbap', icon: '🍚', name: '全州拌饭鉴赏家', desc: '在拌饭故乡品尝正宗全州拌饭' },
    location: { lat: 35.8151, lng: 127.1530, radius: 400 },
  },
]
