import { TASKS } from './tasks'
import type { Medal } from '~/types'

const GAME_MEDALS: Medal[] = [
  { id: 'quiz-master', icon: '🧭', name: '旅行知识达人', desc: '问答全部答对' },
  { id: 'packing-pro', icon: '🧳', name: '打包专家', desc: '完美完成行李打包' },
  { id: 'match-speed', icon: '⚡', name: '地标闪电手', desc: '60秒内完成配对' },
  { id: 'flag-master', icon: '🏳️', name: '国旗达人', desc: '国旗猜猜猜正确率75%以上' },
  { id: 'distance-master', icon: '📏', name: '距离感达人', desc: '距离猜猜猜平均误差15%以内' },
  { id: 'currency-master', icon: '💰', name: '汇率达人', desc: '汇率挑战正确率70%以上' },
]

export const ALL_MEDALS: Medal[] = [
  ...Object.values(TASKS).flat().map(t => t.medal),
  ...GAME_MEDALS,
]
