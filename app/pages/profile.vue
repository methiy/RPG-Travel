<template>
  <div class="profile-page">
    <!-- 区域 1：档案头部 -->
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
        <div class="header-streak">
          🔥 连续签到 <strong>{{ checkinState.streak }}</strong> 天
        </div>
        <template #fallback>
          <div class="header-avatar">✈️</div>
          <div class="header-info">
            <div class="header-name">旅行者</div>
            <div class="header-title">初级背包客</div>
          </div>
        </template>
      </ClientOnly>
    </section>

    <!-- 区域 2：核心数据卡片 -->
    <ClientOnly>
      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ completedCount }}<span class="stat-total">/{{ totalTasks }}</span></div>
          <div class="stat-label">完成任务</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ medalCount }}<span class="stat-total">/{{ totalMedals }}</span></div>
          <div class="stat-label">获得勋章</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ countriesCount }}<span class="stat-total">/{{ totalCountries }}</span></div>
          <div class="stat-label">探索国家</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ citiesCount }}<span class="stat-total">/{{ totalCities }}</span></div>
          <div class="stat-label">探索城市</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ checkinState.total }}</div>
          <div class="stat-label">累计签到</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ checkinState.maxStreak }}</div>
          <div class="stat-label">最高连续签到</div>
        </div>
      </section>
    </ClientOnly>

    <!-- 区域 3：大洲探索进度 -->
    <ClientOnly>
      <section class="section-card">
        <h3 class="section-title">🌍 大洲探索进度</h3>
        <div class="continent-list">
          <div v-for="c in continentProgress" :key="c.id" class="continent-row">
            <div class="continent-label">
              <span>{{ c.emoji }} {{ c.name }}</span>
              <span class="continent-count">{{ c.visited }}/{{ c.total }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: (c.total > 0 ? c.visited / c.total * 100 : 0) + '%' }" />
            </div>
          </div>
        </div>
      </section>
    </ClientOnly>

    <!-- 区域 4：难度分布 -->
    <ClientOnly>
      <section class="section-card">
        <h3 class="section-title">📊 难度分布</h3>
        <div class="difficulty-list">
          <div v-for="d in difficultyStats" :key="d.key" class="difficulty-row">
            <div class="difficulty-label">{{ d.label }}</div>
            <div class="difficulty-bar-wrap">
              <div class="difficulty-bar" :style="{ width: (maxDifficulty > 0 ? d.count / maxDifficulty * 100 : 0) + '%', background: d.color }" />
            </div>
            <div class="difficulty-count">{{ d.count }}</div>
          </div>
        </div>
      </section>
    </ClientOnly>

    <!-- 快捷入口 -->
    <NuxtLink to="/achievements" class="timeline-link">
      <span class="timeline-link-icon">🏆</span>
      <span class="timeline-link-text">旅行成就</span>
      <ClientOnly><span class="ach-badge">{{ achUnlockedCount }}/{{ achTotalCount }}</span></ClientOnly>
      <span class="timeline-link-arrow">→</span>
    </NuxtLink>

    <NuxtLink to="/challenges" class="timeline-link">
      <span class="timeline-link-icon">📋</span>
      <span class="timeline-link-text">每周挑战</span>
      <ClientOnly><span class="ach-badge">{{ challengeCompleted }}/3</span></ClientOnly>
      <span class="timeline-link-arrow">→</span>
    </NuxtLink>

    <NuxtLink to="/planner" class="timeline-link">
      <span class="timeline-link-icon">🗺️</span>
      <span class="timeline-link-text">路线规划器</span>
      <span class="timeline-link-arrow">→</span>
    </NuxtLink>

    <NuxtLink to="/weather" class="timeline-link">
      <span class="timeline-link-icon">🌤️</span>
      <span class="timeline-link-text">目的地天气</span>
      <span class="timeline-link-arrow">→</span>
    </NuxtLink>

    <NuxtLink to="/community" class="timeline-link">
      <span class="timeline-link-icon">📸</span>
      <span class="timeline-link-text">照片社区</span>
      <span class="timeline-link-arrow">→</span>
    </NuxtLink>

    <!-- 区域 5：最近获得的勋章 -->
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

    <!-- 区域 6：最近打卡照片 -->
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

    <!-- 旅行时间线入口 -->
    <NuxtLink to="/timeline" class="timeline-link">
      <span class="timeline-link-icon">📅</span>
      <span class="timeline-link-text">查看旅行时间线</span>
      <span class="timeline-link-arrow">→</span>
    </NuxtLink>

    <!-- 退出登录 -->
    <ClientOnly>
      <section v-if="authState.user" class="logout-section">
        <button class="logout-btn" @click="logout">🚪 退出登录</button>
      </section>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { TASKS } from '~/data/tasks'
import { ALL_MEDALS } from '~/data/medals'
import { CONTINENTS } from '~/data/continents'
import { COUNTRIES } from '~/data/countries'

const { state: gameState, levelInfo, avatar, completedCount, medalCount, countriesCount } = useGameState()
const { authState, logout } = useAuth()
const { state: checkinState } = useDailyCheckin()
const { getPhotos } = usePhotoCheckin()
const { unlockedCount: achUnlockedCount, totalCount: achTotalCount } = useAchievements()
const { challenges: weeklyChallenges } = useWeeklyChallenges()

const challengeCompleted = computed(() => weeklyChallenges.value.filter(c => c.isComplete).length)

const allTasks = computed(() => Object.values(TASKS).flat())

