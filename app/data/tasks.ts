import type { Task } from '~/types'

export const TASKS: Record<string, Task[]> = {
  japan: [
    {
      id: 'jp1', city: '东京', name: '在涩谷十字路口打卡', difficulty: 'easy', country: '日本',
      desc: '涩谷十字路口是全球最繁忙的斑马线，人潮汹涌时一次可过500人。站在路口中央，感受东京速度。',
      objectives: ['在绿灯时走过涩谷十字路口', '在忠犬八公像前拍照', '爬上涩谷天空展望台看俯瞰图'],
      exp: 70, medal: { id: 'shibuya', icon: '🚦', name: '涩谷交叉口', desc: '穿越最繁忙的十字路口' },
    },
    {
      id: 'jp2', city: '东京', name: '在筑地场外市场吃早餐', difficulty: 'easy', country: '日本',
      desc: '筑地场外市场是东京美食的天花板，天刚亮就开始热闹。吃一碗现剖金枪鱼丼或新鲜牡蛎，感受东京最真实的一面。',
      objectives: ['清晨6点前抵达场外市场', '品尝金枪鱼丼或海鲜', '在玉子烧摊位购买现做玉子烧'],
      exp: 80, medal: { id: 'tsukiji', icon: '🐟', name: '筑地美食家', desc: '品尝东京最鲜的海鲜' },
    },
    {
      id: 'jp3', city: '大阪·京都', name: '在道顿堀吃章鱼烧', difficulty: 'easy', country: '日本',
      desc: '大阪道顿堀是美食的圣地，固力果跑跑人看板是必打卡地标，现做的章鱼烧是大阪灵魂。',
      objectives: ['固力果看板前打卡📸', '品尝现做章鱼烧', '在戎桥拍夜景'],
      exp: 80, medal: { id: 'takoyaki', icon: '🐙', name: '章鱼烧达人', desc: '品尝大阪灵魂美食' },
    },
    {
      id: 'jp4', city: '大阪·京都', name: '在伏见稻荷爬完全部鸟居', difficulty: 'medium', country: '日本',
      desc: '伏见稻荷大社有上万座朱红色鸟居绵延山顶，是京都最具代表性的景点。爬到山顶需要约2小时，但鸟居隧道的震撼无可比拟。',
      objectives: ['拍摄千本鸟居入口📸', '一路爬到稻荷山顶（233m）', '在山顶稻荷大神处参拜'],
      exp: 200, medal: { id: 'fushimi', icon: '⛩️', name: '千本鸟居行者', desc: '穿越万座鸟居登顶稻荷山' },
    },
    {
      id: 'jp5', city: '奈良·宇治', name: '在奈良公园喂鹿', difficulty: 'easy', country: '日本',
      desc: '奈良公园有约1200头自由漫步的梅花鹿，被视为神使。买一包鹿饼，向鹿鞠躬，它们会还礼！',
      objectives: ['购买鹿饼与鹿互动', '在东大寺大佛前打卡', '拍摄鹿与古建筑合影📸'],
      exp: 90, medal: { id: 'nara-deer', icon: '🦌', name: '奈良鹿友', desc: '与会鞠躬的神鹿交朋友' },
    },
    {
      id: 'jp6', city: '奈良·宇治', name: '在宇治喝一杯抹茶', difficulty: 'easy', country: '日本',
      desc: '宇治是抹茶的发源地，平等院凤凰堂印在10日元硬币上。来一杯宇治抹茶拿铁，配上和菓子，是日式美学的完整体验。',
      objectives: ['参观平等院凤凰堂', '品尝辻利或中村藤吉抹茶甜品', '在宇治川旁散步📸'],
      exp: 80, medal: { id: 'matcha', icon: '🍵', name: '抹茶鉴赏家', desc: '追溯抹茶文化源头' },
    },
    {
      id: 'jp7', city: '其他', name: '登上富士山山顶', difficulty: 'hard', country: '日本',
      desc: '挑战日本最高峰富士山（3776m）。从吉田口五合目出发，穿越云层，在日出时分站上山顶，俯瞰壮阔日本大地。',
      objectives: ['从五合目出发徒步登山', '到达剑峰顶点（3776m）', '完成御来光（山顶日出）观赏'],
      exp: 350, medal: { id: 'fuji', icon: '🗻', name: '富士登顶者', desc: '征服日本最高峰' },
    },
    {
      id: 'jp8', city: '其他', name: '乘嵯峨野观光小火车', difficulty: 'medium', country: '日本',
      desc: '嵯峨野观光铁道沿保津川缓缓穿越竹林与峡谷，车速极慢，每个弯道都是一幅画。',
      objectives: ['在龟冈站或嵯峨站上车', '穿越竹林段拍照📸', '抵达终点站完成全程'],
      exp: 150, medal: { id: 'sagano', icon: '🚂', name: '嵯峨野旅人', desc: '乘坐日本最美观光小火车' },
    },
  ],
  korea: [
    {
      id: 'kr1', city: '首尔', name: '爬上首尔南山N塔', difficulty: 'easy', country: '韩国',
      desc: '南山是首尔的制高点，N首尔塔俯瞰整个汉城盆地。挂上爱情锁，看首尔夜景，是最经典的首尔打卡。',
      objectives: ['徒步或乘缆车上南山', '在爱情锁栏杆前打卡', '观赏首尔360°夜景📸'],
      exp: 100, medal: { id: 'n-tower', icon: '🗼', name: '首尔守望者', desc: '俯瞰千年古都夜景' },
    },
    {
      id: 'kr2', city: '首尔', name: '在广藏市场吃韩式美食', difficulty: 'easy', country: '韩国',
      desc: '广藏市场是首尔最古老的传统市场，生拌牛肉、绿豆煎饼、紫菜包饭——一条街吃遍韩式传统小吃。',
      objectives: ['品尝生拌牛肉（yukhoe）', '吃绿豆煎饼（bindaetteok）', '在市场内转满一圈'],
      exp: 70, medal: { id: 'gwangjang', icon: '🥩', name: '广藏市场吃货', desc: '征服首尔最老传统市场' },
    },
    {
      id: 'kr3', city: '济州岛', name: '游览济州岛牛岛', difficulty: 'easy', country: '韩国',
      desc: '从城山港乘渡轮15分钟即达牛岛，透明蓝绿色海水令人窒息。牛岛花生冰淇淋是必吃当地名物。',
      objectives: ['从城山港乘渡轮到牛岛', '品尝牛岛花生冰淇淋', '拍摄牛岛海岸全景📸'],
      exp: 100, medal: { id: 'udo', icon: '🏝️', name: '牛岛探险家', desc: '发现济州最美离岛' },
    },
    {
      id: 'kr4', city: '济州岛', name: '登上城山日出峰看日出', difficulty: 'medium', country: '韩国',
      desc: '城山日出峰是世界自然遗产，凌晨爬上这座形似古城的火山口，等待日出从大海升起，是济州最史诗级的体验。',
      objectives: ['凌晨4:30出发上山', '在火山口边等待日出', '日出后下山逛渔村市场'],
      exp: 180, medal: { id: 'sunrise-peak', icon: '🌅', name: '城山追日者', desc: '在世遗火山口等候日出' },
    },
    {
      id: 'kr5', city: '釜山', name: '在甘川文化村打卡', difficulty: 'easy', country: '韩国',
      desc: '甘川文化村是釜山的"马丘比丘"，五彩斑斓的房屋层叠在山坡上，弯弯曲曲的小巷里藏着无数艺术装置。',
      objectives: ['找到小王子雕像打卡📸', '沿指示牌游览全村', '购买一份手绘地图留念'],
      exp: 90, medal: { id: 'gamcheon', icon: '🎨', name: '甘川艺术探索者', desc: '发现釜山最美彩色山城' },
    },
    {
      id: 'kr6', city: '庆州', name: '骑车游览庆州古墓群', difficulty: 'medium', country: '韩国',
      desc: '庆州是韩国的"西安"，新罗王朝的千年古都。骑着自行车穿梭在巨大圆形古墓群之间，是最接近历史的方式。',
      objectives: ['租自行车或电动车', '绕大陵苑古墓群一圈', '在石窟庵或佛国寺拍照📸'],
      exp: 160, medal: { id: 'gyeongju', icon: '🏛️', name: '新罗遗迹探访者', desc: '骑游千年古都庆州' },
    },
  ],
  seasia: [
    {
      id: 'sg1', city: '新加坡', name: '漫步滨海湾花园看夜间灯光秀', difficulty: 'easy', country: '新加坡',
      desc: 'Gardens by the Bay的超级树夜间灯光秀Garden Rhapsody是免费的，配合音乐的灯光变幻让人忘记时间。',
      objectives: ['游览花穹或云雾林温室', '观看超级树夜间灯光秀', '在滨海湾金沙外景拍照📸'],
      exp: 120, medal: { id: 'sg-garden', icon: '🌳', name: '花园城市居民', desc: '探索新加坡未来花园' },
    },
    {
      id: 'sg2', city: '新加坡', name: '在牛车水找到最地道的肉骨茶', difficulty: 'easy', country: '新加坡',
      desc: '牛车水（Chinatown）是新加坡华人文化的根，福建式肉骨茶加上白饭，是最接地气的新加坡早餐体验。',
      objectives: ['在牛车水找一家本地肉骨茶店', '完整吃完一套肉骨茶+油条', '在牛车水庙宇前打卡'],
      exp: 80, medal: { id: 'bak-kut-teh', icon: '🍖', name: '肉骨茶鉴赏家', desc: '在华人古街品尝南洋精髓' },
    },
    {
      id: 'my1', city: '马来西亚', name: '在马六甲骑三轮车逛鸡场街', difficulty: 'easy', country: '马来西亚',
      desc: '马六甲是世界遗产古城，装饰华丽的三轮车是最当地的游览方式，鸡场街的娘惹美食和古董店让时光倒流。',
      objectives: ['在荷兰红屋广场打卡📸', '乘坐三轮车游鸡场街', '品尝娘惹菜或鸡饭粒'],
      exp: 90, medal: { id: 'malacca', icon: '🚲', name: '古城探索者', desc: '游历南洋风情古城' },
    },
    {
      id: 'my2', city: '马来西亚', name: '登上吉隆坡双子塔', difficulty: 'medium', country: '马来西亚',
      desc: '高452米的双子塔曾是世界第一高楼，登顶观景台可以俯瞰整个KL，41层的天桥是最佳拍照点。',
      objectives: ['购买双子塔登顶门票', '参观41层空中走廊', '在顶层观景台留念📸'],
      exp: 180, medal: { id: 'klcc', icon: '🏙️', name: '双塔之顶', desc: '征服世界最高双子楼' },
    },
    {
      id: 'th1', city: '泰国', name: '在清迈放天灯', difficulty: 'medium', country: '泰国',
      desc: '清迈水灯节（Yi Peng）是世界最美节日之一，无数孔明灯同时升空，整片夜空都变成了星河。',
      objectives: ['参加Yi Peng或类似天灯活动', '亲手放飞一盏天灯', '拍摄天灯升空瞬间📸'],
      exp: 220, medal: { id: 'lantern', icon: '🏮', name: '清迈天灯放飞者', desc: '在星空下放飞心愿天灯' },
    },
    {
      id: 'id1', city: '巴厘岛', name: '在乌鲁瓦图看日落火舞', difficulty: 'medium', country: '印度尼西亚',
      desc: '乌鲁瓦图悬崖神庙海拔70米，是巴厘岛观日落的最佳地点。配合传统克差火舞，是整个巴厘岛最震撼的黄昏。',
      objectives: ['抵达乌鲁瓦图悬崖神庙', '观看克差火舞表演', '在崖边拍摄日落全景📸'],
      exp: 200, medal: { id: 'bali-sunset', icon: '🌅', name: '巴厘日落猎人', desc: '在印度洋上追逐完美落日' },
    },
  ],
  china: [
    {
      id: 'cn1', city: '武汉·宜昌', name: '乘船过葛洲坝船闸', difficulty: 'medium', country: '中国',
      desc: '参加两坝一峡一日游，亲历游轮从三斗坪缓缓驶过葛洲坝五级船闸，水落船降的过程需要约1小时，震撼无比。',
      objectives: ['乘坐三峡系列游轮出发', '穿越西陵峡欣赏峡谷风光', '亲历葛洲坝船闸水位变化'],
      exp: 160, medal: { id: 'gezhouba', icon: '⚓', name: '三峡航行者', desc: '穿越长江第一坝' },
    },
    {
      id: 'cn2', city: '武汉·宜昌', name: '站上三峡大坝坛子岭', difficulty: 'easy', country: '中国',
      desc: '三峡大坝是世界最大水电站。坛子岭是观看大坝的最佳位置，鸟瞰五级船闸和壮阔高峡平湖，感受中国工程奇迹。',
      objectives: ['乘电梯到坛子岭顶', '俯瞰三峡大坝全貌📸', '参观185观景平台感受"截断巫山云雨"'],
      exp: 130, medal: { id: 'dam', icon: '🏗️', name: '三峡大坝见证者', desc: '站上世界最大水电站观景台' },
    },
    {
      id: 'cn3', city: '香港', name: '徒步麦理浩径第二段全程', difficulty: 'hard', country: '中国',
      desc: '从万宜水库东坝出发，穿越浪茄湾、西湾山顶，抵达咸田湾，最后趟水登船回西贡。全程约13-15公里，是香港最壮美的徒步路线。',
      objectives: ['从东坝出发徒步', '爬上西湾山顶（最难段）', '抵达咸田湾趟水登船📸'],
      exp: 300, medal: { id: 'maclehose', icon: '⛰️', name: '麦径勇士', desc: '完成香港最美徒步路线' },
    },
    {
      id: 'cn4', city: '西藏', name: '在拉萨转动八廓街转经筒', difficulty: 'legendary', country: '中国',
      desc: '海拔3650米的拉萨，随朝圣者顺时针转动八廓街转经筒，感受藏传佛教最圣洁的朝圣之路，是一生必做的事。',
      objectives: ['办理西藏旅游许可证', '顺时针绕八廓街一圈', '在大昭寺前与朝圣者合影📸'],
      exp: 500, medal: { id: 'lhasa', icon: '🏔️', name: '雪域行者', desc: '踏上世界屋脊朝圣之路' },
    },
    {
      id: 'cn5', city: '云南', name: '在大理古城看苍山洱海日落', difficulty: 'easy', country: '中国',
      desc: '大理古城与苍山洱海构成了中国最美的古城风景之一。骑车环洱海，在某个小渔村等待日落，是岁月静好的真实样本。',
      objectives: ['骑车环洱海一段', '在洱海边拍摄苍山倒影📸', '在大理古城品尝乳扇和玫瑰糕'],
      exp: 140, medal: { id: 'dali', icon: '🌊', name: '苍山洱海行者', desc: '骑游大理最美湖光山色' },
    },
  ],
  europe: [
    {
      id: 'eu1', city: '法国·巴黎', name: '在埃菲尔铁塔下许愿', difficulty: 'medium', country: '法国',
      desc: '巴黎的象征，无论白天还是夜晚都美得令人窒息。夜间每小时整点的闪光灯表演持续5分钟，是必等的浪漫时刻。',
      objectives: ['白天在铁塔下拍照📸', '等到整点欣赏灯光秀', '登上铁塔第二层俯瞰巴黎'],
      exp: 200, medal: { id: 'eiffel', icon: '🗼', name: '巴黎铁塔见证者', desc: '在浪漫之城许下心愿' },
    },
    {
      id: 'eu2', city: '意大利', name: '在罗马竞技场感受历史', difficulty: 'medium', country: '意大利',
      desc: '斗兽场矗立了近2000年，站在这里你能感受到整个罗马帝国的重量。周边的罗马广场是免费的历史露天博物馆。',
      objectives: ['入场参观竞技场内部', '在罗马广场漫步', '品尝传统罗马冰淇淋（gelato）'],
      exp: 220, medal: { id: 'colosseum', icon: '🏛️', name: '罗马帝国访客', desc: '踏入2000年历史的斗兽场' },
    },
    {
      id: 'eu3', city: '西班牙', name: '在巴塞罗那看高迪建筑', difficulty: 'medium', country: '西班牙',
      desc: '圣家族大教堂是建了140年还没完工的奇迹，充满高迪天马行空的想象力。从外观到内部，每个细节都值得细看。',
      objectives: ['参观圣家族大教堂（需提前预约）', '游览奎尔公园📸', '在兰布拉大道享用西班牙海鲜饭'],
      exp: 210, medal: { id: 'sagrada', icon: '⛪', name: '高迪幻想游客', desc: '探索建了百年的疯狂大教堂' },
    },
  ],
  americas: [
    {
      id: 'us1', city: '美国', name: '在纽约时代广场跨年', difficulty: 'hard', country: '美国',
      desc: '纽约时代广场跨年是全球最著名的跨年倒计时，数十万人聚集，水晶球缓缓降落，是人类最大的共同仪式之一。',
      objectives: ['提前6小时占据好位置', '完整观看水晶球降落仪式', '在时代广场霓虹灯下留影📸'],
      exp: 380, medal: { id: 'times-sq', icon: '🎆', name: '时代广场跨年者', desc: '参与全球最大跨年倒计时' },
    },
    {
      id: 'pe1', city: '秘鲁', name: '登上马丘比丘观日出', difficulty: 'legendary', country: '秘鲁',
      desc: '云雾缭绕中的印加失落之城，海拔2430米。凌晨爬上太阳门等候日出从马丘比丘后山升起，是旅行者传说的终极成就。',
      objectives: ['持马丘比丘入场券', '凌晨攀登太阳门等日出', '在经典观景台拍摄全景📸'],
      exp: 600, medal: { id: 'machu', icon: '🏔️', name: '马丘比丘朝圣者', desc: '登上印加失落之城的巅峰' },
    },
  ],
  africa: [
    {
      id: 'af1', city: '埃及', name: '站在吉萨金字塔前', difficulty: 'easy', country: '埃及',
      desc: '吉萨金字塔群是古代世界七大奇迹中唯一现存的奇迹。站在胡夫金字塔前，感受4500年的时光重量。',
      objectives: ['在胡夫金字塔前拍照📸', '骑骆驼穿越沙漠', '参观狮身人面像'],
      exp: 100, medal: { id: 'pyramid', icon: '🔺', name: '金字塔见证者', desc: '站在人类最古老的奇迹前' },
    },
    {
      id: 'af2', city: '摩洛哥', name: '穿越菲斯古城迷宫', difficulty: 'medium', country: '摩洛哥',
      desc: '菲斯古城（Fes el Bali）是世界上最大的无车城区，9000多条巷道组成的迷宫让GPS也失灵。',
      objectives: ['进入菲斯古城麦地那', '找到著名的皮革染坊', '在迷宫中找到一家传统手工艺店'],
      exp: 180, medal: { id: 'fes', icon: '🏺', name: '古城迷踪者', desc: '穿越世界最大无车迷宫' },
    },
    {
      id: 'af3', city: '迪拜', name: '登上哈利法塔观景台', difficulty: 'medium', country: '阿联酋',
      desc: '哈利法塔828米，是世界第一高楼。在148层的观景台俯瞰整个迪拜，云层就在脚下。',
      objectives: ['乘高速电梯到达148层', '在观景台拍摄迪拜全景📸', '观赏迪拜喷泉表演'],
      exp: 200, medal: { id: 'burj', icon: '🏗️', name: '云端登临者', desc: '站上世界最高建筑' },
    },
    {
      id: 'af4', city: '南非', name: '在好望角打卡', difficulty: 'medium', country: '南非',
      desc: '好望角是非洲大陆的西南端，大西洋与印度洋在此交汇。站在灯塔旁，感受两大洋的壮阔。',
      objectives: ['徒步到好望角标志牌前📸', '爬上开普角灯塔', '观察沿途的野生动物'],
      exp: 160, medal: { id: 'cape', icon: '🌊', name: '好望角勇者', desc: '抵达非洲大陆西南端' },
    },
    {
      id: 'af5', city: '迪拜', name: '穿越沙漠冲沙', difficulty: 'hard', country: '阿联酋',
      desc: '乘坐越野车在金色沙丘上疯狂冲沙，是迪拜最刺激的户外体验。日落时分的沙漠美得不真实。',
      objectives: ['乘坐4x4越野车进入沙漠', '完成冲沙体验', '在沙漠营地观看日落和肚皮舞'],
      exp: 300, medal: { id: 'desert', icon: '🏜️', name: '沙漠征服者', desc: '在金色沙丘上疯狂冲沙' },
    },
    {
      id: 'af6', city: '南非', name: '克鲁格国家公园观五大兽', difficulty: 'legendary', country: '南非',
      desc: '克鲁格国家公园是非洲最大的野生动物保护区之一。找齐非洲五大兽（狮子、大象、犀牛、水牛、豹）是终极Safari成就。',
      objectives: ['参加清晨Safari游猎', '拍摄到至少三种五大兽📸', '在保护区内过夜'],
      exp: 500, medal: { id: 'safari', icon: '🦁', name: '非洲猎游者', desc: '在野生动物王国找齐五大兽' },
    },
  ],
  oceania: [
    {
      id: 'oc1', city: '澳大利亚', name: '在悉尼歌剧院前打卡', difficulty: 'easy', country: '澳大利亚',
      desc: '悉尼歌剧院是20世纪最具标志性的建筑之一，贝壳般的屋顶倒映在悉尼港的碧蓝海水中。',
      objectives: ['在歌剧院前广场拍照📸', '沿环形码头散步到海港大桥', '在岩石区品尝澳式咖啡'],
      exp: 90, medal: { id: 'opera', icon: '🎭', name: '歌剧院访客', desc: '打卡世界最美建筑之一' },
    },
    {
      id: 'oc2', city: '大堡礁', name: '潜水大堡礁', difficulty: 'hard', country: '澳大利亚',
      desc: '大堡礁是地球上最大的珊瑚礁系统，从太空都能看到。潜入水下，是进入另一个星球。',
      objectives: ['乘船前往外堡礁', '完成深潜或浮潜体验', '拍摄珊瑚和热带鱼📸'],
      exp: 350, medal: { id: 'reef', icon: '🐠', name: '大堡礁潜行者', desc: '潜入地球最大珊瑚礁' },
    },
    {
      id: 'oc3', city: '新西兰', name: '米尔福德峡湾巡游', difficulty: 'medium', country: '新西兰',
      desc: '米尔福德峡湾被称为"世界第八大奇迹"，瀑布从千米高的悬崖上倾泻而下，海豹在礁石上晒太阳。',
      objectives: ['乘坐峡湾巡游船', '穿越斯特林瀑布水帘', '拍摄米特峰倒影📸'],
      exp: 200, medal: { id: 'milford', icon: '🏔️', name: '峡湾探索者', desc: '巡游世界第八大奇迹' },
    },
    {
      id: 'oc4', city: '新西兰', name: '挑战皇后镇蹦极', difficulty: 'hard', country: '新西兰',
      desc: '皇后镇是现代蹦极的发源地。从卡瓦劳大桥43米高处一跃而下，脚尖几乎触碰碧绿河水。',
      objectives: ['前往卡瓦劳大桥蹦极中心', '完成43米蹦极跳', '获取蹦极证书📸'],
      exp: 320, medal: { id: 'bungee', icon: '🪂', name: '极限勇者', desc: '在蹦极发源地纵身一跃' },
    },
    {
      id: 'oc5', city: '斐济', name: '在私人海岛浮潜', difficulty: 'medium', country: '斐济',
      desc: '斐济拥有300多个热带岛屿，透明的海水下是五彩斑斓的珊瑚花园。这里是南太平洋的天堂。',
      objectives: ['乘快艇前往外岛', '在珊瑚花园浮潜', '享受海岛BBQ午餐'],
      exp: 180, medal: { id: 'fiji', icon: '🏝️', name: '南太平洋岛民', desc: '发现斐济的天堂海岛' },
    },
    {
      id: 'oc6', city: '大堡礁', name: '乘直升机俯瞰心形礁', difficulty: 'legendary', country: '澳大利亚',
      desc: '心形礁是大堡礁中一块天然形成的心形珊瑚礁，只有从空中才能看到完整的心形。',
      objectives: ['从艾尔利海滩搭乘直升机', '从空中拍摄心形礁全景📸', '飞越白天堂海滩'],
      exp: 550, medal: { id: 'heart-reef', icon: '💙', name: '心形礁发现者', desc: '从空中发现大自然的爱心' },
    },
  ],
}
