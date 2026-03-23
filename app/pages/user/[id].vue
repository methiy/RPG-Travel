<template>
  <div class="user-profile-page">
    <!-- Loading -->
    <div v-if="loading" class="profile-loading">
      <div class="profile-spinner" />
      <span>加载中...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="profile-error">
      <div class="error-icon">😕</div>
      <div class="error-text">{{ error }}</div>
      <NuxtLink to="/" class="error-link">返回首页</NuxtLink>
    </div>

    <!-- Private profile -->
    <div v-else-if="profile?.isPrivate" class="profile-private">
      <section class="profile-header">
        <div class="header-avatar">🔒</div>
        <div class="header-info">
          <div class="header-name">{{ profile.displayName }}</div>
          <div class="header-title private-label">该用户已将档案设为私密</div>
        </div>
      </section>
      <div class="private-hint">
        <div class="private-icon">🔒</div>
        <p>该旅行者选择了隐藏个人档案</p>
        <p class="private-sub">尊重他人隐私是旅行者的美德 ✨</p>
      </div>
    </div>

    <!-- Public profile -->
    <template v-else-if="profile">
      <!-- Header -->
      <section class="profile-header">
        <div class="header-avatar">{{ profileAvatar }}</div>
        <div class="header-info">
          <div class="header-name">{{ profile.displayName }}</div>
          <div class="header-title">{{ profileLevelInfo.title }}</div>
        </div>
        <div class="header-exp">
          <div class="exp-label">
            <span>Lv.{{ profileLevelInfo.lv }}</span>
            <span>{{ profileLevelInfo.cur }} / {{ profileLevelInfo.need }} EXP</span>
          </div>
          <div class="exp-bar">
            <div class="exp-fill" :style="{ width: (profileLevelInfo.cur / profileLevelInfo.need * 100) + '%' }" />
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section v-if="profile.showStats" class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ profile.completedCount }}</div>
          <div class="stat-label">完成任务</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ profile.medalCount }}</div>
          <div class="stat-label">获得勋章</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ countriesCount }}</div>
          <div class="stat-label">探索国家</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ profile.exp }}</div>
          <div class="stat-label">总经验值</div>
        </div>
      </section>

      <!-- Medals -->
      <section v-if="profile.showMedals && displayMedals.length > 0" class="section-card">
        <h3 class="section-title">🏅 获得的勋章</h3>
        <div class="medals-grid">
          <div v-for="m in displayMedals" :key="m.id" class="medal-item">
            <div class="medal-icon">{{ m.icon }}</div>
            <div class="medal-name">{{ m.name }}</div>
          </div>
        </div>
      </section>

      <!-- Photos -->
      <section v-if="profile.showPhotos && profile.photos && profile.photos.length > 0" class="section-card">
        <h3 class="section-title">📷 打卡照片</h3>
        <div class="photos-grid">
          <div v-for="p in profile.photos" :key="p.id" class="photo-thumb">
            <img :src="p.dataUrl" :alt="p.taskId" />
          </div>
        </div>
      </section>

      <!-- Hidden sections hint -->
      <div v-if="hasHiddenSections" class="hidden-hint">
        🔒 该用户隐藏了部分信息
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getLevelInfo, getAvatar } from '~/data/levels'
import { ALL_MEDALS } from '~/data/medals'
import { TASKS } from '~/data/tasks'

interface UserProfile {
  id: number
  displayName: string
  isPrivate: boolean
  createdAt: string
  exp?: number
  completedCount?: number
  medalCount?: number
  completed?: string[]
  medals?: string[]
  showStats?: boolean
  showPhotos?: boolean
  showMedals?: boolean
  photos?: { id: number; taskId: string; dataUrl: string; timestamp: number; comment: string }[]
  privacySettings?: Record<string, boolean>
}

const route = useRoute()
const { authState } = useAuth()

const loading = ref(true)
const error = ref('')
const profile = ref<UserProfile | null>(null)

const profileLevelInfo = computed(() => {
  return getLevelInfo(profile.value?.exp ?? 0)
})

const profileAvatar = computed(() => {
  return getAvatar(profile.value?.exp ?? 0)
})

const allTasks = computed(() => Object.values(TASKS).flat())

const countriesCount = computed(() => {
  if (!profile.value?.completed) return 0
  const countries = new Set(
    allTasks.value.filter(t => profile.value!.completed!.includes(t.id)).map(t => t.country)
  )
  return countries.size
})

const displayMedals = computed(() => {
  if (!profile.value?.medals) return []
  return profile.value.medals
    .map(id => ALL_MEDALS.find(m => m.id === id))
    .filter(Boolean) as { id: string; icon: string; name: string; desc: string }[]
})

const hasHiddenSections = computed(() => {
  if (!profile.value) return false
  return !profile.value.showStats || !profile.value.showPhotos || !profile.value.showMedals
})

async function fetchProfile() {
  const id = route.params.id as string

  // Redirect to /profile if viewing self
  if (authState.value.user && String(authState.value.user.id) === id) {
    await navigateTo('/profile', { replace: true })
    return
  }

  loading.value = true
  error.value = ''
  try {
    const data = await $fetch<UserProfile>(`/api/user/${id}`)
    profile.value = data
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'statusCode' in err) {
      const e = err as { statusCode: number }
      if (e.statusCode === 404) {
        error.value = '找不到该用户'
      } else {
        error.value = '加载失败，请稍后重试'
      }
    } else {
      error.value = '加载失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.user-profile-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 32px;
}

/* Loading */
.profile-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 80px 0;
  color: var(--muted);
  font-size: 14px;
}
.profile-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.profile-error {
  text-align: center;
  padding: 80px 0;
}
.error-icon {
  font-size: 48px;
  margin-bottom: 12px;
}
.error-text {
  color: var(--muted);
  font-size: 16px;
  margin-bottom: 16px;
}
.error-link {
  color: var(--accent);
  text-decoration: none;
  font-size: 14px;
}
.error-link:hover {
  text-decoration: underline;
}

/* Private */
.profile-private {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.private-hint {
  text-align: center;
  padding: 40px 20px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
}
.private-icon {
  font-size: 48px;
  margin-bottom: 12px;
}
.private-hint p {
  color: var(--muted);
  font-size: 14px;
  margin: 0;
}
.private-sub {
  margin-top: 8px !important;
  font-size: 12px !important;
  opacity: 0.7;
}
.private-label {
  color: var(--muted) !important;
}

/* Header */
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

/* Stats */
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
.stat-label {
  font-size: 11px;
  color: var(--muted);
  margin-top: 4px;
}

/* Section card */
.section-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px 0;
}

/* Medals */
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

/* Photos */
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

/* Hidden hint */
.hidden-hint {
  text-align: center;
  color: var(--muted);
  font-size: 12px;
  padding: 8px 0;
  opacity: 0.7;
}

/* Mobile */
@media (max-width: 640px) {
  .user-profile-page {
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
}
</style>
