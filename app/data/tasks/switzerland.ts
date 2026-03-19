import type { Task } from '~/types'

export const switzerlandTasks: Task[] = [
  {
    id: 'ch-jf1', city: '因特拉肯', name: '少女峰登顶欧洲之巅', difficulty: 'hard', country: '瑞士',
    desc: '少女峰（Jungfraujoch）海拔3454米，被称为"欧洲之巅"。乘坐百年历史的齿轮火车穿越艾格尔峰内部，到达山顶的冰雪世界。',
    objectives: ['乘坐少女峰铁路登顶', '在斯芬克斯观景台远眺阿莱奇冰川📸', '参观冰宫和阿尔卑斯奇观展'],
    exp: 300, medal: { id: 'jungfrau', icon: '🏔️', name: '少女峰征服者', desc: '登顶欧洲之巅少女峰' },
    location: { lat: 46.5472, lng: 7.9853, radius: 1000 },
  },
  {
    id: 'ch-il1', city: '因特拉肯', name: '因特拉肯滑翔伞', difficulty: 'hard', country: '瑞士',
    desc: '在阿尔卑斯山间乘滑翔伞翱翔，脚下是碧蓝的图恩湖和布里恩茨湖，远处是少女峰雪峰。这是瑞士最刺激也最美的极限运动体验。',
    objectives: ['在因特拉肯报名双人滑翔伞体验', '从山顶起飞翱翔阿尔卑斯上空', '在空中拍摄双湖和雪山全景📸'],
    exp: 280, medal: { id: 'interlaken-paraglide', icon: '🪂', name: '因特拉肯飞人', desc: '在阿尔卑斯山间自由翱翔' },
    location: { lat: 46.6863, lng: 7.8632, radius: 500 },
  },
  {
    id: 'ch-zm1', city: '采尔马特', name: '马特洪峰观景', difficulty: 'medium', country: '瑞士',
    desc: '马特洪峰是阿尔卑斯最具标志性的山峰，完美的三角锥体倒映在里弗尔湖中。采尔马特小镇禁止燃油车，空气纯净如世外桃源。',
    objectives: ['乘坐戈尔内格拉特齿轮火车上山', '在里弗尔湖拍摄马特洪峰倒影📸', '在采尔马特小镇散步品尝瑞士芝士火锅'],
    exp: 180, medal: { id: 'matterhorn', icon: '⛰️', name: '马特洪峰朝圣者', desc: '朝圣阿尔卑斯最美三角锥峰' },
    location: { lat: 46.0207, lng: 7.7491, radius: 500 },
  },
  {
    id: 'ch-lc1', city: '卢塞恩', name: '卢塞恩湖畔漫步', difficulty: 'easy', country: '瑞士',
    desc: '卢塞恩是瑞士最美的古城之一，卡佩尔桥是欧洲最古老的木桥。漫步湖畔，远处是皮拉图斯山和瑞吉山，湖光山色美得不真实。',
    objectives: ['走过卡佩尔桥并拍照📸', '沿卢塞恩湖畔步道漫步', '参观垂死的狮子雕像'],
    exp: 80, medal: { id: 'lucerne', icon: '🌊', name: '卢塞恩湖畔客', desc: '漫步瑞士最美湖畔古城' },
    location: { lat: 47.0502, lng: 8.3093, radius: 400 },
  },
]
