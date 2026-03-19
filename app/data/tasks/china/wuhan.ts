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
  {
    id: 'cn-wh1',
    city: '武汉',
    name: '黄鹤楼登临',
    difficulty: 'medium',
    country: '中国',
    desc: '"昔人已乘黄鹤去，此地空余黄鹤楼。"黄鹤楼是江南三大名楼之首，矗立在蛇山之巅俯瞰长江。登上五层楼顶，武汉三镇尽收眼底，长江大桥横跨天堑。每一层都有不同的历史展览，从崔颢到李白，诗人们在这里留下了千古绝唱。',
    objectives: ['登上黄鹤楼顶层俯瞰长江和武汉三镇', '了解黄鹤楼的历史变迁和重建故事', '在黄鹤楼上背诵一首相关古诗'],
    exp: 150,
    medal: { id: 'medal-cn-wh1', icon: '🏯', name: '黄鹤楼登临者', desc: '登上黄鹤楼俯瞰了万里长江' },
    location: { lat: 30.5447, lng: 114.3042, radius: 300 },
  },
  {
    id: 'cn-wh2',
    city: '武汉',
    name: '户部巷过早',
    difficulty: 'easy',
    country: '中国',
    desc: '武汉人把吃早餐叫"过早"，而户部巷就是过早的圣地。这条150米长的小巷里挤满了各种早餐摊：热干面、三鲜豆皮、糊汤粉、面窝、蛋酒……武汉人可以一个月不重样地过早。来武汉不过早，等于白来。',
    objectives: ['品尝正宗蔡林记热干面', '吃一份老通城三鲜豆皮', '再尝试至少2种其他武汉早餐小吃'],
    exp: 70,
    medal: { id: 'medal-cn-wh2', icon: '🍜', name: '户部巷吃货', desc: '在户部巷体验了武汉人的花式过早' },
    location: { lat: 30.5421, lng: 114.3016, radius: 200 },
  },
]
