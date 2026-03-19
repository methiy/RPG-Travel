<script setup lang="ts">
import type { Task } from '~/types'

const props = defineProps<{
  task: Task
  done: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const diffLabels: Record<string, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
  legendary: '传说',
}
</script>

<template>
  <div
    class="task-card"
    :class="{ done }"
    @click="emit('click')"
  >
    <div class="task-top">
      <div class="task-title">{{ task.name }}</div>
      <span class="diff-badge" :class="`d-${task.difficulty === 'legendary' ? 'legend' : task.difficulty}`">
        {{ diffLabels[task.difficulty] }}
      </span>
    </div>
    <div class="task-loc">📍 {{ task.city }} · {{ task.country }}</div>
    <div class="task-rewards">
      <span class="rwd rwd-exp">⚡ +{{ task.exp }}</span>
      <span class="rwd rwd-medal">🏅 {{ task.medal.name }}</span>
    </div>
    <div v-if="done" class="task-done-icon">✅ 已完成</div>
  </div>
</template>

<style scoped>
.task-card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px;
  cursor: pointer;
  transition: all 0.3s;
}
.task-card:hover {
  border-color: var(--accent);
  box-shadow: 0 6px 20px rgba(74, 158, 255, 0.15);
  transform: translateY(-2px);
}
.task-card.done {
  border-color: var(--green);
  opacity: 0.8;
}
.task-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}
.task-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  flex: 1;
  margin-right: 8px;
}
.diff-badge {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 10px;
  font-weight: 700;
  flex-shrink: 0;
}
.d-easy {
  background: #0d2d0d;
  color: var(--green);
  border: 1px solid var(--green);
}
.d-medium {
  background: #2d1f00;
  color: #ffaa33;
  border: 1px solid #ffaa33;
}
.d-hard {
  background: #2d0d0d;
  color: var(--red);
  border: 1px solid var(--red);
}
.d-legend {
  background: #1a0a2a;
  color: #cc66ff;
  border: 1px solid #cc66ff;
}
.task-loc {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 10px;
}
.task-rewards {
  display: flex;
  gap: 8px;
}
.rwd {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--bg2);
}
.rwd-exp {
  color: var(--accent);
}
.rwd-medal {
  color: var(--gold);
}
.task-done-icon {
  font-size: 20px;
  margin-top: 8px;
}
</style>
