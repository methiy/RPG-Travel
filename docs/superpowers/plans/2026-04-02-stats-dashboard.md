# 旅行统计仪表盘 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 替换 Profile 页为游戏成就风格统计仪表盘，新增高光摘要、CSS 饼图、活跃日历、里程碑成就模块。

**Architecture:** 将统计计算逻辑抽取到 `useStats` composable，每个统计模块拆为独立组件。重写 `profile.vue` 组合所有模块。纯 CSS 可视化，零依赖。

**Tech Stack:** Nuxt 4, Vue 3, CSS conic-gradient / grid / animations

---

## File Structure

| File | Responsibility |
|------|---------------|
| `app/composables/useStats.ts` | 新建：计算所有统计数据（computed） |
| `app/components/StatsHighlightGrid.vue` | 新建：高光摘要 2x2 卡片 |
| `app/components/StatsContinentProgress.vue` | 新建：大洲征服进度条（带颜色和征服标记） |
| `app/components/StatsDifficultyChart.vue` | 新建：难度分布 CSS 饼图 |
| `app/components/StatsActivityCalendar.vue` | 新建：90天活跃日历 |
| `app/components/StatsMilestones.vue` | 新建：里程碑成就列表 |
| `app/pages/profile.vue` | 重写：保留头部+尾部，中间替换为统计组件 |

---

### Task 1: useStats composable

**Files:**
- Create: `app/composables/useStats.ts`

- [ ] **Step 1: 创建 `app/composables/useStats.ts`**

