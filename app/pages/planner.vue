<template>
  <div class="planner-page">
    <h2>🗺️ 旅行路线规划器</h2>
    <p>{{ stepDescription }}</p>

    <!-- Step indicator -->
    <div class="step-bar">
      <div
        v-for="s in 4"
        :key="s"
        class="step-dot"
        :class="{ active: step >= s, current: step === s }"
        @click="goToStep(s)"
      />
    </div>

    <ClientOnly>
      <!-- ═══ Step 1: Select Country ═══ -->
      <section v-if="step === 1" class="planner-select">
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

      <!-- ═══ Step 2: Select City ═══ -->
      <section v-else-if="step === 2" class="planner-cities">
        <button class="back-btn" @click="goToStep(1)">← 选择其他国家</button>

        <div class="route-header">
          <div class="route-country">{{ currentCountry?.emoji }} {{ currentCountry?.name }}</div>
          <div class="route-subtitle">{{ currentCountry?.subtitle }}</div>
        </div>

        <!-- Country guide panel -->
        <CountryGuidePanel :guide="currentCountry?.guide" :country-name="currentCountry?.name" />

        <div class="city-grid">
          <div
            v-for="cityName in cityNames"
            :key="cityName"
            class="city-card"
            @click="selectCity(cityName)"
          >
            <div class="city-icon">{{ getCityEmoji(cityName) }}</div>
            <div class="city-name">{{ cityName }}</div>
            <div class="city-task-count">{{ getCityTaskCount(cityName) }} 个任务</div>
          </div>
        </div>

        <!-- Legacy: Full country route option -->
        <div class="legacy-route" @click="showFullCountryRoute">
          <span class="legacy-icon">🗺️</span>
          <div class="legacy-text">
            <div class="legacy-title">查看全国路线总览</div>
            <div class="legacy-desc">自动按城市生成完整行程</div>
          </div>
          <span class="legacy-arrow">→</span>
        </div>
      </section>

      <!-- ═══ Step 3: Map + Spot Selection ═══ -->
      <section v-else-if="step === 3" class="planner-spots">
        <button class="back-btn" @click="goToStep(2)">← 选择其他城市</button>

        <div class="route-header">
          <div class="route-country">{{ selectedCityName }}</div>
          <div class="route-subtitle">{{ currentCountry?.name }} · {{ cityTasks.length }} 个景点</div>
        </div>

        <!-- City guide panel -->
        <CityGuidePanel :guide="currentCityGuide" :city-name="selectedCityName || undefined" :country-name="currentCountry?.name" />

        <!-- Map -->
        <CityMapView
          v-if="locatedTasks.length > 0"
          :markers="spotMarkers"
        />
        <div v-else class="no-map-notice">
          📍 该城市景点暂无精确定位，请从列表中选择
        </div>

        <!-- Spot selector -->
        <SpotSelector
          :tasks="cityTasks"
          @update:selected="onSpotsSelected"
        />

        <button
          class="generate-btn"
          :disabled="selectedSpotIds.size === 0"
          @click="generateItinerary"
        >
          🚀 生成 {{ selectedSpotIds.size }} 个景点的行程
        </button>

        <!-- AI Optimize -->
        <button
          v-if="selectedSpotIds.size > 0"
          class="ai-optimize-btn"
          :disabled="aiOptimizing"
          @click="handleAIOptimize"
        >
          {{ aiOptimizing ? '⏳ AI 优化中...' : '🤖 AI 优化行程' }}
        </button>
      </section>

      <!-- ═══ Step 4: Itinerary Result ═══ -->
      <section v-else-if="step === 4" class="planner-result">
        <button class="back-btn" @click="goToStep(3)">← 重新选择景点</button>

        <div class="route-header">
          <div class="route-country">{{ selectedCityName }} · {{ itinerary.length }}日行程</div>
          <div class="route-subtitle">{{ currentCountry?.name }}</div>
        </div>

        <!-- Itinerary map -->
        <CityMapView
          v-if="itineraryMarkers.length > 0"
          :markers="itineraryMarkers"
          :polyline-points="itineraryPolyline"
          :polyline-color="'#4a9eff'"
        />

        <!-- Day cards -->
        <div class="days-list">
          <DayItinerary
            v-for="day in itinerary"
            :key="day.dayNum"
            :day="day"
          />
        </div>

        <!-- Summary -->
        <div class="route-summary">
          <div class="summary-item">
            <div class="summary-value">{{ itinerary.length }}</div>
            <div class="summary-label">天</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">{{ totalSelectedTasks }}</div>
            <div class="summary-label">景点</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">{{ totalItineraryExp }}</div>
            <div class="summary-label">总 EXP</div>
          </div>
        </div>

        <!-- AI Itinerary suggestion -->
        <div v-if="aiItinerary" class="ai-itinerary-section">
          <div class="ai-badge">🤖 AI 智能行程建议</div>
          <div class="ai-itinerary-text" v-html="renderMarkdown(aiItinerary)" />
        </div>
        <div v-if="aiOptimizeError" class="ai-itinerary-error">
          ❌ {{ aiOptimizeError }}
        </div>
      </section>

      <!-- ═══ Step 5 (hidden): Legacy Full Country View ═══ -->
      <section v-else-if="step === 5" class="planner-result">
        <button class="back-btn" @click="goToStep(2)">← 返回城市选择</button>

        <div class="route-header">
          <div class="route-country">{{ currentCountry?.name }} · 全国路线</div>
          <div class="route-subtitle">{{ currentCountry?.subtitle }}</div>
        </div>

        <div v-for="(route, idx) in legacyRoutes" :key="idx" class="route-day">
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
            <div class="summary-value">{{ legacyRoutes.length }}</div>
            <div class="summary-label">天</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">{{ legacyTotalTasks }}</div>
            <div class="summary-label">任务</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">{{ legacyTotalExp }}</div>
            <div class="summary-label">总 EXP</div>
          </div>
        </div>
      </section>

      <template #fallback>
        <div class="planner-loading">加载中...</div>
      </template>
    </ClientOnly>

    <!-- AI Chat Assistant (shown on step 2+) -->
    <AIChatPanel
      v-if="step >= 2"
      :country="currentCountry?.name"
      :city="selectedCityName || undefined"
    />
  </div>
