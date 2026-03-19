<script setup lang="ts">
import type { Chapter } from '~/types'
import { TASKS } from '~/data/tasks'

const props = defineProps<{ chapter: Chapter }>()

const { state } = useGameState()

const locked = computed(() => state.value.exp < props.chapter.unlockExp)

const progress = computed(() => {
  const tasks = TASKS[props.chapter.id] || []
  const total = tasks.length
  const done = tasks.filter(t => state.value.completed.includes(t.id)).length
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
})

function handleClick() {
  if (locked.value) {
    const need = props.chapter.unlockExp
    alert(`需要累计 ${need} EXP 才能解锁此章节！继续完成任务积累经验吧 💪`)
  } else {
    navigateTo('/chapter/' + props.chapter.id)
  }
}
</script>

<template>
  <div
    class="chapter-card"
    :class="{ locked }"
    :style="!locked ? { '--card-primary': chapter.theme.primary } : {}"
    @click="handleClick"
  >
    <div class="chapter-banner" :style="{ background: chapter.bg }">
      {{ chapter.emoji }}
    </div>
    <div v-if="locked" class="chapter-lock">🔒</div>
    <div class="chapter-body">
      <div class="chapter-name">{{ chapter.name }}</div>
      <div class="chapter-sub">{{ chapter.subtitle }}</div>
      <div class="chapter-progress">
        <div class="prog-label">
          <span>进度</span>
          <span>{{ progress.done }}/{{ progress.total }}</span>
        </div>
        <div class="prog-bar">
          <div class="prog-fill" :style="{ width: progress.pct + '%' }" />
        </div>
      </div>
      <div class="chapter-tags">
        <span v-for="tag in chapter.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <div v-if="locked" class="unlock-hint">
        🔒 需要 {{ chapter.unlockExp }} EXP 解锁
      </div>
    </div>
  </div>
</template>

<style scoped>
.chapter-card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all .3s;
  position: relative;
}
.chapter-card:hover {
  transform: translateY(-4px);
  border-color: var(--card-primary, var(--accent));
  box-shadow: 0 12px 30px color-mix(in srgb, var(--card-primary, var(--accent)) 20%, transparent);
}
.chapter-card.locked {
  opacity: .5;
  cursor: not-allowed;
}
.chapter-card.locked:hover {
  transform: none;
  border-color: var(--border);
  box-shadow: none;
}
.chapter-banner {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  position: relative;
}
.chapter-lock {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .6);
  font-size: 32px;
}
.chapter-body {
  padding: 16px;
}
.chapter-name {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}
.chapter-sub {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 10px;
}
.chapter-progress {
  margin-bottom: 8px;
}
.prog-label {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--muted);
  margin-bottom: 4px;
}
.prog-bar {
  height: 4px;
  background: #1a2540;
  border-radius: 2px;
  overflow: hidden;
}
.prog-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--green), var(--accent));
  border-radius: 2px;
  transition: width .8s;
}
.chapter-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--bg2);
  border: 1px solid var(--border);
  color: var(--muted);
}
.unlock-hint {
  font-size: 11px;
  color: var(--gold);
  margin-top: 8px;
}
</style>
