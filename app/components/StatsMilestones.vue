<script setup lang="ts">
defineProps<{
  items: Array<{
    id: string
    icon: string
    name: string
    condition: string
    unlocked: boolean
  }>
}>()
</script>

<template>
  <div class="section-card">
    <h3 class="section-title">⭐ 里程碑成就</h3>
    <div class="milestone-grid">
      <div
        v-for="m in items"
        :key="m.id"
        class="milestone-item"
        :class="{ unlocked: m.unlocked }"
      >
        <div class="milestone-icon">{{ m.unlocked ? m.icon : '🔒' }}</div>
        <div class="milestone-info">
          <div class="milestone-name">{{ m.name }}</div>
          <div class="milestone-cond">{{ m.condition }}</div>
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
.milestone-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.milestone-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border, #1e2640);
  background: var(--bg3, #0e1424);
  opacity: 0.45;
  filter: grayscale(0.8);
  transition: all 0.3s;
}
.milestone-item.unlocked {
  opacity: 1;
  filter: none;
  border-color: #ffd70066;
  background: #ffd70008;
}
.milestone-icon {
  font-size: 28px;
  flex-shrink: 0;
}
.milestone-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text, #e8eaf6);
}
.milestone-cond {
  font-size: 11px;
  color: var(--muted, #8890a8);
  margin-top: 2px;
}
@media (max-width: 480px) {
  .milestone-grid { grid-template-columns: 1fr; }
}
</style>
