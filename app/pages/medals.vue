<template>
  <div class="medals-page">
    <h2>🏅 勋章收藏馆</h2>
    <p>完成旅游任务和小游戏挑战，解锁你的专属旅行勋章</p>

    <div class="medals-filter">
      <button
        v-for="f in filters"
        :key="f.value"
        class="mf-btn"
        :class="{ active: filter === f.value }"
        @click="filter = f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <ClientOnly>
      <div class="medals-grid">
        <MedalCard
          v-for="m in displayedMedals"
          :key="m.id"
          :medal="m"
          :earned="hasMedal(m.id)"
        />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ALL_MEDALS } from '~/data/medals'

const { hasMedal } = useGameState()

const filters = [
  { label: '全部', value: 'all' },
  { label: '已获得', value: 'earned' },
  { label: '未解锁', value: 'locked' },
] as const

type FilterValue = (typeof filters)[number]['value']
const filter = ref<FilterValue>('all')

const displayedMedals = computed(() => {
  const sorted = [...ALL_MEDALS].sort((a, b) => {
    const ae = hasMedal(a.id) ? 0 : 1
    const be = hasMedal(b.id) ? 0 : 1
    return ae - be
  })

  if (filter.value === 'earned') return sorted.filter(m => hasMedal(m.id))
  if (filter.value === 'locked') return sorted.filter(m => !hasMedal(m.id))
  return sorted
})
</script>

<style scoped>
.medals-page {
  padding: 24px;
}
.medals-page h2 {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 6px;
}
.medals-page > p {
  color: var(--muted);
  margin-bottom: 24px;
}
.medals-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.mf-btn {
  padding: 6px 14px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: var(--bg3);
  color: var(--muted);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}
.mf-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
.medals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
}
</style>
