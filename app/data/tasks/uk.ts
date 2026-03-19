import type { Task } from '~/types'

export const ukTasks: Task[] = [
  {
    id: 'uk-ld1', city: '伦敦', name: '大本钟与议会大厦', difficulty: 'easy', country: '英国',
    desc: '大本钟是伦敦最具标志性的地标，哥特式的议会大厦沿泰晤士河畔绵延。听到大本钟的整点钟声回荡在伦敦上空，才算真正到过伦敦。',
    objectives: ['在威斯敏斯特桥上拍摄大本钟📸', '沿泰晤士河南岸步道散步', '在附近的威斯敏斯特教堂前打卡'],
    exp: 80, medal: { id: 'big-ben', icon: '🕐', name: '大本钟打卡者', desc: '在伦敦地标大本钟前留下足迹' },
    location: { lat: 51.5007, lng: -0.1246, radius: 200 },
  },
  {
    id: 'uk-ld2', city: '伦敦', name: '大英博物馆', difficulty: 'medium', country: '英国',
    desc: '大英博物馆藏有800万件文物，从罗塞塔石碑到帕特农神庙雕塑，是人类文明的百科全书。免费入场，但一天远远看不完。',
    objectives: ['参观罗塞塔石碑', '游览埃及木乃伊展厅', '在大中庭拍摄玻璃穹顶📸'],
    exp: 160, medal: { id: 'british-museum', icon: '🏛️', name: '大英博物馆学者', desc: '在人类文明百科全书中求知' },
    location: { lat: 51.5194, lng: -0.1270, radius: 200 },
  },
  {
    id: 'uk-ed1', city: '爱丁堡', name: '爱丁堡城堡', difficulty: 'medium', country: '英国',
    desc: '爱丁堡城堡矗立在死火山岩石上，俯瞰整座城市。千年的战争与王权在这里交织，城堡内的皇家珠宝和命运之石见证了苏格兰的历史。',
    objectives: ['参观城堡内的苏格兰皇冠珠宝', '在城堡炮台上俯瞰爱丁堡📸', '了解城堡的军事历史'],
    exp: 150, medal: { id: 'edinburgh-castle', icon: '🏰', name: '爱丁堡城堡访客', desc: '探访苏格兰千年王权的象征' },
    location: { lat: 55.9486, lng: -3.1999, radius: 300 },
  },
  {
    id: 'uk-ox1', city: '牛津', name: '牛津大学城漫步', difficulty: 'easy', country: '英国',
    desc: '牛津大学是英语世界最古老的大学，哥特式的学院建筑散布在小城各处。博德利图书馆、叹息桥和基督教堂学院（哈利波特取景地）不容错过。',
    objectives: ['参观基督教堂学院（哈利波特大厅）', '在博德利图书馆前拍照📸', '在牛津的传统酒吧品一杯英式啤酒'],
    exp: 80, medal: { id: 'oxford', icon: '🎓', name: '牛津学子', desc: '漫步世界最古老的大学城' },
    location: { lat: 51.7520, lng: -1.2577, radius: 500 },
  },
]
