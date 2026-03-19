<script setup lang="ts">
import type { Task } from '~/types'
import { CHAPTERS } from '~/data/chapters'
import { TASKS } from '~/data/tasks'

const route = useRoute()
const id = route.params.id as string

const chapter = CHAPTERS.find(c => c.id === id)
if (!chapter) {
  navigateTo('/')
}

const { state, isTaskCompleted, completeTask } = useGameState()
const achievement = useAchievement()

// Redirect if locked
if (chapter && state.value.exp < chapter.unlockExp) {
  navigateTo('/')
}

// Apply chapter theme
useChapterTheme(id)

const currentCity = ref(chapter?.cities[0] ?? '')
const selectedTask = ref<Task | null>(null)
const showModal = ref(false)

const tasks = computed(() => {
  if (!chapter) return []
  return (TASKS[chapter.id] ?? []).filter(t => t.city === currentCity.value)
})

function onTaskClick(task: Task) {
  selectedTask.value = task
  showModal.value = true
}

function onComplete() {
  if (!selectedTask.value) return
  const task = selectedTask.value
  completeTask(task.id, task.exp, task.medal.id)
  showModal.value = false
  achievement.show({
    icon: task.medal.icon,
    title: '任务完成！',
    sub: '「' + task.name + '」',
    exp: task.exp,
    medal: '🏅 获得勋章：' + task.medal.name,
  })
}
</script>

<template>
  <div v-if="chapter" class="chapter-page">
    <div class="breadcrumb">
      <NuxtLink to="/">🌍 世界地图</NuxtLink>
      <span> › </span>
      <span>{{ chapter.name }}</span>
    </div>

    <div class="city-tabs">
      <button
        v-for="city in chapter.cities"
        :key="city"
        class="city-tab"
        :class="{ active: currentCity === city }"
        @click="currentCity = city"
      >
        {{ city }}
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
.chapter-page {
  padding: 24px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 13px;
  color: var(--muted);
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
.city-tab {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--bg3);
  color: var(--muted);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
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
</style>
