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
