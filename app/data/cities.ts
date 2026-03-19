import type { City } from '~/types'

export const CITIES: City[] = [
  // ── China (23 cities) ─────────────────────────────────
  { id: 'beijing', countryId: 'china', name: '北京', emoji: '🏛️', description: '千年古都，大国首都' },
  { id: 'shanghai', countryId: 'china', name: '上海', emoji: '🌃', description: '魔都，东方巴黎' },
  { id: 'guangzhou', countryId: 'china', name: '广州', emoji: '🌺', description: '千年商都，美食之城' },
  { id: 'shenzhen', countryId: 'china', name: '深圳', emoji: '🏙️', description: '科技之城，创新前沿' },
  { id: 'chengdu', countryId: 'china', name: '成都', emoji: '🐼', description: '天府之国，熊猫故乡' },
  { id: 'chongqing', countryId: 'china', name: '重庆', emoji: '🌶️', description: '山城火锅，赛博朋克' },
  { id: 'xian', countryId: 'china', name: '西安', emoji: '⚔️', description: '十三朝古都，丝路起点' },
  { id: 'hangzhou', countryId: 'china', name: '杭州', emoji: '🌊', description: '人间天堂，西湖美景' },
  { id: 'nanjing', countryId: 'china', name: '南京', emoji: '🏯', description: '六朝古都，金陵烟雨' },
  { id: 'suzhou', countryId: 'china', name: '苏州', emoji: '🏡', description: '园林之城，东方威尼斯' },
  { id: 'wuhan', countryId: 'china', name: '武汉', emoji: '🌉', description: '江城三镇，热干面之都' },
  { id: 'changsha', countryId: 'china', name: '长沙', emoji: '🌟', description: '星城，娱乐与美食之都' },
  { id: 'xiamen', countryId: 'china', name: '厦门', emoji: '🏖️', description: '海上花园，鼓浪屿风情' },
  { id: 'qingdao', countryId: 'china', name: '青岛', emoji: '🍺', description: '啤酒之城，红瓦绿树' },
  { id: 'dali', countryId: 'china', name: '大理', emoji: '🌊', description: '苍山洱海，风花雪月' },
  { id: 'lijiang', countryId: 'china', name: '丽江', emoji: '🏔️', description: '雪山古城，纳西风情' },
  { id: 'lhasa', countryId: 'china', name: '拉萨', emoji: '🏔️', description: '日光之城，雪域圣地' },
  { id: 'harbin', countryId: 'china', name: '哈尔滨', emoji: '❄️', description: '冰城，东方莫斯科' },
  { id: 'sanya', countryId: 'china', name: '三亚', emoji: '🏖️', description: '热带天堂，阳光海滩' },
  { id: 'guilin', countryId: 'china', name: '桂林', emoji: '🏞️', description: '山水甲天下' },
  { id: 'hongkong', countryId: 'china', name: '香港', emoji: '🌃', description: '东方之珠，中西交融' },
  { id: 'macau', countryId: 'china', name: '澳门', emoji: '🎰', description: '东方蒙特卡洛' },
  { id: 'taipei', countryId: 'china', name: '台北', emoji: '🏮', description: '宝岛文化，夜市天堂' },

  // ── Japan (7 cities) ──────────────────────────────────
  { id: 'tokyo', countryId: 'japan', name: '东京', emoji: '🗼', description: '现代繁华与传统交织' },
  { id: 'osaka-kyoto', countryId: 'japan', name: '大阪·京都', emoji: '⛩️', description: '美食之都与千年古都' },
  { id: 'nara-uji', countryId: 'japan', name: '奈良·宇治', emoji: '🦌', description: '神鹿与抹茶的故乡' },
  { id: 'fukuoka', countryId: 'japan', name: '福冈', emoji: '🍜', description: '博多拉面与屋台文化' },
  { id: 'hokkaido', countryId: 'japan', name: '北海道', emoji: '❄️', description: '雪国温泉与薰衣草' },
  { id: 'okinawa', countryId: 'japan', name: '冲绳', emoji: '🏖️', description: '热带海岛与琉球文化' },
  { id: 'other-japan', countryId: 'japan', name: '其他', emoji: '🗾', description: '日本其他城市与地区' },

  // ── Korea (6 cities) ──────────────────────────────────
  { id: 'seoul', countryId: 'korea', name: '首尔', emoji: '🏙️', description: '韩流之都，古今交融' },
  { id: 'jeju', countryId: 'korea', name: '济州岛', emoji: '🏝️', description: '火山海岛，蔚蓝海岸' },
  { id: 'busan', countryId: 'korea', name: '釜山', emoji: '🌊', description: '海港之城，彩色山城' },
  { id: 'gyeongju', countryId: 'korea', name: '庆州', emoji: '🏛️', description: '新罗古都，千年遗迹' },
  { id: 'daegu', countryId: 'korea', name: '大邱', emoji: '🌸', description: '韩国第四大城市' },
  { id: 'jeonju', countryId: 'korea', name: '全州', emoji: '🍚', description: '韩屋村与拌饭之乡' },

  // ── Singapore (1 city) ────────────────────────────────
  { id: 'singapore-city', countryId: 'singapore', name: '新加坡', emoji: '🌳', description: '花园城市，多元文化' },

  // ── Malaysia (4 cities) ───────────────────────────────
  { id: 'kuala-lumpur', countryId: 'malaysia', name: '吉隆坡', emoji: '🏙️', description: '双子塔下的多元都市' },
  { id: 'malacca', countryId: 'malaysia', name: '马六甲', emoji: '🏛️', description: '世界遗产古城' },
  { id: 'penang', countryId: 'malaysia', name: '槟城', emoji: '🎨', description: '街头艺术与美食天堂' },
  { id: 'langkawi', countryId: 'malaysia', name: '兰卡威', emoji: '🏖️', description: '免税天堂海岛' },

  // ── Thailand (4 cities) ───────────────────────────────
  { id: 'bangkok', countryId: 'thailand', name: '曼谷', emoji: '🏮', description: '天使之城，寺庙与夜市' },
  { id: 'chiang-mai', countryId: 'thailand', name: '清迈', emoji: '🏔️', description: '玫瑰之城，山间宁静' },
  { id: 'phuket', countryId: 'thailand', name: '普吉岛', emoji: '🏖️', description: '安达曼海的明珠' },
  { id: 'pattaya', countryId: 'thailand', name: '芭提雅', emoji: '🌴', description: '东方夏威夷' },

  // ── Indonesia (3 cities) ──────────────────────────────
  { id: 'bali', countryId: 'indonesia', name: '巴厘岛', emoji: '🌺', description: '众神之岛' },
  { id: 'yogyakarta', countryId: 'indonesia', name: '日惹', emoji: '🏛️', description: '爪哇文化之心' },
  { id: 'jakarta', countryId: 'indonesia', name: '雅加达', emoji: '🏙️', description: '千岛之国首都' },

  // ── Vietnam (4 cities) ────────────────────────────────
  { id: 'hanoi', countryId: 'vietnam', name: '河内', emoji: '🏮', description: '千年古都，河粉飘香' },
  { id: 'ho-chi-minh', countryId: 'vietnam', name: '胡志明市', emoji: '🏙️', description: '东方巴黎，摩托车洪流' },
  { id: 'da-nang', countryId: 'vietnam', name: '岘港', emoji: '🏖️', description: '中越海滨明珠' },
  { id: 'hoi-an', countryId: 'vietnam', name: '会安', emoji: '🏮', description: '灯笼古镇，时光静好' },

  // ── France (4 cities) ─────────────────────────────────
  { id: 'paris', countryId: 'france', name: '巴黎', emoji: '🗼', description: '浪漫之都，艺术殿堂' },
  { id: 'nice', countryId: 'france', name: '尼斯', emoji: '🏖️', description: '蔚蓝海岸明珠' },
  { id: 'lyon', countryId: 'france', name: '里昂', emoji: '🍷', description: '美食之都' },
  { id: 'marseille', countryId: 'france', name: '马赛', emoji: '⛵', description: '地中海港口城市' },

  // ── Italy (4 cities) ──────────────────────────────────
  { id: 'rome', countryId: 'italy', name: '罗马', emoji: '🏛️', description: '永恒之城，千年帝国' },
  { id: 'florence', countryId: 'italy', name: '佛罗伦萨', emoji: '🎨', description: '文艺复兴摇篮' },
  { id: 'venice', countryId: 'italy', name: '威尼斯', emoji: '🚣', description: '水上迷宫' },
  { id: 'milan', countryId: 'italy', name: '米兰', emoji: '👗', description: '时尚之都' },

  // ── Spain (4 cities) ──────────────────────────────────
  { id: 'barcelona', countryId: 'spain', name: '巴塞罗那', emoji: '⛪', description: '高迪之城，地中海明珠' },
  { id: 'madrid', countryId: 'spain', name: '马德里', emoji: '🏛️', description: '西班牙皇城' },
  { id: 'seville', countryId: 'spain', name: '塞维利亚', emoji: '💃', description: '弗拉门戈的故乡' },
  { id: 'granada', countryId: 'spain', name: '格拉纳达', emoji: '🏰', description: '阿尔罕布拉宫' },

  // ── Germany (4 cities) ────────────────────────────────
  { id: 'berlin', countryId: 'germany', name: '柏林', emoji: '🏛️', description: '历史与创意之都' },
  { id: 'munich', countryId: 'germany', name: '慕尼黑', emoji: '🍺', description: '啤酒节与巴伐利亚' },
  { id: 'hamburg', countryId: 'germany', name: '汉堡', emoji: '⚓', description: '北德港口之城' },
  { id: 'heidelberg', countryId: 'germany', name: '海德堡', emoji: '🏰', description: '浪漫之路的起点' },

  // ── UK (4 cities) ─────────────────────────────────────
  { id: 'london', countryId: 'uk', name: '伦敦', emoji: '🎡', description: '雾都，皇室之城' },
  { id: 'edinburgh', countryId: 'uk', name: '爱丁堡', emoji: '🏰', description: '苏格兰高地之门' },
  { id: 'oxford', countryId: 'uk', name: '牛津', emoji: '🎓', description: '学术殿堂' },
  { id: 'bath', countryId: 'uk', name: '巴斯', emoji: '♨️', description: '罗马温泉古城' },

  // ── Switzerland (4 cities) ────────────────────────────
  { id: 'zurich', countryId: 'switzerland', name: '苏黎世', emoji: '🏦', description: '湖畔金融之都' },
  { id: 'lucerne', countryId: 'switzerland', name: '琉森', emoji: '🌉', description: '湖光山色的中世纪古城' },
  { id: 'interlaken', countryId: 'switzerland', name: '因特拉肯', emoji: '🏔️', description: '少女峰下的冒险天堂' },
  { id: 'zermatt', countryId: 'switzerland', name: '采尔马特', emoji: '⛷️', description: '马特洪峰脚下的滑雪圣地' },

  // ── Czechia (3 cities) ────────────────────────────────
  { id: 'prague', countryId: 'czechia', name: '布拉格', emoji: '🏰', description: '百塔之城，波西米亚明珠' },
  { id: 'cesky-krumlov', countryId: 'czechia', name: '克鲁姆洛夫', emoji: '🏘️', description: '童话般的中世纪小镇' },
  { id: 'karlovy-vary', countryId: 'czechia', name: '卡罗维发利', emoji: '♨️', description: '温泉小镇与电影节' },

  // ── USA (5 cities) ────────────────────────────────────
  { id: 'new-york', countryId: 'usa', name: '纽约', emoji: '🗽', description: '不夜城，世界之都' },
  { id: 'los-angeles', countryId: 'usa', name: '洛杉矶', emoji: '🎬', description: '天使之城，好莱坞' },
  { id: 'san-francisco', countryId: 'usa', name: '旧金山', emoji: '🌉', description: '金门大桥与硅谷' },
  { id: 'las-vegas', countryId: 'usa', name: '拉斯维加斯', emoji: '🎰', description: '沙漠中的不夜城' },
  { id: 'hawaii', countryId: 'usa', name: '夏威夷', emoji: '🌺', description: '太平洋上的热带天堂' },

  // ── Mexico (4 cities) ─────────────────────────────────
  { id: 'mexico-city', countryId: 'mexico', name: '墨西哥城', emoji: '🏛️', description: '阿兹特克遗迹之上' },
  { id: 'cancun', countryId: 'mexico', name: '坎昆', emoji: '🏖️', description: '加勒比海度假天堂' },
  { id: 'oaxaca', countryId: 'mexico', name: '瓦哈卡', emoji: '🌮', description: '美食与手工艺之乡' },
  { id: 'guanajuato', countryId: 'mexico', name: '瓜纳华托', emoji: '🎨', description: '彩色殖民小城' },

  // ── Peru (3 cities) ───────────────────────────────────
  { id: 'lima', countryId: 'peru', name: '利马', emoji: '🏙️', description: '南美美食之都' },
  { id: 'cusco', countryId: 'peru', name: '库斯科', emoji: '🏔️', description: '印加帝国古都' },
  { id: 'machu-picchu', countryId: 'peru', name: '马丘比丘', emoji: '🏔️', description: '云端失落之城' },

  // ── Brazil (3 cities) ─────────────────────────────────
  { id: 'rio-de-janeiro', countryId: 'brazil', name: '里约热内卢', emoji: '🏖️', description: '上帝之城，桑巴狂欢' },
  { id: 'sao-paulo', countryId: 'brazil', name: '圣保罗', emoji: '🏙️', description: '南美最大城市' },
  { id: 'iguazu', countryId: 'brazil', name: '伊瓜苏', emoji: '🌊', description: '世界最壮观瀑布群' },

  // ── Argentina (3 cities) ──────────────────────────────
  { id: 'buenos-aires', countryId: 'argentina', name: '布宜诺斯艾利斯', emoji: '💃', description: '探戈之都' },
  { id: 'patagonia', countryId: 'argentina', name: '巴塔哥尼亚', emoji: '🏔️', description: '冰川与荒原' },
  { id: 'mendoza', countryId: 'argentina', name: '门多萨', emoji: '🍷', description: '葡萄酒庄园之乡' },

  // ── Egypt (3 cities) ──────────────────────────────────
  { id: 'cairo', countryId: 'egypt', name: '开罗', emoji: '🔺', description: '金字塔与尼罗河' },
  { id: 'luxor', countryId: 'egypt', name: '卢克索', emoji: '🏛️', description: '法老神庙之城' },
  { id: 'aswan', countryId: 'egypt', name: '阿斯旺', emoji: '⛵', description: '尼罗河上游明珠' },

  // ── Morocco (4 cities) ────────────────────────────────
  { id: 'marrakech', countryId: 'morocco', name: '马拉喀什', emoji: '🕌', description: '红色之城' },
  { id: 'fes', countryId: 'morocco', name: '菲斯', emoji: '🏺', description: '世界最大无车迷宫' },
  { id: 'chefchaouen', countryId: 'morocco', name: '舍夫沙万', emoji: '💙', description: '蓝色梦境小镇' },
  { id: 'sahara', countryId: 'morocco', name: '撒哈拉', emoji: '🏜️', description: '金色沙漠的星空' },

  // ── UAE (2 cities) ────────────────────────────────────
  { id: 'dubai', countryId: 'uae', name: '迪拜', emoji: '🏗️', description: '未来都市，沙漠奇迹' },
  { id: 'abu-dhabi', countryId: 'uae', name: '阿布扎比', emoji: '🕌', description: '石油之都，文化新城' },

  // ── South Africa (3 cities) ───────────────────────────
  { id: 'cape-town', countryId: 'south-africa', name: '开普敦', emoji: '🏔️', description: '桌山与好望角' },
  { id: 'johannesburg', countryId: 'south-africa', name: '约翰内斯堡', emoji: '🏙️', description: '黄金之城' },
  { id: 'kruger', countryId: 'south-africa', name: '克鲁格', emoji: '🦁', description: '非洲野生动物圣地' },

  // ── Australia (4 cities) ──────────────────────────────
  { id: 'sydney', countryId: 'australia', name: '悉尼', emoji: '🎭', description: '歌剧院与海港大桥' },
  { id: 'melbourne', countryId: 'australia', name: '墨尔本', emoji: '☕', description: '咖啡之都，文化之城' },
  { id: 'great-barrier-reef', countryId: 'australia', name: '大堡礁', emoji: '🐠', description: '地球最大珊瑚礁' },
  { id: 'uluru', countryId: 'australia', name: '乌鲁鲁', emoji: '🪨', description: '红色巨岩，原住民圣地' },

  // ── New Zealand (4 cities) ────────────────────────────
  { id: 'auckland', countryId: 'new-zealand', name: '奥克兰', emoji: '⛵', description: '千帆之都' },
  { id: 'queenstown', countryId: 'new-zealand', name: '皇后镇', emoji: '🏔️', description: '冒险之都' },
  { id: 'milford-sound', countryId: 'new-zealand', name: '米尔福德峡湾', emoji: '🏞️', description: '世界第八大奇迹' },
  { id: 'rotorua', countryId: 'new-zealand', name: '罗托鲁阿', emoji: '♨️', description: '地热奇观与毛利文化' },

  // ── Fiji (3 cities) ───────────────────────────────────
  { id: 'nadi', countryId: 'fiji', name: '楠迪', emoji: '✈️', description: '斐济门户城市' },
  { id: 'mamanuca', countryId: 'fiji', name: '玛玛努卡群岛', emoji: '🏝️', description: '天堂海岛群' },
  { id: 'yasawa', countryId: 'fiji', name: '亚萨瓦群岛', emoji: '🏝️', description: '原始天堂海岛' },
]

// Helper lookup
export const CITY_MAP: Record<string, City> = Object.fromEntries(CITIES.map(c => [c.id, c]))
