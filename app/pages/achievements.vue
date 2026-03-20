<template>
  <div class="ach-page">
    <h2>🏆 旅行成就</h2>
    <p>跨越国境、挑战极限、记录旅途，解锁你的旅行里程碑</p>

    <div class="ach-summary">
      <div class="ach-summary-count">
        <span class="ach-num">{{ unlockedCount }}</span>
        <span class="ach-total">/{{ totalCount }}</span>
      </div>
      <div class="ach-summary-label">已解锁成就</div>
      <div class="ach-summary-bar">
        <div class="ach-summary-fill" :style="{ width: (unlockedCount / totalCount * 100) + '%' }" />
      </div>
    </div>

    <div class="ach-filter">
      <button
        v-for="f in filters"
        :key="f.value"
        class="ach-tab"
        :class="{ active: currentFilter === f.value }"
        @click="currentFilter = f.value"
      >
        {{ f.icon }} {{ f.label }}
      </button>
    </div>

    <ClientOnly>
      <div class="ach-list">
        <div
          v-for="s in filteredStatuses"
          :key="s.achievement.id"
          class="ach-card"
          :class="{ unlocked: s.unlocked }"
        >
          <div class="ach-icon" :class="{ locked: !s.unlocked }">
            {{ s.unlocked ? s.achievement.icon : '🔒' }}
          </div>
          <div class="ach-info">
            <div class="ach-name">{{ s.achievement.name }}</div>
            <div class="ach-desc">{{ s.achievement.desc }}</div>
            <div class="ach-progress-wrap">
              <div class="ach-progress-bar">
                <div
                  class="ach-progress-fill"
                  :class="{ done: s.unlocked }"
                  :style="{ width: s.progress + '%' }"
                />
              </div>
              <div class="ach-progress-text">{{ s.current }}/{{ s.target }}</div>
            </div>
          </div>
        </div>
      </div>

      <template #fallback>
        <div class="ach-loading">加载中...</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const { statuses, unlockedCount, totalCount } = useAchievements()

const filters = [
  { value: 'all', icon: '🌟', label: '全部' },
  { value: 'unlocked', icon: '✅', label: '已解锁' },
  { value: 'explorer', icon: '🗺️', label: '探索' },
  { value: 'challenge', icon: '⚔️', label: '挑战' },
] as const

type FilterValue = (typeof filters)[number]['value']
const currentFilter = ref<FilterValue>('all')

const filteredStatuses = computed(() => {
  let list = statuses.value
  if (currentFilter.value === 'unlocked') {
    list = list.filter(s => s.unlocked)
  } else if (currentFilter.value !== 'all') {
    list = list.filter(s => s.achievement.category === currentFilter.value)
  }
  // Sort: unlocked first, then by progress desc
  return [...list].sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1
    return b.progress - a.progress
  })
})
</script>

<style scoped>
.ach-page {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
}
.ach-page h2 {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 6px;
}
.ach-page > p {
  color: var(--muted);
  margin-bottom: 20px;
}

/* Summary */
.ach-summary {
  background: linear-gradient(135deg, rgba(74, 158, 255, 0.1), rgba(108, 92, 231, 0.06));
  border: 1px solid var(--accent);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-bottom: 16px;
}
.ach-summary-count {
  margin-bottom: 4px;
}
.ach-num {
  font-size: 32px;
  font-weight: 800;
  color: var(--accent);
}
.ach-total {
  font-size: 16px;
  color: var(--muted);
}
.ach-summary-label {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 10px;
}
.ach-summary-bar {
  height: 6px;
  background: #1a2540;
  border-radius: 3px;
  overflow: hidden;
  max-width: 240px;
  margin: 0 auto;
}
.ach-summary-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  border-radius: 3px;
  transition: width 0.6s ease;
}

/* Filters */
.ach-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.ach-tab {
  padding: 6px 14px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: var(--bg3);
  color: var(--muted);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}
.ach-tab.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

/* Achievement list */
.ach-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ach-card {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  transition: all 0.2s;
}
.ach-card.unlocked {
  border-color: rgba(74, 158, 255, 0.3);
  background: rgba(74, 158, 255, 0.04);
}
.ach-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: var(--bg3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.ach-icon.locked {
  opacity: 0.5;
  filter: grayscale(0.8);
}
.ach-info {
  flex: 1;
  min-width: 0;
}
.ach-name {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}
.ach-desc {
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
}
.ach-progress-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}
.ach-progress-bar {
  flex: 1;
  height: 4px;
  background: #1a2540;
  border-radius: 2px;
  overflow: hidden;
}
.ach-progress-fill {
  height: 100%;
  background: var(--muted);
  border-radius: 2px;
  transition: width 0.6s ease;
}
.ach-progress-fill.done {
  background: linear-gradient(90deg, var(--accent), var(--accent2));
}
.ach-progress-text {
  font-size: 11px;
  color: var(--muted);
  flex-shrink: 0;
  min-width: 40px;
  text-align: right;
}

.ach-loading {
  text-align: center;
  color: var(--muted);
  padding: 60px 0;
  font-size: 14px;
}

/* Mobile */
@media (max-width: 640px) {
  .ach-page { padding: 16px 12px; }
  .ach-page h2 { font-size: 19px; }
  .ach-tab { padding: 8px 14px; font-size: 12px; }
  .ach-card { padding: 12px; gap: 10px; }
  .ach-icon { width: 38px; height: 38px; font-size: 20px; }
}
</style>
