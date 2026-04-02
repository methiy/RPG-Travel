<script setup lang="ts">
defineProps<{
  items: Array<{
    icon: string
    value: number
    label: string
    color: string
  }>
}>()
</script>

<template>
  <div class="highlight-grid">
    <div
      v-for="(item, i) in items"
      :key="item.label"
      class="highlight-card"
      :style="{ '--accent-color': item.color, animationDelay: `${i * 100}ms` }"
    >
      <span class="highlight-bg-icon">{{ item.icon }}</span>
      <div class="highlight-value">{{ item.value.toLocaleString() }}</div>
      <div class="highlight-label">{{ item.icon }} {{ item.value.toLocaleString() }} {{ item.label }}</div>
    </div>
  </div>
</template>

<style scoped>
.highlight-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.highlight-card {
  position: relative;
  overflow: hidden;
  background: var(--bg2, #131828);
  border: 1px solid var(--border, #1e2640);
  border-left: 3px solid var(--accent-color);
  border-radius: 14px;
  padding: 20px 16px;
  animation: fadeInUp 0.5s ease both;
}
.highlight-bg-icon {
  position: absolute;
  right: -4px;
  bottom: -8px;
  font-size: 56px;
  opacity: 0.08;
  pointer-events: none;
}
.highlight-value {
  font-size: 32px;
  font-weight: 800;
  color: var(--accent-color);
  line-height: 1;
  margin-bottom: 6px;
}
.highlight-label {
  font-size: 13px;
  color: var(--muted, #8890a8);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