</template>

<script setup lang="ts">
import { TASKS } from '~/data/tasks'
import { COUNTRIES } from '~/data/countries'
import { CITIES, CITY_MAP } from '~/data/cities'
import { getCityIdByName } from '~/data/city-name-map'
import type { Task, ItineraryDay, MapMarkerData } from '~/types'

const { isTaskCompleted } = useGameState()
const { getTasksForCity, getCityNamesForCountry, buildItinerary, DAY_COLORS } = useCityPlanner()

// ── State ──────────────────────────────────────────────
const step = ref(1)
const searchQuery = ref('')
const selectedCountry = ref<string | null>(null)
const selectedCityName = ref<string | null>(null)
const selectedSpotIds = ref<Set<string>>(new Set())
const itinerary = ref<ItineraryDay[]>([])

// ── Step description ───────────────────────────────────
const stepDescription = computed(() => {
  switch (step.value) {
    case 1: return '选择一个国家，探索城市景点'
    case 2: return '选择想要游览的城市'
    case 3: return '在地图上选择想去的景点'
    case 4: return '你的专属行程已生成'
    case 5: return '全国路线总览'
    default: return ''
  }
})

// ── Step navigation ────────────────────────────────────
function goToStep(s: number) {
  if (s < step.value) {
    step.value = s
    if (s <= 3) itinerary.value = []
    if (s <= 2) { selectedCityName.value = null; selectedSpotIds.value = new Set() }
    if (s <= 1) selectedCountry.value = null
  }
}

// ── Step 1: Country selection ──────────────────────────
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
  step.value = 2
}

// ── Step 2: City selection ─────────────────────────────
const cityNames = computed(() => {
  if (!selectedCountry.value) return []
  return getCityNamesForCountry(selectedCountry.value)
})

function getCityEmoji(cityName: string): string {
  const id = getCityIdByName(cityName)
  if (id && CITY_MAP[id]) return CITY_MAP[id].emoji
  return '📍'
}

function getCityTaskCount(cityName: string): number {
  if (!selectedCountry.value) return 0
  return getTasksForCity(selectedCountry.value, cityName).length
}

function selectCity(cityName: string) {
  selectedCityName.value = cityName
  step.value = 3
}

// ── Step 3: Spot selection ─────────────────────────────
const cityTasks = computed<Task[]>(() => {
  if (!selectedCountry.value || !selectedCityName.value) return []
  return getTasksForCity(selectedCountry.value, selectedCityName.value)
})

const currentCityGuide = computed(() => {
  if (!selectedCityName.value || !selectedCountry.value) return undefined
  const cityId = getCityIdByName(selectedCityName.value)
  if (cityId && CITY_MAP[cityId]) return CITY_MAP[cityId].guide
  return undefined
})

