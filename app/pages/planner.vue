<template>
  <div class="planner-page">
    <h2>🗺️ 旅行路线规划器</h2>
    <p>选择一个国家，自动生成一日游路线推荐</p>

    <ClientOnly>
      <!-- Step 1: 选择国家 -->
      <section v-if="!selectedCountry" class="planner-select">
        <div class="planner-search">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="🔍 搜索国家..."
            class="search-input"
          />
        </div>
        <div class="country-grid">
          <div
            v-for="c in filteredCountries"
            :key="c.id"
            class="country-card"
            @click="selectCountry(c.id)"
          >
            <div class="country-emoji">{{ c.emoji }}</div>
            <div class="country-name">{{ c.name }}</div>
            <div class="country-task-count">{{ getCountryTaskCount(c.id) }} 个任务</div>
          </div>
        </div>
      </section>

      <!-- Step 2: 显示路线 -->
      <section v-else class="planner-result">
        <button class="back-btn" @click="selectedCountry = null">← 选择其他国家</button>

        <div class="route-header">
          <div class="route-country">{{ currentCountry?.name }}</div>
          <div class="route-subtitle">{{ currentCountry?.subtitle }}</div>
        </div>

        <div v-for="(route, idx) in routes" :key="idx" class="route-day">
          <div class="route-day-header">
            <span class="route-day-num">Day {{ idx + 1 }}</span>
            <span class="route-day-city">{{ route.cityName }}</span>
            <span class="route-day-exp">{{ route.totalExp }} EXP</span>
          </div>

          <div class="route-tasks">
            <div
              v-for="(task, tIdx) in route.tasks"
              :key="task.id"
              class="route-task"
              :class="{ completed: isTaskCompleted(task.id) }"
            >
              <div class="route-task-num">{{ tIdx + 1 }}</div>
              <div class="route-task-body">
                <div class="route-task-name">{{ task.name }}</div>
                <div class="route-task-meta">
                  <span :class="'diff-' + task.difficulty">{{ diffLabel(task.difficulty) }}</span>
                  <span>+{{ task.exp }} EXP</span>
                </div>
                <div v-if="task.guide?.bestTime" class="route-task-time">
                  🕐 {{ task.guide.bestTime }}
                </div>
                <div v-if="task.guide?.transport?.length" class="route-task-transport">
                  🚇 {{ task.guide.transport[0] }}
                </div>
              </div>
              <div v-if="isTaskCompleted(task.id)" class="route-task-check">✅</div>
            </div>
          </div>

          <div v-if="route.tips.length" class="route-tips">
            <div class="route-tips-title">💡 实用贴士</div>
            <ul>
              <li v-for="(tip, i) in route.tips" :key="i">{{ tip }}</li>
            </ul>
          </div>
        </div>

        <div class="route-summary">
          <div class="summary-item">
            <div class="summary-value">{{ routes.length }}</div>
            <div class="summary-label">天</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">{{ totalTaskCount }}</div>
            <div class="summary-label">任务</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">{{ totalRouteExp }}</div>
            <div class="summary-label">总 EXP</div>
          </div>
        </div>
      </section>

      <template #fallback>
        <div class="planner-loading">加载中...</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { TASKS } from '~/data/tasks'
import { COUNTRIES } from '~/data/countries'
import type { Task } from '~/types'

const { isTaskCompleted } = useGameState()

const searchQuery = ref('')
const selectedCountry = ref<string | null>(null)

// TASKS is Record<countryId, Task[]>, use key directly
function getTasksForCountry(countryId: string): Task[] {
  return TASKS[countryId] ?? []
}

function getCountryTaskCount(countryId: string): number {
  return getTasksForCountry(countryId).length
}

const filteredCountries = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return COUNTRIES
  return COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(q) || c.id.includes(q)
  )
})

const currentCountry = computed(() =>
  COUNTRIES.find(c => c.id === selectedCountry.value)
)

function selectCountry(id: string) {
  selectedCountry.value = id
}

interface RouteDay {
  cityName: string
  tasks: Task[]
  totalExp: number
  tips: string[]
}

