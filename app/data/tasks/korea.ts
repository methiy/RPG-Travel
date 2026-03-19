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
]
