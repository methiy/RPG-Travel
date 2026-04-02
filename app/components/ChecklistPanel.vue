<script setup lang="ts">
const props = defineProps<{
  countryId: string
}>()

const countryRef = computed(() => props.countryId)
const { beforeItems, duringItems, progress, toggle, loading } = useChecklist(countryRef)
</script>

<template>
  <div class="checklist-panel">
    <div v-if="loading" class="checklist-loading">加载中...</div>

    <template v-else>
      <!-- Progress bar -->
      <div class="checklist-progress">
        <div class="progress-info">
          <span>进度: {{ progress.done }}/{{ progress.total }} 已完成</span>
          <span class="progress-pct">{{ progress.percent }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress.percent + '%' }" />
        </div>
      </div>

      <!-- Before departure -->
      <div class="checklist-section">
        <h4 class="checklist-section-title">📋 出发前准备</h4>
        <div class="checklist-items">
          <label
            v-for="item in beforeItems"
            :key="item.id"
            class="checklist-item"
            :class="{ checked: item.checked }"
          >
            <input
              type="checkbox"
              :checked="item.checked"
              class="checklist-checkbox"
              @change="toggle(item.id)"
            />
            <span class="checklist-text">{{ item.text }}</span>
          </label>
        </div>
      </div>

      <!-- During trip -->
      <div class="checklist-section">
        <h4 class="checklist-section-title">🧳 旅途中待办</h4>
        <div class="checklist-items">
          <label
            v-for="item in duringItems"
            :key="item.id"
            class="checklist-item"
            :class="{ checked: item.checked }"
          >
            <input
              type="checkbox"
              :checked="item.checked"
              class="checklist-checkbox"
              @change="toggle(item.id)"
            />
            <span class="checklist-text">{{ item.text }}</span>
          </label>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="beforeItems.length === 0 && duringItems.length === 0" class="checklist-empty">
        该国家暂无攻略数据，无法生成清单
      </div>
    </template>
  </div>
</template>

<style scoped>
.checklist-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.checklist-loading {
  text-align: center;
  color: var(--muted);
  padding: 40px 0;
}
.checklist-progress {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
}
.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 8px;
}
.progress-pct {
  font-weight: 700;
  color: var(--accent);
}
.progress-bar {
  height: 8px;
  background: #1a2540;
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent2, #7b5ea7));
  border-radius: 4px;
  transition: width 0.4s ease;
}
.checklist-section-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px 0;
}
.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.checklist-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.checklist-item:hover {
  border-color: var(--accent);
}
.checklist-item.checked {
  opacity: 0.55;
}
.checklist-item.checked .checklist-text {
  text-decoration: line-through;
}
.checklist-checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--accent, #4a9eff);
  flex-shrink: 0;
  cursor: pointer;
}
.checklist-text {
  font-size: 14px;
  color: var(--text);
  transition: opacity 0.2s;
}
.checklist-empty {
  text-align: center;
  color: var(--muted);
  padding: 40px 0;
  font-size: 14px;
}
</style>
