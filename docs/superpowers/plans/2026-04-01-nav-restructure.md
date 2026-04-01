# Navigation Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 13-tab flat horizontal navigation with a bottom Tab Bar (4 groups) + top Sub Navigation (per-group sub-pages).

**Architecture:** The current `MainNav.vue` becomes `SubNav.vue` which dynamically shows only the sub-pages for the active group. A new `BottomTabBar.vue` provides 4 fixed bottom tabs. Both components share a `NAV_GROUPS` constant for group definitions. The layout (`default.vue`) is updated to place SubNav above content and BottomTabBar below.

**Tech Stack:** Vue 3, Nuxt 4 auto-imports, CSS (no new dependencies)

---

### File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `app/constants/navigation.ts` | Create | `NAV_GROUPS` constant — single source of truth for tab grouping |
| `app/components/BottomTabBar.vue` | Create | Fixed bottom tab bar with 4 group tabs |
| `app/components/MainNav.vue` → `app/components/SubNav.vue` | Rename + rewrite | Top sub-navigation showing only current group's sub-pages |
| `app/layouts/default.vue` | Modify | Update layout to use SubNav + BottomTabBar, add bottom padding |

---

### Task 1: Create NAV_GROUPS constant

**Files:**
- Create: `app/constants/navigation.ts`

- [ ] **Step 1: Create the navigation constants file**

```typescript
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
```

- [ ] **Step 2: Verify the file has no syntax errors**

Run: `npx vue-tsc --noEmit 2>&1 | head -20`

Expected: No errors related to `navigation.ts`

- [ ] **Step 3: Commit**

```bash
git add app/constants/navigation.ts
git commit -m "feat: add NAV_GROUPS constant for tab grouping"
```

---

### Task 2: Create BottomTabBar component

**Files:**
- Create: `app/components/BottomTabBar.vue`

- [ ] **Step 1: Create the BottomTabBar component**

```vue
<template>
  <nav class="bottom-tab-bar">
    <NuxtLink
      v-for="group in NAV_GROUPS"
      :key="group.id"
      :to="group.items[0].path"
      class="tab-item"
      :class="{ active: currentGroup.id === group.id }"
    >
      <span class="tab-icon">{{ group.icon }}</span>
      <span class="tab-label">{{ group.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { NAV_GROUPS, findGroupByPath } from '~/constants/navigation'

const route = useRoute()
const currentGroup = computed(() => findGroupByPath(route.path))
</script>

<style scoped>
.bottom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: var(--bg2);
  border-top: 1px solid var(--border);
  padding: 6px 0;
  padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px));
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 12px;
  text-decoration: none;
  color: var(--muted);
  transition: color 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.tab-item.active {
  color: var(--accent);
}

.tab-item:hover {
  color: var(--text);
}

.tab-icon {
  font-size: 22px;
  line-height: 1;
}

.tab-label {
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
}

@media (max-width: 640px) {
  .tab-icon { font-size: 20px; }
  .tab-label { font-size: 9px; }
}
</style>
```

- [ ] **Step 2: Verify no syntax errors**

Run: `npx vue-tsc --noEmit 2>&1 | head -20`

Expected: No errors related to `BottomTabBar.vue`

- [ ] **Step 3: Commit**

```bash
git add app/components/BottomTabBar.vue
git commit -m "feat: add BottomTabBar component with 4 group tabs"
```

---

### Task 3: Rewrite MainNav as SubNav

**Files:**
- Rename: `app/components/MainNav.vue` → `app/components/SubNav.vue`

- [ ] **Step 1: Delete MainNav.vue and create SubNav.vue**

First rename the file:

```bash
git mv app/components/MainNav.vue app/components/SubNav.vue
```

Then replace the entire contents of `app/components/SubNav.vue` with:

