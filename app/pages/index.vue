<script setup lang="ts">
import { CONTINENTS } from '~/data/continents'
import { COUNTRIES } from '~/data/countries'

const { state } = useGameState()

function isContLocked(cont: typeof CONTINENTS[number]) {
  return state.value.exp < cont.unlockExp
}

function getCountries(continentId: string) {
  return COUNTRIES.filter(c => c.continentId === continentId)
}
</script>

<template>
  <div class="world-page">
    <div class="world-header">
      <h2>🌍 世界地图</h2>
      <p>选择一个国家开始你的旅行冒险——完成任务积累EXP解锁更多大洲</p>
    </div>
    <ClientOnly>
      <DailyCheckin />
      <div v-for="cont in CONTINENTS" :key="cont.id" class="continent-section">
        <div class="continent-header" :class="{ locked: isContLocked(cont) }">
          <div class="cont-info">
            <div class="cont-title">{{ cont.emoji }} {{ cont.name }}</div>
            <div class="cont-desc">{{ cont.description }}</div>
          </div>
          <div v-if="isContLocked(cont)" class="cont-lock">🔒 需要 {{ cont.unlockExp }} EXP 解锁</div>
        </div>
        <div class="countries-grid">
          <CountryCard
            v-for="country in getCountries(cont.id)"
            :key="country.id"
            :country="country"
            :locked="isContLocked(cont)"
          />
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.world-page {
  padding: 24px;
}
.world-header {
  margin-bottom: 24px;
}
.world-header h2 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 6px;
}
.world-header p {
  color: var(--muted);
}
.continent-section {
  margin-bottom: 32px;
}
.continent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--accent);
  padding: 12px 0;
  margin-bottom: 16px;
}
.continent-header.locked {
  opacity: 0.5;
  border-bottom-color: var(--border);
}
.cont-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.cont-title {
  font-size: 20px;
  font-weight: 800;
}
.cont-desc {
  font-size: 13px;
  color: var(--muted);
}
.cont-lock {
  font-size: 12px;
  color: var(--gold);
  white-space: nowrap;
}
.countries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

@media (max-width: 640px) {
  .world-page { padding: 16px 12px; }
  .world-header { margin-bottom: 16px; }
  .world-header h2 { font-size: 20px; }
  .continent-header { flex-direction: column; align-items: flex-start; gap: 4px; }
  .cont-title { font-size: 17px; }
  .countries-grid { grid-template-columns: 1fr; gap: 12px; }
}
</style>
