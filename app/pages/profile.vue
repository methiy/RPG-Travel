<template>
  <div class="profile-page">
    <!-- 区域 1：档案头部（保留原有） -->
    <section class="profile-header">
      <ClientOnly>
        <div class="header-avatar">{{ avatar }}</div>
        <div class="header-info">
          <div class="header-name">{{ authState.user?.displayName || '旅行者' }}</div>
          <div class="header-title">{{ levelInfo.title }}</div>
        </div>
        <div class="header-exp">
          <div class="exp-label">
            <span>Lv.{{ levelInfo.lv }}</span>
            <span>{{ levelInfo.cur }} / {{ levelInfo.need }} EXP</span>
          </div>
          <div class="exp-bar">
            <div class="exp-fill" :style="{ width: (levelInfo.cur / levelInfo.need * 100) + '%' }" />
          </div>
        </div>
        <NuxtLink to="/export?template=overview" class="share-btn">📤 分享我的成就</NuxtLink>
        <template #fallback>
          <div class="header-avatar">✈️</div>
          <div class="header-info">
            <div class="header-name">旅行者</div>
            <div class="header-title">初级背包客</div>
          </div>
        </template>
      </ClientOnly>
    </section>

    <!-- 统计仪表盘 -->
    <ClientOnly>
      <!-- 高光摘要 -->
      <StatsHighlightGrid :items="highlights" />

      <!-- 大洲征服进度 -->
      <StatsContinentProgress :items="continentProgress" />

      <!-- 难度分布饼图 -->
      <StatsDifficultyChart :items="difficultyDistribution" />

      <!-- 活跃日历 -->
      <StatsActivityCalendar :days="activityCalendar" />

      <!-- 里程碑成就 -->
      <StatsMilestones :items="milestones" />
    </ClientOnly>

    <!-- 最近获得的勋章 -->
    <ClientOnly>
      <section class="section-card">
        <div class="section-header">
          <h3 class="section-title">🏅 最近获得的勋章</h3>
          <NuxtLink to="/medals" class="section-link">查看全部 →</NuxtLink>
        </div>
        <div v-if="recentMedals.length" class="medals-grid">
          <div v-for="m in recentMedals" :key="m.id" class="medal-item">
            <div class="medal-icon">{{ m.icon }}</div>
            <div class="medal-name">{{ m.name }}</div>
          </div>
        </div>
        <div v-else class="empty-hint">还没有获得勋章，快去完成任务吧！</div>
      </section>
    </ClientOnly>

    <!-- 最近打卡照片 -->
    <ClientOnly>
      <section class="section-card">
        <div class="section-header">
          <h3 class="section-title">📷 最近打卡照片</h3>
          <NuxtLink to="/photos" class="section-link">查看全部 →</NuxtLink>
        </div>
        <div v-if="recentPhotos.length" class="photos-grid">
          <div v-for="p in recentPhotos" :key="p.taskId" class="photo-thumb">
            <img :src="p.dataUrl" :alt="p.taskId" />
          </div>
        </div>
        <div v-else class="empty-hint">还没有打卡照片，快去探索世界吧！</div>
      </section>
    </ClientOnly>

    <!-- 退出登录 -->
    <ClientOnly>
      <section v-if="authState.user" class="logout-section">
        <button class="logout-btn" @click="logout">🚪 退出登录</button>
      </section>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ALL_MEDALS } from '~/data/medals'

const { state: gameState, levelInfo, avatar } = useGameState()
const { authState, logout } = useAuth()
const { getPhotos } = usePhotoCheckin()
const { highlights, continentProgress, difficultyDistribution, activityCalendar, milestones } = useStats()

// Recent medals (last 6)
const recentMedals = computed(() => {
  const earned = gameState.value.medals.slice(-6).reverse()
  return earned.map(id => ALL_MEDALS.find(m => m.id === id)).filter(Boolean) as { id: string; icon: string; name: string; desc: string }[]
})

// Recent photos (last 4)
const recentPhotos = computed(() => {
  return getPhotos().slice(-4).reverse()
})
</script>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 32px;
}

/* 档案头部 */
.profile-header {
  background: linear-gradient(135deg, #0d1020, #131828);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.header-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  border: 3px solid var(--accent);
}
.header-info { text-align: center; }
.header-name { font-size: 20px; font-weight: 800; color: #fff; }
.header-title { font-size: 13px; color: var(--accent); margin-top: 2px; }
.header-exp { width: 100%; max-width: 300px; }
.exp-label { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin-bottom: 4px; }
.exp-bar { height: 8px; background: #1a2540; border-radius: 4px; overflow: hidden; }
.exp-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 4px; transition: width 1s ease; }

/* 通用 section card */
.section-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.section-title { font-size: 15px; font-weight: 700; color: #fff; margin: 0 0 12px 0; }
.section-header .section-title { margin-bottom: 0; }
.section-link { font-size: 12px; color: var(--accent); text-decoration: none; }
.section-link:hover { text-decoration: underline; }

/* 勋章 */
.medals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.medal-item { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 4px; background: var(--bg3); border-radius: 10px; }
.medal-icon { font-size: 28px; }
.medal-name { font-size: 11px; color: var(--muted); text-align: center; line-height: 1.3; }

/* 照片 */
.photos-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.photo-thumb { aspect-ratio: 1; border-radius: 10px; overflow: hidden; background: var(--bg3); }
.photo-thumb img { width: 100%; height: 100%; object-fit: cover; }

/* 空状态 */
.empty-hint { font-size: 13px; color: var(--muted); text-align: center; padding: 20px 0; }

/* 退出登录 */
.logout-section { display: flex; justify-content: center; padding: 8px 0; }
.logout-btn { width: 100%; max-width: 300px; padding: 14px 24px; background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; color: #e74c3c; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.logout-btn:hover { background: rgba(231, 76, 60, 0.1); border-color: #e74c3c; }

/* 分享按钮 */
.share-btn { display: inline-block; margin-top: 12px; padding: 10px 24px; border-radius: 12px; background: linear-gradient(135deg, #4a9eff, #7b5ea7); color: #fff; text-decoration: none; font-size: 14px; font-weight: 600; transition: transform 0.2s; }
.share-btn:hover { transform: translateY(-1px); }

/* 响应式 */
@media (max-width: 640px) {
  .profile-page { padding: 12px; gap: 12px; }
  .profile-header { padding: 20px 16px; }
  .header-avatar { width: 60px; height: 60px; font-size: 28px; }
  .header-name { font-size: 18px; }
}
</style>