```vue
<template>
  <nav v-if="currentGroup.items.length > 1" class="subnav">
    <NuxtLink
      v-for="item in currentGroup.items"
      :key="item.path"
      :to="item.path"
      class="navbtn"
      :class="{ active: isActive(item.path) }"
    >
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { findGroupByPath } from '~/constants/navigation'

const route = useRoute()
const currentGroup = computed(() => findGroupByPath(route.path))

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.subnav {
  display: flex;
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
}
.subnav::-webkit-scrollbar { display: none; }

.navbtn {
  padding: 10px 20px;
  background: none;
  border: none;
  color: var(--muted);
  font-size: 13px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: all 0.2s;
  text-decoration: none;
}
.navbtn.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
.navbtn:hover {
  color: var(--text);
}

@media (max-width: 640px) {
  .navbtn { padding: 8px 16px; font-size: 12px; }
}
</style>
```

Note: The `v-if="currentGroup.items.length > 1"` ensures SubNav is always visible in our case since every group has 2+ items. But it protects against future groups with only 1 item.

- [ ] **Step 2: Verify no syntax errors**

Run: `npx vue-tsc --noEmit 2>&1 | head -20`

Expected: No errors related to `SubNav.vue`. There WILL be an error in `default.vue` because it still references `<MainNav />` — that's fixed in the next task.

- [ ] **Step 3: Commit**

```bash
git add app/components/SubNav.vue app/components/MainNav.vue
git commit -m "feat: replace MainNav with SubNav showing per-group sub-pages"
```

---

### Task 4: Update default layout

**Files:**
- Modify: `app/layouts/default.vue`

- [ ] **Step 1: Update the layout to use SubNav and BottomTabBar**

Replace the entire content of `app/layouts/default.vue` with:

```vue
<template>
  <div>
    <template v-if="!authState.loading && authState.user">
      <TopBar />
      <SubNav />
      <div class="page-content">
        <slot />
      </div>
      <BottomTabBar />
      <AchievementModal />
    </template>
    <div v-else-if="authState.loading" class="loading-screen">
      <div class="loading-logo">🌍</div>
      <div class="loading-text">加载中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { authState } = useAuth()
</script>

<style scoped>
.page-content {
  padding-bottom: 64px;
}

.loading-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
.loading-logo {
  font-size: 48px;
  animation: bounce 1.5s ease infinite;
}
.loading-text {
  color: var(--muted);
  font-size: 14px;
}
@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
</style>
```

Key changes from the original:
- `<MainNav />` → `<SubNav />`
- Added `<BottomTabBar />` after the slot
- Wrapped `<slot />` in `<div class="page-content">` with `padding-bottom: 64px` to avoid content being hidden behind the fixed bottom bar

- [ ] **Step 2: Build and verify**

Run: `npm run build 2>&1 | tail -5`

Expected: Build completes with `✨ Build complete!` and no errors.

- [ ] **Step 3: Commit**

```bash
git add app/layouts/default.vue
git commit -m "feat: update layout with SubNav + BottomTabBar"
```

---

### Task 5: Visual verification and cleanup

- [ ] **Step 1: Start dev server and verify navigation works**

Run: `npm run dev &` and wait for the server to start.

Verify these behaviors:
1. Bottom tab bar shows 4 tabs: 探索, 成就, 社区, 我的
2. Clicking "探索" goes to `/` and top SubNav shows: 世界地图, 路线规划, 目的地天气, 时间线
3. Clicking "成就" goes to `/medals` and top SubNav shows: 勋章墙, 旅行成就, 每周挑战, 排行榜
4. Clicking "社区" goes to `/photos` and top SubNav shows: 我的照片, 照片社区, 小游戏
5. Clicking "我的" goes to `/profile` and top SubNav shows: 个人资料, 设置
6. Active states highlight correctly in both bars
7. No content hidden behind the bottom tab bar

- [ ] **Step 2: Stop the dev server**

Kill the background dev server process.

- [ ] **Step 3: Final build check**

Run: `npm run build`

Expected: Clean build with no errors.

- [ ] **Step 4: Commit all and push**

```bash
git push
```
