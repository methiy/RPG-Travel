<template>
  <div class="lb-page">
    <h2>🏆 全球排行榜</h2>
    <p>与全球旅行者一较高下，看看你的排名</p>

    <div class="lb-tabs">
      <button
        v-for="t in tabs"
        :key="t.value"
        class="lb-tab"
        :class="{ active: currentTab === t.value }"
        @click="switchTab(t.value)"
      >
        {{ t.icon }} {{ t.label }}
      </button>
    </div>

    <ClientOnly>
      <!-- 当前用户排名卡片 -->
      <div v-if="currentUserRank" class="my-rank-card">
        <div class="my-rank-pos">
          <span class="rank-badge self">{{ currentUserRank.rank }}</span>
        </div>
        <div class="my-rank-info">
          <div class="my-rank-name">{{ currentUserRank.displayName }} <span class="my-rank-you">（你）</span></div>
          <div class="my-rank-stats">
            {{ currentUserRank.exp }} EXP · {{ currentUserRank.completedCount }} 任务 · {{ currentUserRank.medalCount }} 勋章
          </div>
        </div>
        <div class="my-rank-value">{{ getDisplayValue(currentUserRank) }}</div>
      </div>

      <!-- Loading -->
      <div v-if="state.loading" class="lb-loading">
        <div v-for="i in 5" :key="i" class="lb-skeleton" />
      </div>

      <!-- 排行榜列表 -->
      <div v-else class="lb-list">
        <div
          v-for="entry in state.entries"
          :key="entry.userId"
          class="lb-row"
          :class="{ 'is-self': entry.userId === state.currentUserId }"
        >
          <div class="lb-rank">
            <span v-if="entry.rank === 1" class="rank-medal">🥇</span>
            <span v-else-if="entry.rank === 2" class="rank-medal">🥈</span>
            <span v-else-if="entry.rank === 3" class="rank-medal">🥉</span>
            <span v-else class="rank-num">{{ entry.rank }}</span>
          </div>
          <div class="lb-info">
            <div class="lb-name">
              {{ entry.displayName }}
              <span v-if="entry.userId === state.currentUserId" class="lb-you">你</span>
            </div>
            <div class="lb-sub">
              {{ entry.exp }} EXP · {{ entry.completedCount }} 任务 · {{ entry.medalCount }} 勋章
            </div>
          </div>
          <div class="lb-value">{{ getDisplayValue(entry) }}</div>
        </div>

        <div v-if="!state.loading && state.entries.length === 0" class="lb-empty">
          还没有旅行者上榜，快去完成任务成为第一名吧！
        </div>
      </div>

      <template #fallback>
        <div class="lb-loading">
          <div v-for="i in 5" :key="i" class="lb-skeleton" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const { state, fetchLeaderboard, currentUserRank } = useLeaderboard()

type SortBy = 'exp' | 'completed' | 'medals'

const tabs = [
  { value: 'exp' as SortBy, icon: '⚡', label: '经验值' },
  { value: 'completed' as SortBy, icon: '✅', label: '任务数' },
  { value: 'medals' as SortBy, icon: '🏅', label: '勋章数' },
]

const currentTab = ref<SortBy>('exp')

function switchTab(tab: SortBy) {
  currentTab.value = tab
  fetchLeaderboard(tab)
}

function getDisplayValue(entry: { exp: number; completedCount: number; medalCount: number }) {
  switch (currentTab.value) {
    case 'completed': return entry.completedCount
    case 'medals': return entry.medalCount
    default: return entry.exp
  }
}

onMounted(() => {
  fetchLeaderboard('exp')
})
</script>

<style scoped>
.lb-page {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
}
.lb-page h2 {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 6px;
}
.lb-page > p {
  color: var(--muted);
  margin-bottom: 20px;
}

/* Tabs */
.lb-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.lb-tab {
  padding: 8px 16px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: var(--bg3);
  color: var(--muted);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.lb-tab.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

/* My rank card */
.my-rank-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, rgba(74, 158, 255, 0.12), rgba(108, 92, 231, 0.08));
  border: 1px solid var(--accent);
  border-radius: 12px;
  margin-bottom: 16px;
}
.rank-badge.self {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-weight: 800;
  font-size: 15px;
}
.my-rank-info {
  flex: 1;
  min-width: 0;
}
.my-rank-name {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}
.my-rank-you {
  font-size: 12px;
  color: var(--accent);
  font-weight: 400;
}
.my-rank-stats {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}
.my-rank-value {
  font-size: 20px;
  font-weight: 800;
  color: var(--accent);
  flex-shrink: 0;
}

/* List */
.lb-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.lb-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  transition: background 0.2s;
}
.lb-row.is-self {
  background: rgba(74, 158, 255, 0.06);
  border-color: var(--accent);
}
.lb-rank {
  width: 36px;
  text-align: center;
  flex-shrink: 0;
}
.rank-medal {
  font-size: 22px;
}
.rank-num {
  font-size: 15px;
  font-weight: 700;
  color: var(--muted);
}
.lb-info {
  flex: 1;
  min-width: 0;
}
.lb-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lb-you {
  display: inline-block;
  font-size: 10px;
  background: var(--accent);
  color: #fff;
  padding: 1px 6px;
  border-radius: 8px;
  margin-left: 6px;
  vertical-align: middle;
  font-weight: 400;
}
.lb-sub {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}
.lb-value {
  font-size: 18px;
  font-weight: 800;
  color: var(--accent);
  flex-shrink: 0;
}
.lb-empty {
  text-align: center;
  color: var(--muted);
  font-size: 13px;
  padding: 40px 0;
}

/* Loading skeleton */
.lb-loading {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.lb-skeleton {
  height: 56px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Mobile */
@media (max-width: 640px) {
  .lb-page { padding: 16px 12px; }
  .lb-page h2 { font-size: 19px; }
  .lb-tab { padding: 8px 14px; font-size: 12px; }
  .lb-row { padding: 10px 12px; gap: 10px; }
  .lb-name { font-size: 13px; }
  .lb-value { font-size: 16px; }
  .my-rank-card { padding: 12px; gap: 10px; }
  .my-rank-value { font-size: 18px; }
}
</style>