```typescript
import type { Task } from '~/types'
import { TASKS } from '~/data/tasks'
import { CONTINENTS } from '~/data/continents'
import { COUNTRIES } from '~/data/countries'
import { ALL_MEDALS } from '~/data/medals'

interface HighlightItem {
  icon: string
  value: number
  label: string
  color: string
}

interface ContinentProgressItem {
  id: string
  name: string
  emoji: string
  color: string
  completed: number
  total: number
  percent: number
  conquered: boolean
}

interface DifficultyItem {
  key: string
  label: string
  color: string
  count: number
  percent: number
}

interface CalendarDay {
  date: string      // YYYY-MM-DD
  count: number
  level: number     // 0-3
}

interface MilestoneItem {
  id: string
  icon: string
  name: string
  condition: string
  unlocked: boolean
}

export function useStats() {
  const { state, countriesCount, completedCount, medalCount } = useGameState()
  const { getPhotos } = usePhotoCheckin()

  const allTasks = computed(() => Object.values(TASKS).flat())

  // ── Highlights ──
  const highlights = computed<HighlightItem[]>(() => {
    const completedSet = new Set(state.value.completed)
    const continentsVisited = new Set(
      allTasks.value
        .filter(t => completedSet.has(t.id))
        .map(t => {
          const country = COUNTRIES.find(c => c.id === t.country)
          return country?.continentId
        })
        .filter(Boolean),
    )
    return [
      { icon: '🌍', value: countriesCount.value, label: '个国家', color: '#4a9eff' },
      { icon: '🏅', value: medalCount.value, label: '枚勋章', color: '#ffd700' },
      { icon: '🗺️', value: continentsVisited.size, label: '大洲', color: '#a78bfa' },
      { icon: '⚡', value: state.value.exp, label: 'EXP', color: '#f59e0b' },
    ]
  })

  // ── Continent Progress ──
  const continentColors: Record<string, string> = {
    asia: '#ff6b6b',
    europe: '#4a9eff',
    americas: '#ffd700',
    'africa-me': '#f59e0b',
    oceania: '#a78bfa',
  }

  const continentProgress = computed<ContinentProgressItem[]>(() => {
    const completedSet = new Set(state.value.completed)
    return CONTINENTS.map(continent => {
      const countriesInContinent = COUNTRIES.filter(c => c.continentId === continent.id)
      const countryIds = new Set(countriesInContinent.map(c => c.id))
      const tasksInContinent = allTasks.value.filter(t => countryIds.has(t.country))
      const completedInContinent = tasksInContinent.filter(t => completedSet.has(t.id))
      const total = tasksInContinent.length
      const completed = completedInContinent.length
      const percent = total > 0 ? Math.round(completed / total * 100) : 0
      return {
        id: continent.id,
        name: continent.name,
        emoji: continent.emoji,
        color: continentColors[continent.id] || '#4a9eff',
        completed,
        total,
        percent,
        conquered: total > 0 && completed === total,
      }
    })
  })

  // ── Difficulty Distribution ──
  const difficultyDistribution = computed<DifficultyItem[]>(() => {
    const completedSet = new Set(state.value.completed)
    const completedTasks = allTasks.value.filter(t => completedSet.has(t.id))
    const total = completedTasks.length || 1
    const diffs: { key: string; label: string; color: string }[] = [
      { key: 'easy', label: '简单', color: '#4ade80' },
      { key: 'medium', label: '中等', color: '#4a9eff' },
      { key: 'hard', label: '困难', color: '#f59e0b' },
      { key: 'legendary', label: '传奇', color: '#ef4444' },
    ]
    return diffs.map(d => {
      const count = completedTasks.filter(t => t.difficulty === d.key).length
      return { ...d, count, percent: Math.round(count / total * 100) }
    })
  })

  // ── Activity Calendar (last 90 days) ──
  const activityCalendar = computed<CalendarDay[]>(() => {
    const photos = getPhotos()
    const countMap = new Map<string, number>()
    for (const p of photos) {
      if (!p.timestamp) continue
      const date = new Date(p.timestamp).toISOString().slice(0, 10)
      countMap.set(date, (countMap.get(date) || 0) + 1)
    }

    const days: CalendarDay[] = []
    const now = new Date()
    for (let i = 89; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      const count = countMap.get(dateStr) || 0
      const level = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : 3
      days.push({ date: dateStr, count, level })
    }
    return days
  })

  // ── Milestones ──
  const milestones = computed<MilestoneItem[]>(() => {
    const completedSet = new Set(state.value.completed)
    const taskCount = completedSet.size
    const countryCount = countriesCount.value
    const medalCnt = medalCount.value
    const exp = state.value.exp

    // Check if any country is fully conquered
    const hasConqueredCountry = COUNTRIES.some(country => {
      const countryTasks = allTasks.value.filter(t => t.country === country.id)
      return countryTasks.length > 0 && countryTasks.every(t => completedSet.has(t.id))
    })

    // Check if any continent is fully conquered
    const hasConqueredContinent = CONTINENTS.some(continent => {
      const countriesInContinent = COUNTRIES.filter(c => c.continentId === continent.id)
      const countryIds = new Set(countriesInContinent.map(c => c.id))
      const tasksInContinent = allTasks.value.filter(t => countryIds.has(t.country))
      return tasksInContinent.length > 0 && tasksInContinent.every(t => completedSet.has(t.id))
    })

    return [
      { id: 'first-task', icon: '🎒', name: '初出茅庐', condition: '完成第 1 个任务', unlocked: taskCount >= 1 },
      { id: 'ten-tasks', icon: '🌟', name: '十任达人', condition: '完成 10 个任务', unlocked: taskCount >= 10 },
      { id: 'hundred-tasks', icon: '💪', name: '百任勇士', condition: '完成 100 个任务', unlocked: taskCount >= 100 },
      { id: 'first-country', icon: '🏴', name: '首国征服', condition: '完成 1 个国家全部任务', unlocked: hasConqueredCountry },
      { id: 'five-countries', icon: '🗺️', name: '五国旅行家', condition: '去过 5 个国家', unlocked: countryCount >= 5 },
      { id: 'ten-medals', icon: '🏅', name: '勋章收藏家', condition: '获得 10 枚勋章', unlocked: medalCnt >= 10 },
      { id: 'continent-conquer', icon: '🌍', name: '大洲征服者', condition: '某大洲任务 100% 完成', unlocked: hasConqueredContinent },
      { id: 'exp-10k', icon: '🚀', name: 'EXP 破万', condition: '累计 10000 EXP', unlocked: exp >= 10000 },
    ]
  })

  return {
    highlights,
    continentProgress,
    difficultyDistribution,
    activityCalendar,
    milestones,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/composables/useStats.ts
git commit -m "feat(stats): add useStats composable with all dashboard computations"
```

