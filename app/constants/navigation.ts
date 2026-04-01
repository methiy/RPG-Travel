// app/constants/navigation.ts

export interface NavItem {
  path: string
  label: string
}

export interface NavGroup {
  id: string
  icon: string
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'explore',
    icon: '🗺️',
    label: '探索',
    items: [
      { path: '/', label: '世界地图' },
      { path: '/planner', label: '路线规划' },
      { path: '/weather', label: '目的地天气' },
      { path: '/timeline', label: '时间线' },
    ],
  },
  {
    id: 'achievement',
    icon: '🏆',
    label: '成就',
    items: [
      { path: '/medals', label: '勋章墙' },
      { path: '/achievements', label: '旅行成就' },
      { path: '/challenges', label: '每周挑战' },
      { path: '/leaderboard', label: '排行榜' },
    ],
  },
  {
    id: 'community',
    icon: '📸',
    label: '社区',
    items: [
      { path: '/photos', label: '我的照片' },
      { path: '/community', label: '照片社区' },
      { path: '/games', label: '小游戏' },
    ],
  },
  {
    id: 'me',
    icon: '👤',
    label: '我的',
    items: [
      { path: '/profile', label: '个人资料' },
      { path: '/settings', label: '设置' },
    ],
  },
]

/**
 * Find which group the current route belongs to.
 * Checks if the route path starts with any item's path.
 * The '/' (index) path requires an exact match to avoid matching everything.
 * Falls back to the first group ('explore') if no match found.
 */
export function findGroupByPath(path: string): NavGroup {
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (item.path === '/') {
        if (path === '/') return group
      } else if (path.startsWith(item.path)) {
        return group
      }
    }
  }
  return NAV_GROUPS[0]
}
