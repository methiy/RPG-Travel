<script setup lang="ts">
import type { ShareTemplate, OverviewSnapshot, TripSnapshot, MedalsSnapshot } from '~/types'

definePageMeta({
  layout: false,
})

const route = useRoute()
const shareId = route.params.id as string

const { data: share, error } = await useFetch(`/api/share/${shareId}`)

// OG meta tags for social sharing
if (share.value) {
  const snap = share.value.snapshot as Record<string, unknown>
  const name = (snap.displayName as string) || '旅行者'
  const templateNames: Record<string, string> = {
    overview: '旅行成就',
    trip: '旅行记录',
    medals: '勋章收藏',
  }
  const title = `${name}的${templateNames[share.value.template] || '旅行'} - 旅行者传说`
  const description = share.value.template === 'overview'
    ? `Lv.${snap.level} ${snap.title} | ${snap.countriesCount}个国家 | ${snap.completedCount}个任务`
    : share.value.template === 'trip'
      ? `${snap.countryEmoji} ${snap.countryName} | ${snap.completedTasks}/${snap.totalTasks}任务完成`
      : `${(snap.earnedMedals as Array<unknown>)?.length || 0}枚勋章已收集`

  useHead({
    title,
    meta: [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
  })
}
</script>

<template>
  <div class="share-page">
    <!-- Error state -->
    <div v-if="error" class="error-state">
      <h1>😕 未找到</h1>
      <p>这个分享链接可能已失效</p>
      <NuxtLink to="/" class="home-btn">去首页看看</NuxtLink>
    </div>

    <!-- Share content -->
    <div v-else-if="share" class="share-content">
      <!-- Overview Template -->
      <div v-if="share.template === 'overview'" class="card overview-card">
        <h1 class="card-title">🌍 旅行者传说</h1>
        <div class="divider" />
        <div class="user-info">
          <span class="user-avatar">{{ (share.snapshot as OverviewSnapshot).avatar }}</span>
          <h2 class="user-name">{{ (share.snapshot as OverviewSnapshot).displayName }}</h2>
          <p class="user-level">Lv.{{ (share.snapshot as OverviewSnapshot).level }} {{ (share.snapshot as OverviewSnapshot).title }}</p>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">{{ (share.snapshot as OverviewSnapshot).countriesCount }}</span>
            <span class="stat-label">国家</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ (share.snapshot as OverviewSnapshot).citiesCount }}</span>
            <span class="stat-label">城市</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ (share.snapshot as OverviewSnapshot).completedCount }}</span>
            <span class="stat-label">任务</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ (share.snapshot as OverviewSnapshot).medalCount }}</span>
            <span class="stat-label">⭐ 勋章</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ (share.snapshot as OverviewSnapshot).achievementCount }}</span>
            <span class="stat-label">🏆 成就</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ (share.snapshot as OverviewSnapshot).exp.toLocaleString() }}</span>
            <span class="stat-label">EXP</span>
          </div>
        </div>
        <div class="title-badge">「{{ (share.snapshot as OverviewSnapshot).title }}」</div>
        <div class="exp-bar-wrap">
          <div class="exp-bar">
            <div class="exp-fill" :style="{ width: Math.min((share.snapshot as OverviewSnapshot).exp / 10000 * 100, 100) + '%' }" />
          </div>
          <p class="exp-text">累计 {{ (share.snapshot as OverviewSnapshot).exp.toLocaleString() }} EXP</p>
        </div>
      </div>

      <!-- Trip Template -->
      <div v-else-if="share.template === 'trip'" class="card trip-card">
        <h1 class="card-title">{{ (share.snapshot as TripSnapshot).countryEmoji }} {{ (share.snapshot as TripSnapshot).countryName }}探险记</h1>
        <div class="divider" />
        <div v-if="(share.snapshot as TripSnapshot).photos.length" class="photo-grid">
          <div v-for="(photo, i) in (share.snapshot as TripSnapshot).photos" :key="i" class="photo-item">
            <img :src="photo" alt="travel photo" />
          </div>
        </div>
        <p class="cities-text">{{ (share.snapshot as TripSnapshot).cities.join(' · ') }}</p>
        <p class="progress-text">✅ {{ (share.snapshot as TripSnapshot).completedTasks }}/{{ (share.snapshot as TripSnapshot).totalTasks }} 任务完成</p>
        <div v-if="(share.snapshot as TripSnapshot).medals.length" class="medals-row">
          <span v-for="m in (share.snapshot as TripSnapshot).medals.slice(0, 5)" :key="m.name" class="medal-tag">
            {{ m.icon }} {{ m.name }}
          </span>
        </div>
        <p class="user-footer">旅行者: {{ (share.snapshot as TripSnapshot).displayName }} Lv.{{ (share.snapshot as TripSnapshot).level }}</p>
      </div>

      <!-- Medals Template -->
      <div v-else-if="share.template === 'medals'" class="card medals-card">
        <h1 class="card-title">🏅 勋章收藏</h1>
        <div class="divider" />
        <div class="medal-grid">
          <div v-for="m in (share.snapshot as MedalsSnapshot).earnedMedals.slice(0, 12)" :key="m.name" class="medal-cell">
            <span class="medal-icon">{{ m.icon }}</span>
            <span class="medal-name">{{ m.name }}</span>
          </div>
        </div>
        <p class="medal-progress">{{ (share.snapshot as MedalsSnapshot).earnedMedals.length }} / {{ (share.snapshot as MedalsSnapshot).totalMedals }} 已收集</p>
        <div class="medal-bar">
          <div class="medal-fill" :style="{ width: ((share.snapshot as MedalsSnapshot).earnedMedals.length / Math.max((share.snapshot as MedalsSnapshot).totalMedals, 1) * 100) + '%' }" />
        </div>
        <p v-if="(share.snapshot as MedalsSnapshot).rarestMedal" class="rarest">
          最稀有: {{ (share.snapshot as MedalsSnapshot).rarestMedal!.icon }} 「{{ (share.snapshot as MedalsSnapshot).rarestMedal!.name }}」
        </p>
        <p class="user-footer">旅行者: {{ (share.snapshot as MedalsSnapshot).displayName }} Lv.{{ (share.snapshot as MedalsSnapshot).level }}</p>
      </div>

      <!-- CTA -->
      <div class="cta">
        <NuxtLink to="/register" class="cta-btn">🌍 来旅行者传说开始你的冒险</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.share-page {
  min-height: 100vh;
  background: #07090f;
  color: #e8eaf6;
  display: flex;
  justify-content: center;
  padding: 24px 16px;
}
.error-state {
  text-align: center;
  padding-top: 120px;
}
.error-state h1 { font-size: 36px; margin-bottom: 12px; }
.error-state p { color: #8890a8; margin-bottom: 24px; }
.home-btn {
  display: inline-block;
  padding: 12px 28px;
  border-radius: 12px;
  background: #4a9eff;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
}
.share-content {
  width: 100%;
  max-width: 480px;
}
.card {
  background: #0a0e1a;
  border-radius: 20px;
  padding: 32px 24px;
  border-top: 4px solid;
  margin-bottom: 24px;
}
.overview-card { border-image: linear-gradient(to right, #4a9eff, #7b5ea7) 1; }
.trip-card { border-image: linear-gradient(to right, #4a9eff, #7b5ea7) 1; }
.medals-card { border-image: linear-gradient(to right, #ffd700, #ff8c00) 1; }
.card-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 16px;
}
.divider {
  height: 1px;
  background: #1e2640;
  margin-bottom: 24px;
}
.user-info { text-align: center; margin-bottom: 28px; }
.user-avatar { font-size: 56px; display: block; margin-bottom: 8px; }
.user-name { font-size: 28px; margin-bottom: 4px; }
.user-level { color: #4a9eff; font-size: 16px; }
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}
.stat-item {
  background: #131828;
  border-radius: 12px;
  padding: 16px 8px;
  text-align: center;
}
.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #ffd700;
}
.stat-label {
  font-size: 13px;
  color: #8890a8;
}
.title-badge {
  text-align: center;
  background: #0e1424;
  padding: 14px;
  border-radius: 12px;
  color: #ffd700;
  font-size: 18px;
  margin-bottom: 20px;
}
.exp-bar-wrap { text-align: center; }
.exp-bar {
  height: 12px;
  background: #1a2040;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}
.exp-fill {
  height: 100%;
  background: linear-gradient(to right, #4a9eff, #7b5ea7);
  border-radius: 6px;
  transition: width 0.6s;
}
.exp-text { color: #8890a8; font-size: 14px; }
.photo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 20px;
}
.photo-item {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #131828;
}
.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cities-text {
  text-align: center;
  font-size: 18px;
  margin-bottom: 12px;
}
.progress-text {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #4a9eff;
  margin-bottom: 16px;
}
.medals-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}
.medal-tag {
  background: #1a1a2e;
  border: 1px solid #ffd70044;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 13px;
  color: #ffd700;
}
.medal-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.medal-cell { text-align: center; }
.medal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #131828;
  border: 2px solid #ffd700;
  font-size: 28px;
  margin: 0 auto 6px;
}
.medal-name {
  font-size: 12px;
  color: #8890a8;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.medal-progress {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
}
.medal-bar {
  height: 12px;
  background: #1a2040;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 16px;
}
.medal-fill {
  height: 100%;
  background: linear-gradient(to right, #ffd700, #ff8c00);
  border-radius: 6px;
}
.rarest {
  text-align: center;
  color: #ffd700;
  font-size: 16px;
  margin-bottom: 20px;
}
.user-footer {
  text-align: center;
  color: #8890a8;
  font-size: 14px;
  margin-top: 20px;
}
.cta {
  text-align: center;
  margin-top: 8px;
}
.cta-btn {
  display: inline-block;
  padding: 16px 32px;
  border-radius: 16px;
  background: linear-gradient(135deg, #4a9eff, #7b5ea7);
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 700;
  transition: transform 0.2s;
}
.cta-btn:hover { transform: translateY(-2px); }
</style>