---

### Task 2: StatsHighlightGrid 组件

**Files:**
- Create: `app/components/StatsHighlightGrid.vue`

- [ ] **Step 1: 创建 `app/components/StatsHighlightGrid.vue`**

```vue
<script setup lang="ts">
defineProps<{
  items: Array<{
    icon: string
    value: number
    label: string
    color: string
  }>
}>()
</script>

<template>
  <div class="highlight-grid">
    <div
      v-for="(item, i) in items"
      :key="item.label"
      class="highlight-card"
      :style="{ '--accent-color': item.color, animationDelay: `${i * 100}ms` }"
    >
      <span class="highlight-bg-icon">{{ item.icon }}</span>
      <div class="highlight-value">{{ item.value.toLocaleString() }}</div>
      <div class="highlight-label">{{ item.icon }} {{ item.value.toLocaleString() }} {{ item.label }}</div>
    </div>
  </div>
</template>

<style scoped>
.highlight-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.highlight-card {
  position: relative;
  overflow: hidden;
  background: var(--bg2, #131828);
  border: 1px solid var(--border, #1e2640);
  border-left: 3px solid var(--accent-color);
  border-radius: 14px;
  padding: 20px 16px;
  animation: fadeInUp 0.5s ease both;
}
.highlight-bg-icon {
  position: absolute;
  right: -4px;
  bottom: -8px;
  font-size: 56px;
  opacity: 0.08;
  pointer-events: none;
}
.highlight-value {
  font-size: 32px;
  font-weight: 800;
  color: var(--accent-color);
  line-height: 1;
  margin-bottom: 6px;
}
.highlight-label {
  font-size: 13px;
  color: var(--muted, #8890a8);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add app/components/StatsHighlightGrid.vue
git commit -m "feat(stats): add StatsHighlightGrid component"
```

---

### Task 3: StatsContinentProgress 组件

**Files:**
- Create: `app/components/StatsContinentProgress.vue`

- [ ] **Step 1: 创建 `app/components/StatsContinentProgress.vue`**

```vue
<script setup lang="ts">
defineProps<{
  items: Array<{
    id: string
    name: string
    emoji: string
    color: string
    completed: number
    total: number
    percent: number
    conquered: boolean
  }>
}>()
</script>

<template>
  <div class="section-card">
    <h3 class="section-title">🌍 大洲征服进度</h3>
    <div class="continent-list">
      <div
        v-for="c in items"
        :key="c.id"
        class="continent-row"
        :class="{ conquered: c.conquered }"
      >
        <div class="continent-label">
          <span>{{ c.emoji }} {{ c.name }}</span>
          <span class="continent-stat">
            <span v-if="c.conquered" class="conquered-badge">✅ 已征服</span>
            <span v-else>{{ c.completed }}/{{ c.total }}</span>
            <span class="continent-pct">{{ c.percent }}%</span>
          </span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: c.percent + '%', background: c.color }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-card {
  background: var(--bg2, #131828);
  border: 1px solid var(--border, #1e2640);
  border-radius: 12px;
  padding: 16px;
}
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px 0;
}
.continent-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.continent-row.conquered {
  border: 1px solid #ffd70044;
  border-radius: 10px;
  padding: 10px;
  background: #ffd70008;
}
.continent-label {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--text, #e8eaf6);
  margin-bottom: 6px;
}
.continent-stat {
  display: flex;
  gap: 8px;
  align-items: center;
}
.continent-pct {
  font-size: 12px;
  color: var(--muted, #8890a8);
  font-weight: 600;
}
.conquered-badge {
  font-size: 12px;
  color: #ffd700;
  font-weight: 700;
}
.progress-bar {
  height: 8px;
  background: #1a2540;
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add app/components/StatsContinentProgress.vue
git commit -m "feat(stats): add StatsContinentProgress component"
```

