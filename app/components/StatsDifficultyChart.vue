<script setup lang="ts">
const props = defineProps<{
  items: Array<{
    key: string
    label: string
    color: string
    count: number
    percent: number
  }>
}>()

const total = computed(() => props.items.reduce((s, d) => s + d.count, 0))

const conicGradient = computed(() => {
  if (total.value === 0) return 'conic-gradient(#1a2540 0% 100%)'
  let acc = 0
  const stops: string[] = []
  for (const d of props.items) {
    const start = acc
    acc += d.percent
    stops.push(`${d.color} ${start}% ${acc}%`)
  }
  if (acc < 100) {
    const last = props.items[props.items.length - 1]
    stops.push(`${last.color} ${acc}% 100%`)
  }
  return `conic-gradient(${stops.join(', ')})`
})
</script>

<template>
  <div class="section-card">
    <h3 class="section-title">📊 难度分布</h3>
    <div class="chart-wrap">
      <div class="donut" :style="{ background: conicGradient }">
        <div class="donut-hole">
          <div class="donut-total">{{ total }}</div>
          <div class="donut-label">已完成</div>
        </div>
      </div>
      <div class="legend">
        <div v-for="d in items" :key="d.key" class="legend-item">
          <span class="legend-dot" :style="{ background: d.color }" />
          <span class="legend-name">{{ d.label }}</span>
          <span class="legend-count">{{ d.count }}</span>
          <span class="legend-pct">{{ d.percent }}%</span>
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
  margin: 0 0 16px 0;
}
.chart-wrap {
  display: flex;
  align-items: center;
  gap: 24px;
}
.donut {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.donut-hole {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--bg2, #131828);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.donut-total {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
}
.donut-label {
  font-size: 11px;
  color: var(--muted, #8890a8);
}
.legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.legend-name {
  color: var(--text, #e8eaf6);
  flex: 1;
}
.legend-count {
  font-weight: 700;
  color: var(--text, #e8eaf6);
}
.legend-pct {
  color: var(--muted, #8890a8);
  width: 36px;
  text-align: right;
}
@media (max-width: 400px) {
  .chart-wrap { flex-direction: column; }
  .donut { width: 120px; height: 120px; }
  .donut-hole { width: 68px; height: 68px; }
}
</style>
