<template>
  <div class="topbar">
    <div class="logo">🌍 旅行者传说</div>
    <ClientOnly>
      <div class="player-wrap">
        <div class="avatar">{{ avatar }}</div>
        <div>
          <div class="player-name">旅行者</div>
          <div class="player-title">{{ levelInfo.title }}</div>
        </div>
      </div>
      <div class="exp-wrap">
        <div class="exp-row">
          <span>Lv.{{ levelInfo.lv }}</span>
          <span>{{ levelInfo.cur }}/{{ levelInfo.need }} EXP</span>
        </div>
        <div class="exp-bar">
          <div class="exp-fill" :style="{ width: (levelInfo.cur / levelInfo.need * 100) + '%' }" />
        </div>
      </div>
      <div class="stats-row">
        <div class="stat">
          <div class="stat-v">{{ completedCount }}</div>
          <div class="stat-l">任务</div>
        </div>
        <div class="stat">
          <div class="stat-v">{{ medalCount }}</div>
          <div class="stat-l">勋章</div>
        </div>
        <div class="stat">
          <div class="stat-v">{{ countriesCount }}</div>
          <div class="stat-l">国家</div>
        </div>
        <div class="stat">
          <div class="stat-v">{{ state.exp }}</div>
          <div class="stat-l">总EXP</div>
        </div>
      </div>
      <template #fallback>
        <div class="player-wrap">
          <div class="avatar">✈️</div>
          <div>
            <div class="player-name skeleton-bar" style="width:60px;height:13px" />
            <div class="player-title skeleton-bar" style="width:80px;height:11px;margin-top:4px" />
          </div>
        </div>
        <div class="exp-wrap">
          <div class="exp-row">
            <span>Lv.1</span>
            <span>0/100 EXP</span>
          </div>
          <div class="exp-bar">
            <div class="exp-fill" style="width:0%" />
          </div>
        </div>
        <div class="stats-row">
          <div class="stat"><div class="stat-v">0</div><div class="stat-l">任务</div></div>
          <div class="stat"><div class="stat-v">0</div><div class="stat-l">勋章</div></div>
          <div class="stat"><div class="stat-v">0</div><div class="stat-l">国家</div></div>
          <div class="stat"><div class="stat-v">0</div><div class="stat-l">总EXP</div></div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const { levelInfo, avatar, completedCount, medalCount, countriesCount, state } = useGameState()
</script>

<style scoped>
.topbar {
  background: linear-gradient(135deg, #0d1020, #131828);
  border-bottom: 1px solid var(--border);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}
.logo {
  font-size: 18px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
}
.player-wrap { display: flex; align-items: center; gap: 10px; }
.avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; border: 2px solid var(--accent); flex-shrink: 0;
}
.player-name { font-size: 13px; font-weight: 700; color: #fff; }
.player-title { font-size: 11px; color: var(--accent); margin-top: 1px; }
.exp-wrap { flex: 1; min-width: 160px; }
.exp-row { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin-bottom: 4px; }
.exp-bar { height: 6px; background: #1a2540; border-radius: 3px; overflow: hidden; }
.exp-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 3px; transition: width 1s ease; }
.stats-row { display: flex; gap: 10px; flex-wrap: wrap; }
.stat { background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px; text-align: center; }
.stat-v { font-size: 18px; font-weight: 700; color: var(--accent); }
.stat-l { font-size: 10px; color: var(--muted); margin-top: 1px; }
.skeleton-bar { background: var(--bg3); border-radius: 4px; }
</style>