---

### Task 4: StatsDifficultyChart 组件

**Files:**
- Create: `app/components/StatsDifficultyChart.vue`

- [ ] **Step 1: 创建 `app/components/StatsDifficultyChart.vue`**

```vue
<script setup lang="ts">
const props = defineProps<{
  items: Array<{
    key: string
    label: string
    color: string
    count: number
    percent: number
  }>
}>()

const total = computed(() => props.items.reduce((s, d) => s + d.count, 0))

const conicGradient = computed(() => {
  if (total.value === 0) return 'conic-gradient(#1a2540 0% 100%)'
  let acc = 0
  const stops: string[] = []
  for (const d of props.items) {
    const start = acc
    acc += d.percent
    stops.push(`${d.color} ${start}% ${acc}%`)
  }
  // Fill remaining with last color if rounding doesn't reach 100
  if (acc < 100) {
    const last = props.items[props.items.length - 1]
    stops.push(`${last.color} ${acc}% 100%`)
  }
  return `conic-gradient(${stops.join(', ')})`
})
</script>

<template>
  <div class="section-card">
    <h3 class="section-title">📊 难度分布</h3>
    <div class="chart-wrap">
      <div class="donut" :style="{ background: conicGradient }">
        <div class="donut-hole">
          <div class="donut-total">{{ total }}</div>
          <div class="donut-label">已完成</div>
        </div>
      </div>
      <div class="legend">
        <div v-for="d in items" :key="d.key" class="legend-item">
          <span class="legend-dot" :style="{ background: d.color }" />
          <span class="legend-name">{{ d.label }}</span>
          <span class="legend-count">{{ d.count }}</span>
          <span class="legend-pct">{{ d.percent }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-card {
  background: var(--bg2, #131828);
  border: 1px solid var(--border, #1e2640);
  border-radius: 12px;
  padding: 16px;
}
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 16px 0;
}
.chart-wrap {
  display: flex;
  align-items: center;
  gap: 24px;
}
.donut {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.donut-hole {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--bg2, #131828);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.donut-total {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
}
.donut-label {
  font-size: 11px;
  color: var(--muted, #8890a8);
}
.legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.legend-name {
  color: var(--text, #e8eaf6);
  flex: 1;
}
.legend-count {
  font-weight: 700;
  color: var(--text, #e8eaf6);
}
.legend-pct {
  color: var(--muted, #8890a8);
  width: 36px;
  text-align: right;
}
@media (max-width: 400px) {
  .chart-wrap { flex-direction: column; }
  .donut { width: 120px; height: 120px; }
  .donut-hole { width: 68px; height: 68px; }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add app/components/StatsDifficultyChart.vue
git commit -m "feat(stats): add StatsDifficultyChart component with CSS donut"
```

---

### Task 5: StatsActivityCalendar 组件

**Files:**
- Create: `app/components/StatsActivityCalendar.vue`

- [ ] **Step 1: 创建 `app/components/StatsActivityCalendar.vue`**

