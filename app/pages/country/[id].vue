<script setup lang="ts">
import type { Task } from '~/types'
import { COUNTRIES } from '~/data/countries'
import { CONTINENTS } from '~/data/continents'
import { CITY_MAP } from '~/data/cities'
import { TASKS } from '~/data/tasks'

const route = useRoute()
const id = route.params.id as string

const country = COUNTRIES.find(c => c.id === id)
if (!country) {
  navigateTo('/')
}

const continent = computed(() => CONTINENTS.find(c => c.id === country?.continentId))

const { state, isTaskCompleted, completeTask } = useGameState()
const achievement = useAchievement()

// Redirect if continent locked
if (country && continent.value && state.value.exp < continent.value.unlockExp) {
  navigateTo('/')
}

// Apply country theme
useChapterTheme(id)

const currentCityId = ref(country?.cities[0] ?? '')
const selectedTask = ref<Task | null>(null)
const showModal = ref(false)

const currentCityName = computed(() => {
  return CITY_MAP[currentCityId.value]?.name ?? currentCityId.value
})

const tasks = computed(() => {
  if (!country) return []
  return (TASKS[country.id] ?? []).filter(t => t.city === currentCityName.value)
})

function getCityDisplayName(cityId: string) {
  return CITY_MAP[cityId]?.name ?? cityId
}

function onTaskClick(task: Task) {
  selectedTask.value = task
  showModal.value = true
}

function onComplete(mode: 'checkin' | 'virtual', expMultiplier: number) {
  if (!selectedTask.value) return
  const task = selectedTask.value
  const actualExp = Math.floor(task.exp * expMultiplier)
  completeTask(task.id, actualExp, task.medal.id)
  showModal.value = false
  const modeLabel = mode === 'checkin' ? '📍 实地打卡' : '🎮 虚拟完成'
  achievement.show({
    icon: task.medal.icon,
    title: '任务完成！',
    sub: '「' + task.name + '」' + modeLabel,
    exp: actualExp,
    medal: '🏅 获得勋章：' + task.medal.name,
  })
}
</script>

<template>
  <div v-if="country" class="country-page">
    <div class="breadcrumb">
      <NuxtLink to="/">🌍 世界地图</NuxtLink>
      <span> › </span>
      <span v-if="continent">{{ continent.emoji }} {{ continent.name }}</span>
      <span> › </span>
      <span>{{ country.name }}</span>
    </div>

    <div class="city-tabs" :class="{ 'city-tabs-scroll': country.cities.length > 10 }">
      <button
        v-for="cityId in country.cities"
        :key="cityId"
        class="city-tab"
        :class="{ active: currentCityId === cityId }"
        @click="currentCityId = cityId"
      >
        {{ getCityDisplayName(cityId) }}
      </button>
    </div>

    <div v-if="tasks.length" class="tasks-grid">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :done="isTaskCompleted(task.id)"
        @click="onTaskClick(task)"
      />
    </div>
    <div v-else class="empty-state">
      📭 此城市暂无任务
    </div>

    <TaskModal
      :task="selectedTask"
      :visible="showModal"
      @close="showModal = false"
      @complete="onComplete"
    />
  </div>
</template>

<style scoped>
.country-page {
  position: relative;
  padding: 24px;
}

.country-page::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: var(--theme-pattern);
  opacity: 1;
}

.country-page > * {
  position: relative;
  z-index: 1;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 13px;
  color: var(--muted);
  flex-wrap: wrap;
}
.breadcrumb a {
  color: var(--accent);
  cursor: pointer;
  text-decoration: none;
}
.breadcrumb a:hover {
  text-decoration: underline;
}
.city-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.city-tabs-scroll {
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
  padding-bottom: 8px;
}
.city-tabs-scroll::-webkit-scrollbar {
  height: 4px;
}
.city-tabs-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.city-tabs-scroll::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}
.city-tab {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--bg3);
  color: var(--muted);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}
.city-tab.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
.city-tab:hover:not(.active) {
  border-color: var(--accent);
  color: var(--accent);
}
.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--muted);
  font-size: 16px;
}

@media (max-width: 640px) {
  .country-page { padding: 16px 12px; }
  .city-tab { padding: 10px 18px; font-size: 14px; }
  .tasks-grid { grid-template-columns: 1fr; gap: 12px; }
  .empty-state { padding: 32px 16px; }
}
</style>