const locatedTasks = computed(() => cityTasks.value.filter(t => t.location))

const spotMarkers = computed<MapMarkerData[]>(() => {
  return locatedTasks.value
    .filter(t => selectedSpotIds.value.has(t.id))
    .map(t => ({
      id: t.id,
      name: t.name,
      lat: t.location!.lat,
      lng: t.location!.lng,
      color: '#4a9eff',
      popupHtml: `<strong>${t.name}</strong><br/><span style="color:#aaa">+${t.exp} EXP</span>`,
    }))
})

function onSpotsSelected(ids: Set<string>) {
  selectedSpotIds.value = ids
}

function generateItinerary() {
  const selected = cityTasks.value.filter(t => selectedSpotIds.value.has(t.id))
  itinerary.value = buildItinerary(selected)
  step.value = 4
}

// ── Step 4: Itinerary display ──────────────────────────
const itineraryMarkers = computed<MapMarkerData[]>(() => {
  const markers: MapMarkerData[] = []
  for (const day of itinerary.value) {
    let taskIdx = 0
    for (const task of day.tasks) {
      taskIdx++
      if (!task.location) continue
      markers.push({
        id: task.id,
        name: task.name,
        lat: task.location.lat,
        lng: task.location.lng,
        color: day.color,
        label: `${day.dayNum}`,
        popupHtml: `<strong>Day${day.dayNum}-${taskIdx}</strong><br/>${task.name}<br/><span style="color:${day.color}">+${task.exp} EXP</span>`,
      })
    }
  }
  return markers
})

const itineraryPolyline = computed<[number, number][]>(() => {
  const points: [number, number][] = []
  for (const day of itinerary.value) {
    for (const task of day.tasks) {
      if (task.location) {
        points.push([task.location.lat, task.location.lng])
      }
    }
  }
  return points
})

const totalSelectedTasks = computed(() =>
  itinerary.value.reduce((s, d) => s + d.tasks.length, 0)
)

const totalItineraryExp = computed(() =>
  itinerary.value.reduce((s, d) => s + d.totalExp, 0)
)

// ── Step 5: Legacy full country route ──────────────────
interface LegacyRouteDay {
  cityName: string
  tasks: Task[]
  totalExp: number
  tips: string[]
}

const legacyRoutes = computed<LegacyRouteDay[]>(() => {
  if (!selectedCountry.value) return []

  const countryTasks = getTasksForCountry(selectedCountry.value)
  const cityMap = new Map<string, Task[]>()
  for (const task of countryTasks) {
    const existing = cityMap.get(task.city) || []
    existing.push(task)
    cityMap.set(task.city, existing)
  }

  const days: LegacyRouteDay[] = []
  for (const [city, tasks] of cityMap) {
    const sorted = [...tasks].sort((a, b) => {
      const order: Record<string, number> = { easy: 0, medium: 1, hard: 2, legendary: 3 }
      return (order[a.difficulty] ?? 0) - (order[b.difficulty] ?? 0)
    })

    const tips: string[] = []
    for (const t of sorted) {
      if (t.guide?.tips) {
        tips.push(...t.guide.tips.slice(0, 2))
        break
      }
    }

    days.push({ cityName: city, tasks: sorted, totalExp: sorted.reduce((sum, t) => sum + t.exp, 0), tips })
  }

  return days
})

const legacyTotalTasks = computed(() => legacyRoutes.value.reduce((s, r) => s + r.tasks.length, 0))
const legacyTotalExp = computed(() => legacyRoutes.value.reduce((s, r) => s + r.totalExp, 0))

function showFullCountryRoute() {
  step.value = 5
}

// ── Helpers ────────────────────────────────────────────
function diffLabel(d: string): string {
  const map: Record<string, string> = { easy: '简单', medium: '中等', hard: '困难', legendary: '传奇' }
  return map[d] || d
}

// ── AI Optimize ────────────────────────────────────────
const aiOptimizing = ref(false)
const aiItinerary = ref('')
const aiOptimizeError = ref('')