```vue
<script setup lang="ts">
const props = defineProps<{
  days: Array<{
    date: string
    count: number
    level: number
  }>
}>()

const levelColors = ['#0e1424', '#1a3a5c', '#2563eb', '#4a9eff']

// Group days into weeks (7 rows) for CSS grid
// Grid: 7 rows (Mon-Sun) x N columns (weeks)
const weeksCount = computed(() => Math.ceil(props.days.length / 7))

// Month labels
const monthLabels = computed(() => {
  const labels: Array<{ text: string; col: number }> = []
  let lastMonth = ''
  for (let i = 0; i < props.days.length; i++) {
    const d = props.days[i]
    const month = d.date.slice(0, 7) // YYYY-MM
    if (month !== lastMonth) {
      lastMonth = month
      const col = Math.floor(i / 7)
      const monthNum = parseInt(d.date.slice(5, 7))
      const monthNames = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      labels.push({ text: monthNames[monthNum], col })
    }
  }
  return labels
})

const totalActive = computed(() => props.days.filter(d => d.count > 0).length)
</script>

<template>
  <div class="section-card">
    <h3 class="section-title">📅 活跃日历 <span class="active-count">{{ totalActive }} 天活跃</span></h3>

    <!-- Month labels -->
    <div class="month-labels" :style="{ gridTemplateColumns: `repeat(${weeksCount}, 14px)` }">
      <span
        v-for="ml in monthLabels"
        :key="ml.col"
        class="month-label"
        :style="{ gridColumn: ml.col + 1 }"
      >{{ ml.text }}</span>
    </div>

    <!-- Calendar grid -->
    <div
      class="calendar-grid"
      :style="{ gridTemplateColumns: `repeat(${weeksCount}, 14px)` }"
    >
      <div
        v-for="(day, i) in days"
        :key="day.date"
        class="cal-cell"
        :style="{ background: levelColors[day.level], gridRow: (i % 7) + 1, gridColumn: Math.floor(i / 7) + 1 }"
        :title="`${day.date}: ${day.count} 个任务`"
      />
    </div>

    <!-- Legend -->
    <div class="cal-legend">
      <span class="cal-legend-text">少</span>
      <div
        v-for="(color, i) in levelColors"
        :key="i"
        class="cal-legend-cell"
        :style="{ background: color }"
      />
      <span class="cal-legend-text">多</span>
    </div>
  </div>
</template>

<style scoped>
.section-card {
  background: var(--bg2, #131828);
  border: 1px solid var(--border, #1e2640);
  border-radius: 12px;
  padding: 16px;
}
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px 0;
}
.active-count {
  font-size: 12px;
  font-weight: 400;
  color: var(--muted, #8890a8);
  margin-left: 8px;
}
.month-labels {
  display: grid;
  grid-template-rows: 1fr;
  gap: 2px;
  margin-bottom: 4px;
  overflow-x: auto;
}
.month-label {
  font-size: 10px;
  color: var(--muted, #8890a8);
  white-space: nowrap;
}
.calendar-grid {
  display: grid;
  grid-template-rows: repeat(7, 14px);
  grid-auto-flow: column;
  gap: 2px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.cal-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
.cal-legend {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
  margin-top: 8px;
}
.cal-legend-text {
  font-size: 10px;
  color: var(--muted, #8890a8);
}
.cal-legend-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add app/components/StatsActivityCalendar.vue
git commit -m "feat(stats): add StatsActivityCalendar component with 90-day grid"
```

---

### Task 6: StatsMilestones 组件

**Files:**
- Create: `app/components/StatsMilestones.vue`

- [ ] **Step 1: 创建 `app/components/StatsMilestones.vue`**

```vue
<script setup lang="ts">
defineProps<{
  items: Array<{
    id: string
    icon: string
    name: string
    condition: string
    unlocked: boolean
  }>
}>()
</script>

<template>
  <div class="section-card">
    <h3 class="section-title">⭐ 里程碑成就</h3>
    <div class="milestone-grid">
      <div
        v-for="m in items"
        :key="m.id"
        class="milestone-item"
        :class="{ unlocked: m.unlocked }"
      >
        <div class="milestone-icon">{{ m.unlocked ? m.icon : '🔒' }}</div>
        <div class="milestone-info">
          <div class="milestone-name">{{ m.name }}</div>
          <div class="milestone-cond">{{ m.condition }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-card {
  background: var(--bg2, #131828);
  border: 1px solid var(--border, #1e2640);
  border-radius: 12px;
  padding: 16px;
}
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px 0;
}
.milestone-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.milestone-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border, #1e2640);
  background: var(--bg3, #0e1424);
  opacity: 0.45;
  filter: grayscale(0.8);
  transition: all 0.3s;
}
.milestone-item.unlocked {
  opacity: 1;
  filter: none;
  border-color: #ffd70066;
  background: #ffd70008;
}
.milestone-icon {
  font-size: 28px;
  flex-shrink: 0;
}
.milestone-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text, #e8eaf6);
}
.milestone-cond {
  font-size: 11px;
  color: var(--muted, #8890a8);
  margin-top: 2px;
}
@media (max-width: 480px) {
  .milestone-grid { grid-template-columns: 1fr; }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add app/components/StatsMilestones.vue
git commit -m "feat(stats): add StatsMilestones component"
```

