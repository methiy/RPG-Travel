<script setup lang="ts">
import type { ShareTemplate, OverviewSnapshot, TripSnapshot, MedalsSnapshot, ShareSnapshotData } from '~/types'
import { TASKS } from '~/data/tasks'
import { COUNTRIES } from '~/data/countries'
import { CITIES } from '~/data/cities'
import { ALL_MEDALS } from '~/data/medals'

const route = useRoute()
const { state, levelInfo, avatar, completedCount, medalCount, countriesCount } = useGameState()
const { authState } = useAuth()
const { photos } = usePhotoCheckin()

const selectedTemplate = ref<ShareTemplate | null>(
  (route.query.template as ShareTemplate) || null,
)
const selectedCountry = ref<string>(
  (route.query.country as string) || '',
)

// Countries with progress (at least 1 completed task)
const countriesWithProgress = computed(() => {
  const allTasks = Object.values(TASKS).flat()
  const completedSet = new Set(state.value.completed)
  const countryIds = new Set(
    allTasks.filter(t => completedSet.has(t.id)).map(t => t.country),
  )
  return COUNTRIES.filter(c => countryIds.has(c.id))
})

// Show country picker when trip template selected
const showCountryPicker = computed(() => selectedTemplate.value === 'trip' && !selectedCountry.value)

// Build snapshot data based on selected template
const snapshot = computed<ShareSnapshotData | null>(() => {
  if (!selectedTemplate.value) return null
  const user = authState.value.user

  const base = {
    username: user?.username || 'traveler',
    displayName: user?.displayName || '旅行者',
    avatar: avatar.value,
    level: levelInfo.value.lv,
    title: levelInfo.value.title,
  }

  if (selectedTemplate.value === 'overview') {
    const allTasks = Object.values(TASKS).flat()
    const completedSet = new Set(state.value.completed)
    const cityIds = new Set(
      allTasks.filter(t => completedSet.has(t.id)).map(t => t.city),
    )
    return {
      ...base,
      exp: state.value.exp,
      countriesCount: countriesCount.value,
      citiesCount: cityIds.size,
      completedCount: completedCount.value,
      medalCount: medalCount.value,
      achievementCount: 0,
    } as OverviewSnapshot
  }

  if (selectedTemplate.value === 'trip' && selectedCountry.value) {
    const country = COUNTRIES.find(c => c.id === selectedCountry.value)
    if (!country) return null
    const countryTasks = TASKS[country.id] || []
    const completedSet = new Set(state.value.completed)
    const completedTasks = countryTasks.filter(t => completedSet.has(t.id))
    const earnedMedals = completedTasks
      .filter(t => state.value.medals.includes(t.medal.id))
      .map(t => ({ icon: t.medal.icon, name: t.medal.name }))
    const cityNames = [...new Set(completedTasks.map(t => t.city))]
      .map(cid => CITIES.find(c => c.id === cid)?.name || cid)
    const taskPhotos = completedTasks
      .map(t => photos.value.find(p => p.taskId === t.id)?.dataUrl)
      .filter((url): url is string => !!url)
      .slice(0, 4)

    return {
      ...base,
      countryId: country.id,
      countryName: country.name.replace(/[^\u4e00-\u9fa5a-zA-Z\s]/g, '').trim(),
      countryEmoji: country.emoji,
      cities: cityNames,
      completedTasks: completedTasks.length,
      totalTasks: countryTasks.length,
      medals: earnedMedals,
      photos: taskPhotos,
    } as TripSnapshot
  }

  if (selectedTemplate.value === 'medals') {
    const earnedMedals = ALL_MEDALS
      .filter(m => state.value.medals.includes(m.id))
      .map(m => ({ icon: m.icon, name: m.name }))
    const rarest = earnedMedals.length > 0 ? earnedMedals[earnedMedals.length - 1] : null
    return {
      ...base,
      earnedMedals,
      totalMedals: ALL_MEDALS.length,
      rarestMedal: rarest,
    } as MedalsSnapshot
  }

  return null
})

// Ready to show preview
const showPreview = computed(() => {
  if (!selectedTemplate.value) return false
  if (selectedTemplate.value === 'trip' && !selectedCountry.value) return false
  return !!snapshot.value
})

function selectCountry(countryId: string) {
  selectedCountry.value = countryId
}

function resetCountry() {
  selectedCountry.value = ''
}
</script>

<template>
  <div class="export-page">
    <h1 class="page-title">📤 分享我的旅行</h1>

    <!-- Step 1: Template selection -->
    <section class="section">
      <h2 class="section-title">选择模板</h2>
      <ShareTemplateSelector v-model="selectedTemplate" />
    </section>

    <!-- Step 1.5: Country picker for trip template -->
    <section v-if="showCountryPicker" class="section">
      <h2 class="section-title">选择国家</h2>
      <div v-if="countriesWithProgress.length === 0" class="empty-hint">
        还没有旅行记录，先去完成一些任务吧！
      </div>
      <div v-else class="country-grid">
        <button
          v-for="c in countriesWithProgress"
          :key="c.id"
          class="country-btn"
          @click="selectCountry(c.id)"
        >
          <span class="country-emoji">{{ c.emoji }}</span>
          <span class="country-name">{{ c.name }}</span>
        </button>
      </div>
    </section>

    <!-- Country selection indicator -->
    <div v-if="selectedTemplate === 'trip' && selectedCountry" class="country-selected">
      <span>已选: {{ countriesWithProgress.find(c => c.id === selectedCountry)?.emoji }}
        {{ countriesWithProgress.find(c => c.id === selectedCountry)?.name }}</span>
      <button class="change-btn" @click="resetCountry">更换</button>
    </div>

    <!-- Step 2: Preview and actions -->
    <section v-if="showPreview && snapshot" class="section">
      <h2 class="section-title">预览</h2>
      <ClientOnly>
        <ShareCardPreview :template="selectedTemplate!" :snapshot="snapshot" />
      </ClientOnly>
    </section>
  </div>
</template>

<style scoped>
.export-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 16px 100px;
}
.page-title {
  font-size: 24px;
  margin-bottom: 24px;
  text-align: center;
  color: var(--text, #e8eaf6);
}
.section {
  margin-bottom: 32px;
}
.section-title {
  font-size: 18px;
  color: var(--text, #e8eaf6);
  margin-bottom: 14px;
}
.empty-hint {
  text-align: center;
  color: var(--muted, #8890a8);
  padding: 32px;
}
.country-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}
.country-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #2a3050;
  background: var(--bg2, #131828);
  color: var(--text, #e8eaf6);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}
.country-btn:hover {
  border-color: #4a9eff;
  transform: translateY(-1px);
}
.country-emoji { font-size: 24px; }
.country-name { font-weight: 600; }
.country-selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  background: #4a9eff12;
  border: 1px solid #4a9eff44;
  margin-bottom: 24px;
  color: var(--text, #e8eaf6);
  font-size: 15px;
}
.change-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  background: #4a9eff;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
}
</style>
