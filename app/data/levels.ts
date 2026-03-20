export const LEVELS: { lv: number; title: string; need: number }[] = [
  { lv: 1, title: '初级背包客', need: 100 },
  { lv: 2, title: '资深旅行者', need: 250 },
  { lv: 3, title: '环球探险家', need: 500 },
  { lv: 4, title: '世界漫游者', need: 900 },
  { lv: 5, title: '传奇旅行家', need: 1500 },
  { lv: 6, title: '地球行者', need: 2500 },
  { lv: 7, title: '星际旅人', need: 4000 },
  { lv: 8, title: '宇宙漫游者', need: 99999 },
]

export const AVATARS = ['✈️', '🌍', '🗺️', '🧳', '🏅', '🌟', '👑', '🚀']

/** Calculate level info from total EXP */
export function getLevelInfo(exp: number): { lv: number; title: string; need: number; cur: number } {
  let rem = exp
  for (const l of LEVELS) {
    if (rem < l.need) return { lv: l.lv, title: l.title, need: l.need, cur: rem }
    rem -= l.need
  }
  const last = LEVELS[LEVELS.length - 1]!
  return { lv: last.lv, title: last.title, need: last.need, cur: rem }
}

/** Get avatar emoji for given EXP */
export function getAvatar(exp: number): string {
  const info = getLevelInfo(exp)
  const idx = Math.min(info.lv - 1, AVATARS.length - 1)
  return AVATARS[idx]
}