const routes = computed<RouteDay[]>(() => {
  if (!selectedCountry.value) return []

  const countryTasks = getTasksForCountry(selectedCountry.value)
  // Group tasks by city
  const cityMap = new Map<string, Task[]>()
  for (const task of countryTasks) {
    const existing = cityMap.get(task.city) || []
    existing.push(task)
    cityMap.set(task.city, existing)
  }

  // Build route: one day per city, sorted by difficulty (easy first)
  const days: RouteDay[] = []
  for (const [city, tasks] of cityMap) {
    const sorted = [...tasks].sort((a, b) => {
      const order = { easy: 0, medium: 1, hard: 2, legendary: 3 }
      return order[a.difficulty] - order[b.difficulty]
    })

    // Collect tips from the first task with a guide
    const tips: string[] = []
    for (const t of sorted) {
      if (t.guide?.tips) {
        tips.push(...t.guide.tips.slice(0, 2))
        break
      }
    }

    days.push({
      cityName: city,
      tasks: sorted,
      totalExp: sorted.reduce((sum, t) => sum + t.exp, 0),
      tips,
    })
  }

  return days
})

const totalTaskCount = computed(() => routes.value.reduce((sum, r) => sum + r.tasks.length, 0))
const totalRouteExp = computed(() => routes.value.reduce((sum, r) => sum + r.totalExp, 0))

function diffLabel(d: string): string {
  const map: Record<string, string> = { easy: '简单', medium: '中等', hard: '困难', legendary: '传奇' }
  return map[d] || d
}
</script>

<style scoped>
.planner-page {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
}
.planner-page h2 {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 6px;
}
.planner-page > p {
  color: var(--muted);
  margin-bottom: 20px;
}

/* Search */
.planner-search {
  margin-bottom: 16px;
}
.search-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg2);
  color: var(--text);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.search-input:focus {
  border-color: var(--accent);
}
.search-input::placeholder {
  color: var(--muted);
}

/* Country grid */
.country-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}
.country-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.country-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}
.country-emoji {
  font-size: 28px;
  margin-bottom: 6px;
}
.country-name {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}
.country-task-count {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}

/* Back button */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg2);
  color: var(--muted);
  cursor: pointer;
  font-size: 13px;
  margin-bottom: 16px;
  transition: all 0.2s;
}
.back-btn:hover {
  color: var(--text);
  border-color: var(--text);
}

/* Route header */
.route-header {
  margin-bottom: 20px;
}
.route-country {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
}
.route-subtitle {
  font-size: 13px;
  color: var(--muted);
  margin-top: 4px;
}

/* Route days */
.route-day {
  margin-bottom: 20px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}
.route-day-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.route-day-num {
  font-size: 13px;
  font-weight: 800;
  color: var(--accent);
  background: rgba(74, 158, 255, 0.1);
  padding: 4px 10px;
  border-radius: 8px;
}
.route-day-city {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  flex: 1;
}
.route-day-exp {
  font-size: 12px;
  color: var(--accent);
  font-weight: 700;
}

/* Tasks in route */
.route-tasks {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.route-task {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: var(--bg3);
  border-radius: 8px;
  align-items: flex-start;
}
.route-task.completed {
  opacity: 0.6;
}
.route-task-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  flex-shrink: 0;
  margin-top: 2px;
}
.route-task-body {
  flex: 1;
  min-width: 0;
}
.route-task-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}
.route-task-meta {
  display: flex;
  gap: 8px;
  font-size: 11px;
  color: var(--muted);
  margin-top: 3px;
}
.diff-easy { color: #00b894; }
.diff-medium { color: #fdcb6e; }
.diff-hard { color: #e17055; }
.diff-legendary { color: #d63031; }
.route-task-time,
.route-task-transport {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}
.route-task-check {
  font-size: 16px;
  flex-shrink: 0;
}

/* Tips */
.route-tips {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}
.route-tips-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 6px;
}
.route-tips ul {
  margin: 0;
  padding-left: 18px;
}
.route-tips li {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.5;
}

/* Summary */
.route-summary {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 16px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
}
.summary-item {
  text-align: center;
}
.summary-value {
  font-size: 22px;
  font-weight: 800;
  color: var(--accent);
}
.summary-label {
  font-size: 11px;
  color: var(--muted);
}

.planner-loading {
  text-align: center;
  color: var(--muted);
  padding: 60px 0;
  font-size: 14px;
}

/* Mobile */
@media (max-width: 640px) {
  .planner-page { padding: 16px 12px; }
  .planner-page h2 { font-size: 19px; }
  .country-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
  .country-card { padding: 12px 8px; }
  .country-emoji { font-size: 24px; }
  .route-day { padding: 12px; }
  .route-task { padding: 8px; }
}
</style>
