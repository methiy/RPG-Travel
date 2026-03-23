export interface Achievement {
  id: string
  icon: string
  name: string
  desc: string
  category: 'explorer' | 'collector' | 'challenge' | 'social'
  /** How to check: type of condition */
  condition:
    | { type: 'tasks_total'; count: number }
    | { type: 'tasks_continent'; continentId: string; count: number }
    | { type: 'tasks_country'; countryId: string; count: number }
    | { type: 'countries_total'; count: number }
    | { type: 'countries_continent'; continentId: string; count: number }
    | { type: 'cities_total'; count: number }
    | { type: 'medals_total'; count: number }
    | { type: 'difficulty'; difficulty: string; count: number }
    | { type: 'exp_total'; amount: number }
    | { type: 'photos_total'; count: number }
}

export const ACHIEVEMENTS: Achievement[] = [
  // ── 探索者成就 (Explorer) ──────────────────────────
  { id: 'ach-first-step', icon: '👣', name: '第一步', desc: '完成第 1 个任务', category: 'explorer', condition: { type: 'tasks_total', count: 1 } },
  { id: 'ach-5-tasks', icon: '🎒', name: '背包客', desc: '完成 5 个任务', category: 'explorer', condition: { type: 'tasks_total', count: 5 } },
  { id: 'ach-15-tasks', icon: '🧭', name: '探路者', desc: '完成 15 个任务', category: 'explorer', condition: { type: 'tasks_total', count: 15 } },
  { id: 'ach-30-tasks', icon: '🌍', name: '环球旅行家', desc: '完成 30 个任务', category: 'explorer', condition: { type: 'tasks_total', count: 30 } },
  { id: 'ach-50-tasks', icon: '🚀', name: '传奇旅行者', desc: '完成 50 个任务', category: 'explorer', condition: { type: 'tasks_total', count: 50 } },
  { id: 'ach-100-tasks', icon: '👑', name: '旅行之王', desc: '完成 100 个任务', category: 'explorer', condition: { type: 'tasks_total', count: 100 } },

  // 国家探索
  { id: 'ach-3-countries', icon: '🗺️', name: '跨越国境', desc: '探索 3 个国家', category: 'explorer', condition: { type: 'countries_total', count: 3 } },
  { id: 'ach-8-countries', icon: '✈️', name: '飞行达人', desc: '探索 8 个国家', category: 'explorer', condition: { type: 'countries_total', count: 8 } },
  { id: 'ach-15-countries', icon: '🌐', name: '世界公民', desc: '探索 15 个国家', category: 'explorer', condition: { type: 'countries_total', count: 15 } },

  // 城市探索
  { id: 'ach-5-cities', icon: '🏙️', name: '城市漫步者', desc: '探索 5 个城市', category: 'explorer', condition: { type: 'cities_total', count: 5 } },
  { id: 'ach-20-cities', icon: '🌆', name: '都市行者', desc: '探索 20 个城市', category: 'explorer', condition: { type: 'cities_total', count: 20 } },
  { id: 'ach-50-cities', icon: '🏗️', name: '城市收藏家', desc: '探索 50 个城市', category: 'explorer', condition: { type: 'cities_total', count: 50 } },

  // ── 大洲精通 (Continent Mastery) ────────────────────
  { id: 'ach-asia-5', icon: '🌏', name: '亚洲初探', desc: '在亚洲完成 5 个任务', category: 'explorer', condition: { type: 'tasks_continent', continentId: 'asia', count: 5 } },
  { id: 'ach-asia-all-countries', icon: '🐉', name: '亚洲通', desc: '探索亚洲全部国家', category: 'explorer', condition: { type: 'countries_continent', continentId: 'asia', count: 8 } },
  { id: 'ach-europe-5', icon: '🏰', name: '欧洲初探', desc: '在欧洲完成 5 个任务', category: 'explorer', condition: { type: 'tasks_continent', continentId: 'europe', count: 5 } },
  { id: 'ach-europe-all-countries', icon: '👑', name: '欧洲贵族', desc: '探索欧洲全部国家', category: 'explorer', condition: { type: 'countries_continent', continentId: 'europe', count: 7 } },
  { id: 'ach-americas-5', icon: '🌎', name: '美洲初探', desc: '在美洲完成 5 个任务', category: 'explorer', condition: { type: 'tasks_continent', continentId: 'americas', count: 5 } },
  { id: 'ach-americas-all-countries', icon: '🦅', name: '美洲之鹰', desc: '探索美洲全部国家', category: 'explorer', condition: { type: 'countries_continent', continentId: 'americas', count: 5 } },
  { id: 'ach-africa-3', icon: '🌍', name: '非洲中东初探', desc: '在非洲与中东完成 3 个任务', category: 'explorer', condition: { type: 'tasks_continent', continentId: 'africa-me', count: 3 } },
  { id: 'ach-oceania-3', icon: '🏝️', name: '大洋洲初探', desc: '在大洋洲完成 3 个任务', category: 'explorer', condition: { type: 'tasks_continent', continentId: 'oceania', count: 3 } },

  // ── 国家精通 ────────────────────────────────────────
  { id: 'ach-japan-master', icon: '🗾', name: '日本通', desc: '完成日本全部任务', category: 'explorer', condition: { type: 'tasks_country', countryId: 'japan', count: 999 } },
  { id: 'ach-china-master', icon: '🏯', name: '中国通', desc: '完成中国全部任务', category: 'explorer', condition: { type: 'tasks_country', countryId: 'china', count: 999 } },
  { id: 'ach-france-master', icon: '🗼', name: '法兰西之心', desc: '完成法国全部任务', category: 'explorer', condition: { type: 'tasks_country', countryId: 'france', count: 999 } },
  { id: 'ach-usa-master', icon: '🗽', name: '美国梦', desc: '完成美国全部任务', category: 'explorer', condition: { type: 'tasks_country', countryId: 'usa', count: 999 } },

  // ── 收藏家成就 (Collector) ──────────────────────────
  { id: 'ach-5-medals', icon: '🏅', name: '勋章新手', desc: '获得 5 枚勋章', category: 'collector', condition: { type: 'medals_total', count: 5 } },
  { id: 'ach-20-medals', icon: '🎖️', name: '勋章猎人', desc: '获得 20 枚勋章', category: 'collector', condition: { type: 'medals_total', count: 20 } },
  { id: 'ach-50-medals', icon: '💎', name: '勋章大师', desc: '获得 50 枚勋章', category: 'collector', condition: { type: 'medals_total', count: 50 } },

  // ── 挑战者成就 (Challenge) ──────────────────────────
  { id: 'ach-easy-10', icon: '🌱', name: '轻松旅行', desc: '完成 10 个简单任务', category: 'challenge', condition: { type: 'difficulty', difficulty: 'easy', count: 10 } },
  { id: 'ach-medium-10', icon: '⚔️', name: '中级冒险家', desc: '完成 10 个中等任务', category: 'challenge', condition: { type: 'difficulty', difficulty: 'medium', count: 10 } },
  { id: 'ach-hard-5', icon: '🔥', name: '勇者无畏', desc: '完成 5 个困难任务', category: 'challenge', condition: { type: 'difficulty', difficulty: 'hard', count: 5 } },
  { id: 'ach-hard-15', icon: '💀', name: '硬核旅行者', desc: '完成 15 个困难任务', category: 'challenge', condition: { type: 'difficulty', difficulty: 'hard', count: 15 } },
  { id: 'ach-legendary-1', icon: '⭐', name: '传奇初现', desc: '完成 1 个传奇任务', category: 'challenge', condition: { type: 'difficulty', difficulty: 'legendary', count: 1 } },
  { id: 'ach-legendary-5', icon: '🌟', name: '传奇收割者', desc: '完成 5 个传奇任务', category: 'challenge', condition: { type: 'difficulty', difficulty: 'legendary', count: 5 } },

  // ── 经验值里程碑 ────────────────────────────────────
  { id: 'ach-exp-500', icon: '💫', name: 'EXP 新星', desc: '累计获得 500 EXP', category: 'challenge', condition: { type: 'exp_total', amount: 500 } },
  { id: 'ach-exp-2000', icon: '☀️', name: 'EXP 之光', desc: '累计获得 2000 EXP', category: 'challenge', condition: { type: 'exp_total', amount: 2000 } },
  { id: 'ach-exp-5000', icon: '🌙', name: 'EXP 传说', desc: '累计获得 5000 EXP', category: 'challenge', condition: { type: 'exp_total', amount: 5000 } },

  // ── 摄影成就 (Social/Photos) ───────────────────────
  { id: 'ach-1-photo', icon: '📸', name: '第一张照片', desc: '上传第 1 张打卡照', category: 'social', condition: { type: 'photos_total', count: 1 } },
  { id: 'ach-10-photos', icon: '📷', name: '摄影爱好者', desc: '上传 10 张打卡照', category: 'social', condition: { type: 'photos_total', count: 10 } },
  { id: 'ach-30-photos', icon: '🎞️', name: '摄影达人', desc: '上传 30 张打卡照', category: 'social', condition: { type: 'photos_total', count: 30 } },
]
