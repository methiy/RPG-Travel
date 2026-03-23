<template>
  <div class="spot-selector">
    <div class="spot-header">
      <h3>📍 选择想去的景点</h3>
      <div class="spot-actions">
        <button class="spot-btn" @click="selectAll">全选</button>
        <button class="spot-btn" @click="clearAll">清除</button>
      </div>
    </div>
    <div class="spot-count">已选 {{ selectedIds.size }} / {{ tasks.length }} 个景点</div>
    <div class="spot-list">
      <label
        v-for="task in tasks"
        :key="task.id"
        class="spot-card"
        :class="{ selected: selectedIds.has(task.id), 'no-location': !task.location }"
      >
        <input
          type="checkbox"
          :checked="selectedIds.has(task.id)"
          @change="toggleTask(task.id)"
          class="spot-checkbox"
        />
        <div class="spot-info">
          <div class="spot-name">
            {{ task.name }}
            <span v-if="!task.location" class="no-loc-badge" title="无精确定位">⚠️</span>
          </div>
          <div class="spot-meta">
            <span :class="'diff-' + task.difficulty">{{ diffLabel(task.difficulty) }}</span>
            <span class="spot-exp">+{{ task.exp }} EXP</span>
          </div>
          <div v-if="task.guide?.bestTime" class="spot-time">🕐 {{ task.guide.bestTime }}</div>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  (e: 'update:selected', ids: Set<string>): void
}>()

const selectedIds = ref<Set<string>>(new Set())

function toggleTask(id: string) {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
  emit('update:selected', next)
}

function selectAll() {
  selectedIds.value = new Set(props.tasks.map(t => t.id))
  emit('update:selected', selectedIds.value)
}

function clearAll() {
  selectedIds.value = new Set()
  emit('update:selected', selectedIds.value)
}

function diffLabel(d: string): string {
  const map: Record<string, string> = { easy: '简单', medium: '中等', hard: '困难', legendary: '传奇' }
  return map[d] || d
}

// Auto-select all on mount
onMounted(() => {
  selectAll()
})
</script>

<style scoped>
.spot-selector {
  margin-top: 16px;
}
.spot-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.spot-header h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}
.spot-actions {
  display: flex;
  gap: 6px;
}
.spot-btn {
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg3);
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.spot-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}
.spot-count {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 10px;
}
.spot-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 400px;
  overflow-y: auto;
}
.spot-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.spot-card:hover {
  border-color: rgba(74, 158, 255, 0.4);
}
.spot-card.selected {
  border-color: var(--accent);
  background: rgba(74, 158, 255, 0.06);
}
.spot-card.no-location {
  opacity: 0.75;
}
.spot-checkbox {
  margin-top: 3px;
  accent-color: var(--accent);
  flex-shrink: 0;
}
.spot-info {
  flex: 1;
  min-width: 0;
}
.spot-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 4px;
}
.no-loc-badge {
  font-size: 12px;
}
.spot-meta {
  display: flex;
  gap: 8px;
  font-size: 11px;
  color: var(--muted);
  margin-top: 3px;
}
.spot-exp {
  color: var(--accent);
}
.spot-time {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}

.diff-easy { color: #00b894; }
.diff-medium { color: #fdcb6e; }
.diff-hard { color: #e17055; }
.diff-legendary { color: #d63031; }

@media (max-width: 640px) {
  .spot-list { max-height: 300px; }
  .spot-header h3 { font-size: 14px; }
}
</style>
