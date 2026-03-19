import type { Task } from '~/types'

export const indonesiaTasks: Task[] = [
  {
    id: 'id1', city: '巴厘岛', name: '在乌鲁瓦图看日落火舞', difficulty: 'medium', country: '印度尼西亚',
    desc: '乌鲁瓦图悬崖神庙海拔70米，是巴厘岛观日落的最佳地点。配合传统克差火舞，是整个巴厘岛最震撼的黄昏。',
    objectives: ['抵达乌鲁瓦图悬崖神庙', '观看克差火舞表演', '在崖边拍摄日落全景📸'],
    exp: 200, medal: { id: 'bali-sunset', icon: '🌅', name: '巴厘日落猎人', desc: '在印度洋上追逐完美落日' },
    location: { lat: -8.8291, lng: 115.0849, radius: 400 },
  },
  {
    id: 'id-ub1', city: '乌布', name: '乌布梯田漫步', difficulty: 'easy', country: '印度尼西亚',
    desc: '德格拉朗梯田是巴厘岛最美的稻田景观，层层叠叠的绿色梯田沿山谷铺展。在椰林和梯田间漫步，感受巴厘岛的田园诗意。',
    objectives: ['沿德格拉朗梯田步道漫步', '在梯田秋千上拍照📸', '在梯田旁的咖啡馆品尝猫屎咖啡'],
    exp: 80, medal: { id: 'ubud-terrace', icon: '🌾', name: '乌布梯田行者', desc: '在巴厘岛最美梯田间漫步' },
    location: { lat: -8.4312, lng: 115.2792, radius: 500 },
  },
  {
    id: 'id-yg1', city: '日惹', name: '婆罗浮屠日出', difficulty: 'medium', country: '印度尼西亚',
    desc: '婆罗浮屠是世界最大的佛教寺庙，建于9世纪。黎明时分登上塔顶，看日出从默拉皮火山后方升起，佛塔在晨光中渐渐显现，震撼人心。',
    objectives: ['凌晨4点出发前往婆罗浮屠', '在塔顶等待日出📸', '参观72座钟形佛塔和504尊佛像'],
    exp: 200, medal: { id: 'borobudur', icon: '🛕', name: '婆罗浮屠朝圣者', desc: '在世界最大佛教寺庙迎接日出' },
    location: { lat: -7.6079, lng: 110.2038, radius: 500 },
  },
  {
    id: 'id-km1', city: '科莫多', name: '科莫多岛观龙', difficulty: 'hard', country: '印度尼西亚',
    desc: '科莫多国家公园是世界上唯一能看到科莫多巨蜥的地方，这种史前巨蜥体长可达3米。在护林员带领下近距离观察这些"活恐龙"。',
    objectives: ['乘船抵达科莫多岛', '在护林员带领下徒步寻找科莫多龙', '拍摄科莫多巨蜥📸'],
    exp: 300, medal: { id: 'komodo', icon: '🦎', name: '科莫多探险家', desc: '近距离邂逅地球上最后的巨龙' },
    location: { lat: -8.5500, lng: 119.4833, radius: 2000 },
  },
]