async function handleAIOptimize() {
  const { checkConfigured, optimizeItinerary } = useAI()

  const configured = await checkConfigured()
  if (!configured) {
    aiOptimizeError.value = '请先在设置页面配置 AI'
    return
  }

  aiOptimizing.value = true
  aiOptimizeError.value = ''
  aiItinerary.value = ''

  try {
    const selected = cityTasks.value.filter(t => selectedSpotIds.value.has(t.id))
    const tasks = selected.map(t => ({
      name: t.name,
      city: t.city,
      difficulty: t.difficulty,
      exp: t.exp,
    }))

    const result = await optimizeItinerary(
      tasks,
      selectedCityName.value || '',
      currentCountry.value?.name || '',
    )
    aiItinerary.value = result

    // Auto navigate to step 4 to show results with the AI suggestion
    if (itinerary.value.length === 0) {
      generateItinerary()
    }
  } catch (err: unknown) {
    aiOptimizeError.value = (err as Error).message || 'AI 优化失败'
  } finally {
    aiOptimizing.value = false
  }
}

// Simple markdown renderer
function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h4 class="ai-h3">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="ai-h2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/^---$/gm, '<hr/>')
    .replace(/\n\n/g, '<br/>')
    .replace(/\n/g, ' ')
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
  margin-bottom: 12px;
  font-size: 13px;
}

/* Step indicator */
.step-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.step-dot {
  width: 28px;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  transition: all 0.3s;
  cursor: pointer;
}
.step-dot.active {
  background: var(--accent);
}
.step-dot.current {
  width: 40px;
  background: var(--accent);
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

/* City grid */
.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}
.city-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.city-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}
.city-icon {
  font-size: 24px;
  margin-bottom: 4px;
}
.city-name {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}
.city-task-count {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}

/* Legacy route entry */
.legacy-route {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--bg2);
  border: 1px dashed var(--border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.legacy-route:hover {
  border-color: var(--accent);
  border-style: solid;
}
.legacy-icon {
  font-size: 24px;
}
.legacy-text {
  flex: 1;
}
.legacy-title {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}
.legacy-desc {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}
.legacy-arrow {
  color: var(--muted);
  font-size: 16px;
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
  margin-bottom: 16px;
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

/* No map notice */
.no-map-notice {
  padding: 20px;
  text-align: center;
  background: var(--bg2);
  border: 1px dashed var(--border);
  border-radius: 12px;
  color: var(--muted);
  font-size: 13px;
}

/* Generate button */
.generate-btn {
  display: block;
  width: 100%;
  margin-top: 16px;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: var(--accent);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.generate-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}
.generate-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Days list */
.days-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 16px 0;
}

/* Legacy route days */
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
  .city-grid { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 8px; }
  .country-card { padding: 12px 8px; }
  .city-card { padding: 10px 8px; }
  .country-emoji { font-size: 24px; }
  .route-day { padding: 12px; }
  .route-task { padding: 8px; }
}

/* AI Optimize button */
.ai-optimize-btn {
  display: block;
  width: 100%;
  margin-top: 8px;
  padding: 12px;
  border-radius: 12px;
  border: 1px dashed var(--accent);
  background: rgba(74, 158, 255, 0.05);
  color: var(--accent);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.ai-optimize-btn:hover:not(:disabled) {
  background: rgba(74, 158, 255, 0.1);
  border-style: solid;
}
.ai-optimize-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* AI Itinerary */
.ai-itinerary-section {
  margin-top: 16px;
  padding: 16px;
  background: var(--bg2);
  border: 1px solid rgba(74, 158, 255, 0.2);
  border-radius: 12px;
}
.ai-badge {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(74, 158, 255, 0.1);
  border: 1px solid rgba(74, 158, 255, 0.2);
  border-radius: 6px;
  font-size: 12px;
  color: var(--accent);
  margin-bottom: 12px;
}
.ai-itinerary-text {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.7;
}
.ai-itinerary-text :deep(h3) {
  font-size: 15px;
  font-weight: 700;
  color: var(--accent);
  margin: 16px 0 6px;
}
.ai-itinerary-text :deep(h4) {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin: 10px 0 4px;
}
.ai-itinerary-text :deep(ul) {
  margin: 4px 0;
  padding-left: 18px;
}
.ai-itinerary-text :deep(li) {
  margin-bottom: 3px;
}
.ai-itinerary-text :deep(strong) {
  color: var(--text);
}
.ai-itinerary-text :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 12px 0;
}
.ai-itinerary-error {
  margin-top: 8px;
  padding: 10px 14px;
  background: rgba(214, 48, 49, 0.1);
  border: 1px solid rgba(214, 48, 49, 0.2);
  border-radius: 10px;
  color: var(--red);
  font-size: 13px;
}
</style>
