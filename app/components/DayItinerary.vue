<template>
  <div class="day-itinerary" :style="{ '--day-color': day.color }">
    <div class="day-header">
      <span class="day-badge" :style="{ background: day.color + '20', color: day.color }">
        Day {{ day.dayNum }}
      </span>
      <span class="day-exp">{{ day.totalExp }} EXP</span>
    </div>

    <!-- Task list -->
    <div class="day-tasks">
      <div
        v-for="(task, idx) in day.tasks"
        :key="task.id"
        class="day-task"
        :class="{ completed: isCompleted(task.id) }"
      >
        <div class="day-task-num" :style="{ background: day.color, color: '#fff' }">
          {{ idx + 1 }}
        </div>
        <div class="day-task-body">
          <div class="day-task-name">{{ task.name }}</div>
          <div class="day-task-meta">
            <span :class="'diff-' + task.difficulty">{{ diffLabel(task.difficulty) }}</span>
            <span>+{{ task.exp }} EXP</span>
            <span v-if="!task.location" class="no-loc">⚠️ 无定位</span>
          </div>
        </div>
        <div v-if="isCompleted(task.id)" class="day-task-done">✅</div>
      </div>
    </div>

    <!-- Guide sections (collapsible) -->
    <div class="day-guide" v-if="hasGuide">
      <!-- Best times -->
      <div v-if="day.bestTimes.length" class="guide-section">
        <div class="guide-title">🕐 最佳时间</div>
        <ul>
          <li v-for="(t, i) in day.bestTimes" :key="i">{{ t }}</li>
        </ul>
      </div>

      <!-- Food -->
      <div v-if="day.foodSpots.length" class="guide-section">
        <div class="guide-title">🍜 美食推荐</div>
        <ul>
          <li v-for="(f, i) in day.foodSpots.slice(0, 4)" :key="i">{{ f }}</li>
        </ul>
      </div>

      <!-- Transport -->
      <div v-if="day.transport.length" class="guide-section">
        <div class="guide-title">🚇 交通指南</div>
        <ul>
          <li v-for="(t, i) in day.transport.slice(0, 3)" :key="i">{{ t }}</li>
        </ul>
      </div>

      <!-- Budget -->
      <div v-if="day.budget.length" class="guide-section">
        <div class="guide-title">💰 预算参考</div>
        <ul>
          <li v-for="(b, i) in day.budget" :key="i">{{ b }}</li>
        </ul>
      </div>

      <!-- Tips -->
      <div v-if="day.tips.length" class="guide-section">
        <div class="guide-title">💡 实用贴士</div>
        <ul>
          <li v-for="(t, i) in day.tips.slice(0, 4)" :key="i">{{ t }}</li>
        </ul>
      </div>

      <!-- Local tips -->
      <div v-if="day.localTips.length" class="guide-section">
        <div class="guide-title">🏮 本地秘籍</div>
        <ul>
          <li v-for="(t, i) in day.localTips.slice(0, 3)" :key="i">{{ t }}</li>
        </ul>
      </div>

      <!-- Open hours -->
      <div v-if="day.openHours.length" class="guide-section">
        <div class="guide-title">🕐 开放时间</div>
        <ul>
          <li v-for="(h, i) in day.openHours" :key="i">{{ h }}</li>
        </ul>
      </div>

      <!-- Photo tips -->
      <div v-if="day.photoTips.length" class="guide-section">
        <div class="guide-title">📸 拍照贴士</div>
        <ul>
          <li v-for="(p, i) in day.photoTips.slice(0, 4)" :key="i">{{ p }}</li>
        </ul>
      </div>

      <!-- Safety notes -->
      <div v-if="day.safetyNotes.length" class="guide-section">
        <div class="guide-title">🛡️ 安全提示</div>
        <ul>
          <li v-for="(s, i) in day.safetyNotes.slice(0, 3)" :key="i">{{ s }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ItineraryDay } from '~/types'

const props = defineProps<{
  day: ItineraryDay
}>()

const { isTaskCompleted } = useGameState()

function isCompleted(id: string) {
  return isTaskCompleted(id)
}

const hasGuide = computed(() =>
  props.day.bestTimes.length > 0 ||
  props.day.foodSpots.length > 0 ||
  props.day.transport.length > 0 ||
  props.day.budget.length > 0 ||
  props.day.tips.length > 0 ||
  props.day.localTips.length > 0 ||
  props.day.openHours.length > 0 ||
  props.day.safetyNotes.length > 0 ||
  props.day.photoTips.length > 0
)

function diffLabel(d: string): string {
  const map: Record<string, string> = { easy: '简单', medium: '中等', hard: '困难', legendary: '传奇' }
  return map[d] || d
}
</script>

<style scoped>
.day-itinerary {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  border-left: 3px solid var(--day-color);
}
.day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.day-badge {
  font-size: 13px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 8px;
}
.day-exp {
  font-size: 13px;
  font-weight: 700;
  color: var(--day-color);
}

/* Tasks */
.day-tasks {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.day-task {
  display: flex;
  gap: 10px;
  padding: 8px 10px;
  background: var(--bg3);
  border-radius: 8px;
  align-items: flex-start;
}
.day-task.completed {
  opacity: 0.55;
}
.day-task-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}
.day-task-body {
  flex: 1;
  min-width: 0;
}
.day-task-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}
.day-task-meta {
  display: flex;
  gap: 8px;
  font-size: 11px;
  color: var(--muted);
  margin-top: 3px;
}
.no-loc {
  color: #fdcb6e;
}
.day-task-done {
  font-size: 14px;
  flex-shrink: 0;
}

/* Guide */
.day-guide {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.guide-section {
  font-size: 12px;
}
.guide-title {
  font-weight: 700;
  color: var(--day-color);
  margin-bottom: 4px;
}
.guide-section ul {
  margin: 0;
  padding-left: 16px;
}
.guide-section li {
  color: var(--muted);
  line-height: 1.6;
}

.diff-easy { color: #00b894; }
.diff-medium { color: #fdcb6e; }
.diff-hard { color: #e17055; }
.diff-legendary { color: #d63031; }

@media (max-width: 640px) {
  .day-itinerary { padding: 12px; }
  .day-task { padding: 6px 8px; }
}
</style>
