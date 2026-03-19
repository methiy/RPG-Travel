import { TASKS } from './tasks'
import type { Medal } from '~/types'

const GAME_MEDALS: Medal[] = [
  { id: 'quiz-master', icon: '🧭', name: '旅行知识达人', desc: '问答全部答对' },
  { id: 'packing-pro', icon: '🧳', name: '打包专家', desc: '完美完成行李打包' },
  { id: 'match-speed', icon: '⚡', name: '地标闪电手', desc: '60秒内完成配对' },
]

export const ALL_MEDALS: Medal[] = [
  ...Object.values(TASKS).flat().map(t => t.medal),
  ...GAME_MEDALS,
]
