<template>
  <div class="settings-page">
    <h2>⚙️ 隐私设置</h2>
    <p>控制其他旅行者能看到你的哪些信息</p>

    <ClientOnly>
      <div v-if="loading" class="settings-loading">
        <div class="settings-spinner" />
        <span>加载中...</span>
      </div>

      <div v-else class="settings-list">
        <ToggleSwitch
          v-model="settings.profile_public"
          label="公开个人档案"
          description="关闭后，其他人只能看到你的名字，所有详细信息将被隐藏"
          @update:model-value="onSettingChange"
        />

        <div v-if="settings.profile_public" class="sub-settings">
          <ToggleSwitch
            v-model="settings.show_stats"
            label="显示统计数据"
            description="任务完成数、经验值、探索国家等数据"
            @update:model-value="onSettingChange"
          />

          <ToggleSwitch
            v-model="settings.show_photos"
            label="显示打卡照片"
            description="你的旅行打卡照片"
            @update:model-value="onSettingChange"
          />

          <ToggleSwitch
            v-model="settings.show_medals"
            label="显示勋章"
            description="你获得的旅行勋章"
            @update:model-value="onSettingChange"
          />

        </div>

        <div v-else class="master-off-hint">
          🔒 档案已设为私密，其他人无法查看你的任何信息
        </div>
      </div>

      <!-- Save status -->
      <div v-if="saveStatus" class="save-status" :class="saveStatus">
        {{ saveStatus === 'saving' ? '保存中...' : saveStatus === 'saved' ? '✅ 已保存' : '❌ 保存失败，请重试' }}
      </div>

      <template #fallback>
        <div class="settings-loading">
          <div class="settings-spinner" />
          <span>加载中...</span>
        </div>
      </template>
    </ClientOnly>

    <!-- Back link -->
    <NuxtLink to="/profile" class="back-link">
      ← 返回个人档案
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
interface PrivacySettings {
  profile_public: boolean
  show_stats: boolean
  show_photos: boolean
  show_medals: boolean
}

const loading = ref(true)
const saveStatus = ref<'saving' | 'saved' | 'error' | ''>('')

const settings = reactive<PrivacySettings>({
  profile_public: true,
  show_stats: true,
  show_photos: true,
  show_medals: true,
})

let saveTimeout: ReturnType<typeof setTimeout> | null = null

async function fetchSettings() {
  loading.value = true
  try {
    const data = await $fetch<{ settings: PrivacySettings }>('/api/user/settings')
    Object.assign(settings, data.settings)
  } catch {
    // Use defaults
  } finally {
    loading.value = false
  }
}

function onSettingChange() {
  // Debounced auto-save
  if (saveTimeout) clearTimeout(saveTimeout)
  saveStatus.value = ''
  saveTimeout = setTimeout(() => saveSettings(), 500)
}

async function saveSettings() {
  saveStatus.value = 'saving'
  try {
    const data = await $fetch<{ settings: PrivacySettings }>('/api/user/settings', {
      method: 'PUT',
      body: { ...settings },
    })
    Object.assign(settings, data.settings)
    saveStatus.value = 'saved'
    setTimeout(() => {
      if (saveStatus.value === 'saved') saveStatus.value = ''
    }, 2000)
  } catch {
    saveStatus.value = 'error'
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped>
.settings-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.settings-page h2 {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 0;
}
.settings-page > p {
  color: var(--muted);
  margin-top: -8px;
  margin-bottom: 4px;
}

/* Loading */
.settings-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 60px 0;
  color: var(--muted);
  font-size: 14px;
}
.settings-spinner {
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

/* Settings list */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sub-settings {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 12px;
  border-left: 2px solid var(--border);
  margin-left: 4px;
}

.master-off-hint {
  text-align: center;
  color: var(--muted);
  font-size: 14px;
  padding: 24px 16px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
}

/* Save status */
.save-status {
  text-align: center;
  font-size: 13px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s;
}
.save-status.saving {
  color: var(--muted);
}
.save-status.saved {
  color: var(--green);
}
.save-status.error {
  color: var(--red);
}

/* Back link */
.back-link {
  display: inline-flex;
  align-items: center;
  color: var(--accent);
  text-decoration: none;
  font-size: 14px;
  padding: 8px 0;
}
.back-link:hover {
  text-decoration: underline;
}

/* Mobile */
@media (max-width: 640px) {
  .settings-page {
    padding: 16px 12px;
  }
  .settings-page h2 {
    font-size: 19px;
  }
}
</style>
