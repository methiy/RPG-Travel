<script setup lang="ts">
const props = defineProps<{
  days: Array<{
    date: string
    count: number
    level: number
  }>
}>()

const levelColors = ['#0e1424', '#1a3a5c', '#2563eb', '#4a9eff']

const weeksCount = computed(() => Math.ceil(props.days.length / 7))

const monthLabels = computed(() => {
  const labels: Array<{ text: string; col: number }> = []
  let lastMonth = ''
  for (let i = 0; i < props.days.length; i++) {
    const d = props.days[i]
    const month = d.date.slice(0, 7)
    if (month !== lastMonth) {
      lastMonth = month
      const col = Math.floor(i / 7)
      const monthNum = parseInt(d.date.slice(5, 7))
      const monthNames = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      labels.push({ text: monthNames[monthNum], col })
    }
  }
  return labels
})

const totalActive = computed(() => props.days.filter(d => d.count > 0).length)
</script>

<template>
  <div class="section-card">
    <h3 class="section-title">📅 活跃日历 <span class="active-count">{{ totalActive }} 天活跃</span></h3>

    <div class="month-labels" :style="{ gridTemplateColumns: `repeat(${weeksCount}, 14px)` }">
      <span
        v-for="ml in monthLabels"
        :key="ml.col"
        class="month-label"
        :style="{ gridColumn: ml.col + 1 }"
      >{{ ml.text }}</span>
    </div>

    <div
      class="calendar-grid"
      :style="{ gridTemplateColumns: `repeat(${weeksCount}, 14px)` }"
    >
      <div
        v-for="(day, i) in days"
        :key="day.date"
        class="cal-cell"
        :style="{ background: levelColors[day.level], gridRow: (i % 7) + 1, gridColumn: Math.floor(i / 7) + 1 }"
        :title="`${day.date}: ${day.count} 个任务`"
      />
    </div>

    <div class="cal-legend">
      <span class="cal-legend-text">少</span>
      <div
        v-for="(color, i) in levelColors"
        :key="i"
        class="cal-legend-cell"
        :style="{ background: color }"
      />
      <span class="cal-legend-text">多</span>
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
  margin: 0 0 10px 0;
}
.active-count {
  font-size: 12px;
  font-weight: 400;
  color: var(--muted, #8890a8);
  margin-left: 8px;
}
.month-labels {
  display: grid;
  grid-template-rows: 1fr;
  gap: 2px;
  margin-bottom: 4px;
  overflow-x: auto;
}
.month-label {
  font-size: 10px;
  color: var(--muted, #8890a8);
  white-space: nowrap;
}
.calendar-grid {
  display: grid;
  grid-template-rows: repeat(7, 14px);
  grid-auto-flow: column;
  gap: 2px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.cal-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
.cal-legend {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
  margin-top: 8px;
}
.cal-legend-text {
  font-size: 10px;
  color: var(--muted, #8890a8);
}
.cal-legend-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
</style>
