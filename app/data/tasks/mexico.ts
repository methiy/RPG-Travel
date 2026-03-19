import type { Task } from '~/types'

export const mexicoTasks: Task[] = [
  {
    id: 'mx-cc1', city: '奇琴伊察', name: '奇琴伊察金字塔', difficulty: 'medium', country: '墨西哥',
    desc: '奇琴伊察的库库尔坎金字塔是玛雅文明的巅峰之作，春分和秋分时蛇影会沿台阶缓缓下降。这座新世界七大奇迹让人敬畏古老文明的智慧。',
    objectives: ['参观库库尔坎金字塔', '在金字塔前拍摄全景📸', '了解玛雅天文历法与建筑奥秘'],
    exp: 200, medal: { id: 'chichen-itza', icon: '🔺', name: '玛雅金字塔访客', desc: '朝圣玛雅文明的巅峰之作' },
    location: { lat: 20.6843, lng: -88.5678, radius: 500 },
  },
  {
    id: 'mx-cn1', city: '坎昆', name: '坎昆蓝色海滩', difficulty: 'easy', country: '墨西哥',
    desc: '坎昆拥有加勒比海最惊艳的蓝色海滩，白沙细如面粉，海水蓝得不真实。在这里浮潜，可以看到色彩斑斓的热带鱼和珊瑚。',
    objectives: ['在坎昆酒店区海滩晒太阳', '在加勒比海浮潜体验', '品尝海边的墨西哥Taco📸'],
    exp: 90, medal: { id: 'cancun', icon: '🏖️', name: '坎昆弄潮儿', desc: '在加勒比海最美海滩尽享阳光' },
    location: { lat: 21.1619, lng: -86.8515, radius: 500 },
  },
  {
    id: 'mx-mc1', city: '墨西哥城', name: '墨西哥城壁画之旅', difficulty: 'easy', country: '墨西哥',
    desc: '墨西哥城是壁画运动的中心，里维拉、奥罗斯科和西凯罗斯的巨幅壁画遍布城市各处。国家宫殿的里维拉壁画是最震撼的一组。',
    objectives: ['参观国家宫殿的里维拉壁画', '游览索卡洛广场', '在壁画前拍照📸'],
    exp: 80, medal: { id: 'mexico-murals', icon: '🎨', name: '壁画之城探索者', desc: '在墨西哥城探索壁画运动的杰作' },
    location: { lat: 19.4326, lng: -99.1332, radius: 400 },
  },
]