// Total counts
const totalTasks = computed(() => allTasks.value.length)
const totalMedals = ALL_MEDALS.length
const totalCountries = COUNTRIES.length

// Cities count
const totalCities = computed(() => {
  return new Set(allTasks.value.map(t => t.city)).size
})

const citiesCount = computed(() => {
  return new Set(
    allTasks.value
      .filter(t => gameState.value.completed.includes(t.id))
      .map(t => t.city)
  ).size
})

// Continent progress
const continentProgress = computed(() => {
  return CONTINENTS.map(continent => {
    const countriesInContinent = COUNTRIES.filter(c => c.continentId === continent.id)
    const countryIds = countriesInContinent.map(c => c.id)
    const tasksInContinent = allTasks.value.filter(t => countryIds.includes(t.country))
    const completedCountries = new Set(
      tasksInContinent
        .filter(t => gameState.value.completed.includes(t.id))
        .map(t => t.country)
    )
    return {
      id: continent.id,
      emoji: continent.emoji,
      name: continent.name,
      visited: completedCountries.size,
      total: countriesInContinent.length,
    }
  })
})

// Difficulty stats
const difficultyStats = computed(() => {
  const levels: { key: string; label: string; color: string }[] = [
    { key: 'easy', label: '简单', color: '#00b894' },
    { key: 'medium', label: '中等', color: '#fdcb6e' },
    { key: 'hard', label: '困难', color: '#e17055' },
    { key: 'legendary', label: '传奇', color: '#d63031' },
  ]
  return levels.map(l => ({
    ...l,
    count: allTasks.value.filter(
      t => t.difficulty === l.key && gameState.value.completed.includes(t.id)
    ).length,
  }))
})

const maxDifficulty = computed(() => Math.max(...difficultyStats.value.map(d => d.count), 1))

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

/* 区域 1：档案头部 */
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
.header-info {
  text-align: center;
}
.header-name {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
}
.header-title {
  font-size: 13px;
  color: var(--accent);
  margin-top: 2px;
}
.header-exp {
  width: 100%;
  max-width: 300px;
}
.exp-label {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--muted);
  margin-bottom: 4px;
}
.exp-bar {
  height: 8px;
  background: #1a2540;
  border-radius: 4px;
  overflow: hidden;
}
.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  border-radius: 4px;
  transition: width 1s ease;
}
.header-streak {
  font-size: 14px;
  color: var(--muted);
}
.header-streak strong {
  color: #ff6b35;
  font-size: 18px;
}

/* 区域 2：核心数据卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.stat-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 8px;
  text-align: center;
}
.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: var(--accent);
}
.stat-total {
  font-size: 13px;
  font-weight: 400;
  color: var(--muted);
}
.stat-label {
  font-size: 11px;
  color: var(--muted);
  margin-top: 4px;
}

/* 通用 section card */
.section-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px 0;
}
.section-header .section-title {
  margin-bottom: 0;
}
.section-link {
  font-size: 12px;
  color: var(--accent);
  text-decoration: none;
}
.section-link:hover {
  text-decoration: underline;
}

/* 区域 3：大洲进度 */
.continent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.continent-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.continent-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text);
}
.continent-count {
  color: var(--muted);
  font-size: 12px;
}
.progress-bar {
  height: 6px;
  background: #1a2540;
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  border-radius: 3px;
  transition: width 0.6s ease;
}

/* 区域 4：难度分布 */
.difficulty-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.difficulty-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.difficulty-label {
  width: 36px;
  font-size: 12px;
  color: var(--muted);
  flex-shrink: 0;
}
.difficulty-bar-wrap {
  flex: 1;
  height: 14px;
  background: #1a2540;
  border-radius: 7px;
  overflow: hidden;
}
.difficulty-bar {
  height: 100%;
  border-radius: 7px;
  transition: width 0.6s ease;
  min-width: 2px;
}
.difficulty-count {
  width: 28px;
  text-align: right;
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  flex-shrink: 0;
}

/* 区域 5：勋章 */
.medals-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.medal-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 4px;
  background: var(--bg3);
  border-radius: 10px;
}
.medal-icon {
  font-size: 28px;
}
.medal-name {
  font-size: 11px;
  color: var(--muted);
  text-align: center;
  line-height: 1.3;
}

/* 区域 6：照片 */
.photos-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.photo-thumb {
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg3);
}
.photo-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 空状态 */
.empty-hint {
  font-size: 13px;
  color: var(--muted);
  text-align: center;
  padding: 20px 0;
}

/* 时间线入口 */
.timeline-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;
}
.timeline-link:hover {
  border-color: var(--accent);
  background: rgba(74, 158, 255, 0.04);
}
.timeline-link-icon {
  font-size: 20px;
}
.timeline-link-text {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}
.timeline-link-arrow {
  font-size: 14px;
  color: var(--accent);
}
.ach-badge {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  background: rgba(74, 158, 255, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

/* 区域 7：退出登录 */
.logout-section {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}
.logout-btn {
  width: 100%;
  max-width: 300px;
  padding: 14px 24px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: #e74c3c;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.logout-btn:hover {
  background: rgba(231, 76, 60, 0.1);
  border-color: #e74c3c;
}

/* 响应式 */
@media (max-width: 640px) {
  .profile-page {
    padding: 12px;
    gap: 12px;
  }
  .profile-header {
    padding: 20px 16px;
  }
  .header-avatar {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }
  .header-name {
    font-size: 18px;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .medals-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