---

### Task 7: 重写 profile.vue

**Files:**
- Modify: `app/pages/profile.vue`

- [ ] **Step 1: 重写 `app/pages/profile.vue`**

保留头部（头像/名称/等级/EXP/分享按钮）、最近勋章、最近照片、退出登录，中间替换为统计组件：

```vue
<template>
  <div class="profile-page">
    <!-- 区域 1：档案头部（保留原有） -->
    <section class="profile-header">
      <ClientOnly>
        <div class="header-avatar">{{ avatar }}</div>
        <div class="header-info">
          <div class="header-name">{{ authState.user?.displayName || '旅行者' }}</div>
          <div class="header-title">{{ levelInfo.title }}</div>
        </div>
        <div class="header-exp">
          <div class="exp-label">
            <span>Lv.{{ levelInfo.lv }}</span>
            <span>{{ levelInfo.cur }} / {{ levelInfo.need }} EXP</span>
          </div>
          <div class="exp-bar">
            <div class="exp-fill" :style="{ width: (levelInfo.cur / levelInfo.need * 100) + '%' }" />
          </div>
        </div>
        <NuxtLink to="/export?template=overview" class="share-btn">📤 分享我的成就</NuxtLink>
        <template #fallback>
          <div class="header-avatar">✈️</div>
          <div class="header-info">
            <div class="header-name">旅行者</div>
            <div class="header-title">初级背包客</div>
          </div>
        </template>
      </ClientOnly>
    </section>

    <!-- 统计仪表盘 -->
    <ClientOnly>
      <!-- 高光摘要 -->
      <StatsHighlightGrid :items="highlights" />

      <!-- 大洲征服进度 -->
      <StatsContinentProgress :items="continentProgress" />

      <!-- 难度分布饼图 -->
      <StatsDifficultyChart :items="difficultyDistribution" />

      <!-- 活跃日历 -->
      <StatsActivityCalendar :days="activityCalendar" />

      <!-- 里程碑成就 -->
      <StatsMilestones :items="milestones" />
    </ClientOnly>

    <!-- 最近获得的勋章 -->
    <ClientOnly>
      <section class="section-card">
        <div class="section-header">
          <h3 class="section-title">🏅 最近获得的勋章</h3>
          <NuxtLink to="/medals" class="section-link">查看全部 →</NuxtLink>
        </div>
        <div v-if="recentMedals.length" class="medals-grid">
          <div v-for="m in recentMedals" :key="m.id" class="medal-item">
            <div class="medal-icon">{{ m.icon }}</div>
            <div class="medal-name">{{ m.name }}</div>
          </div>
        </div>
        <div v-else class="empty-hint">还没有获得勋章，快去完成任务吧！</div>
      </section>
    </ClientOnly>

    <!-- 最近打卡照片 -->
    <ClientOnly>
      <section class="section-card">
        <div class="section-header">
          <h3 class="section-title">📷 最近打卡照片</h3>
          <NuxtLink to="/photos" class="section-link">查看全部 →</NuxtLink>
        </div>
        <div v-if="recentPhotos.length" class="photos-grid">
          <div v-for="p in recentPhotos" :key="p.taskId" class="photo-thumb">
            <img :src="p.dataUrl" :alt="p.taskId" />
          </div>
        </div>
        <div v-else class="empty-hint">还没有打卡照片，快去探索世界吧！</div>
      </section>
    </ClientOnly>

    <!-- 退出登录 -->
    <ClientOnly>
      <section v-if="authState.user" class="logout-section">
        <button class="logout-btn" @click="logout">🚪 退出登录</button>
      </section>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ALL_MEDALS } from '~/data/medals'

const { state: gameState, levelInfo, avatar } = useGameState()
const { authState, logout } = useAuth()
const { getPhotos } = usePhotoCheckin()
const { highlights, continentProgress, difficultyDistribution, activityCalendar, milestones } = useStats()

// Recent medals (last 6)
const recentMedals = computed(() => {
  const earned = gameState.value.medals.slice(-6).reverse()
  return earned.map(id => ALL_MEDALS.find(m => m.id === id)).filter(Boolean) as { id: string; icon: string; name: string; desc: string }[]
})

// Recent photos (last 4)
const recentPhotos = computed(() => {
  return getPhotos().slice(-4).reverse()
})
</script>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 32px;
}

/* 档案头部 */
.profile-header {
  background: linear-gradient(135deg, #0d1020, #131828);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.header-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  border: 3px solid var(--accent);
}
.header-info { text-align: center; }
.header-name { font-size: 20px; font-weight: 800; color: #fff; }
.header-title { font-size: 13px; color: var(--accent); margin-top: 2px; }
.header-exp { width: 100%; max-width: 300px; }
.exp-label { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin-bottom: 4px; }
.exp-bar { height: 8px; background: #1a2540; border-radius: 4px; overflow: hidden; }
.exp-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 4px; transition: width 1s ease; }

/* 通用 section card */
.section-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.section-title { font-size: 15px; font-weight: 700; color: #fff; margin: 0 0 12px 0; }
.section-header .section-title { margin-bottom: 0; }
.section-link { font-size: 12px; color: var(--accent); text-decoration: none; }
.section-link:hover { text-decoration: underline; }

/* 勋章 */
.medals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.medal-item { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 4px; background: var(--bg3); border-radius: 10px; }
.medal-icon { font-size: 28px; }
.medal-name { font-size: 11px; color: var(--muted); text-align: center; line-height: 1.3; }

/* 照片 */
.photos-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.photo-thumb { aspect-ratio: 1; border-radius: 10px; overflow: hidden; background: var(--bg3); }
.photo-thumb img { width: 100%; height: 100%; object-fit: cover; }

/* 空状态 */
.empty-hint { font-size: 13px; color: var(--muted); text-align: center; padding: 20px 0; }

/* 退出登录 */
.logout-section { display: flex; justify-content: center; padding: 8px 0; }
.logout-btn { width: 100%; max-width: 300px; padding: 14px 24px; background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; color: #e74c3c; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.logout-btn:hover { background: rgba(231, 76, 60, 0.1); border-color: #e74c3c; }

/* 分享按钮 */
.share-btn { display: inline-block; margin-top: 12px; padding: 10px 24px; border-radius: 12px; background: linear-gradient(135deg, #4a9eff, #7b5ea7); color: #fff; text-decoration: none; font-size: 14px; font-weight: 600; transition: transform 0.2s; }
.share-btn:hover { transform: translateY(-1px); }

/* 响应式 */
@media (max-width: 640px) {
  .profile-page { padding: 12px; gap: 12px; }
  .profile-header { padding: 20px 16px; }
  .header-avatar { width: 60px; height: 60px; font-size: 28px; }
  .header-name { font-size: 18px; }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add app/pages/profile.vue
git commit -m "feat(stats): rewrite profile page with stats dashboard components"
```

---

### Task 8: 构建验证

**Files:** None (verification only)

- [ ] **Step 1: 运行构建确认无错误**

Run: `npm run build 2>&1 | tail -20`
Expected: 构建成功，无致命错误

- [ ] **Step 2: 如有构建错误，修复后重新构建**

- [ ] **Step 3: Push**

```bash
git push origin main
```
