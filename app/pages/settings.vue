<template>
  <div class="settings-page">
    <h2>⚙️ 设置</h2>

    <ClientOnly>
      <div v-if="loading" class="settings-loading">
        <div class="settings-spinner" />
        <span>加载中...</span>
      </div>

      <template v-else>
        <!-- ══ Privacy Settings ══ -->
        <div class="settings-section">
          <h3>🔒 隐私设置</h3>
          <p class="section-desc">控制其他旅行者能看到你的哪些信息</p>

          <div class="settings-list">
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
        </div>

        <!-- ══ AI Settings ══ -->
        <div class="settings-section ai-section">
          <h3>🤖 AI 助手设置</h3>
          <p class="section-desc">配置 AI 供应商和 API Key，解锁智能攻略生成、行程优化和对话助手</p>

          <div class="ai-form">
            <!-- Provider -->
            <div class="form-group">
              <label>AI 供应商</label>
              <div class="provider-grid">
                <button
                  v-for="p in providers"
                  :key="p.id"
                  class="provider-btn"
                  :class="{ active: aiForm.provider === p.id }"
                  @click="aiForm.provider = p.id"
                >
                  <span class="provider-icon">{{ p.icon }}</span>
                  <span class="provider-name">{{ p.name }}</span>
                </button>
              </div>
            </div>

            <!-- API Key -->
            <div class="form-group">
              <label>API Key</label>
              <div class="input-with-action">
                <input
                  v-model="aiForm.apiKey"
                  :type="showKey ? 'text' : 'password'"
                  :placeholder="aiConfigured ? '已配置（输入新 Key 覆盖）' : '输入你的 API Key'"
                  class="form-input"
                />
                <button class="input-action" @click="showKey = !showKey">
                  {{ showKey ? '🙈' : '👁️' }}
                </button>
              </div>
              <div class="form-hint">
                Key 将使用 AES-256-GCM 加密存储，仅在请求时解密
              </div>
            </div>

            <!-- Base URL (optional) -->
            <div class="form-group">
              <label>自定义 API 地址 <span class="optional">(可选)</span></label>
              <input
                v-model="aiForm.baseUrl"
                type="text"
                :placeholder="defaultBaseUrl"
                class="form-input"
              />
              <div class="form-hint">
                留空使用默认地址，可填入代理或第三方兼容服务地址
              </div>
            </div>

            <!-- Model (optional) -->
            <div class="form-group">
              <label>模型名称 <span class="optional">(可选)</span></label>
              <input
                v-model="aiForm.model"
                type="text"
                :placeholder="defaultModel"
                class="form-input"
              />
            </div>

            <!-- Actions -->
            <div class="ai-actions">
              <button
                class="btn-save-ai"
                :disabled="!aiForm.apiKey && !aiConfigured"
                @click="saveAISettings"
              >
                {{ aiSaving ? '保存中...' : '💾 保存 AI 设置' }}
              </button>
              <button
                class="btn-test"
                :disabled="aiTesting || (!aiConfigured && !aiForm.apiKey)"
                @click="testAI"
              >
                {{ aiTesting ? '测试中...' : '🔌 测试连接' }}
              </button>
            </div>

            <!-- AI status -->
            <div v-if="aiStatus" class="ai-status" :class="aiStatus.type">
              {{ aiStatus.message }}
            </div>
          </div>
        </div>
      </template>

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
import type { AIProvider } from '~/types'

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

// ── AI Settings ──────────────────────────────────────────
const providers = [
  { id: 'openai' as AIProvider, icon: '🟢', name: 'OpenAI' },
  { id: 'claude' as AIProvider, icon: '🟠', name: 'Claude' },
  { id: 'deepseek' as AIProvider, icon: '🔵', name: 'DeepSeek' },
  { id: 'gemini' as AIProvider, icon: '🔷', name: 'Gemini' },
]

const aiForm = reactive({
  provider: 'openai' as AIProvider,
  apiKey: '',
  baseUrl: '',
  model: '',
})

const showKey = ref(false)
const aiConfigured = ref(false)
const aiSaving = ref(false)
const aiTesting = ref(false)
const aiStatus = ref<{ type: 'success' | 'error'; message: string } | null>(null)

const defaultBaseUrl = computed(() => {
  switch (aiForm.provider) {
    case 'openai': return 'https://api.openai.com/v1'
    case 'claude': return 'https://api.anthropic.com'
    case 'deepseek': return 'https://api.deepseek.com/v1'
    case 'gemini': return 'https://generativelanguage.googleapis.com/v1beta/openai'
    default: return ''
  }
})

const defaultModel = computed(() => {
  switch (aiForm.provider) {
    case 'openai': return 'gpt-4o-mini'
    case 'claude': return 'claude-sonnet-4-20250514'
    case 'deepseek': return 'deepseek-chat'
    case 'gemini': return 'gemini-2.0-flash'
    default: return ''
  }
})

async function fetchSettings() {
  loading.value = true
  try {
    const [privacyData, aiData] = await Promise.all([
      $fetch<{ settings: PrivacySettings }>('/api/user/settings'),
      $fetch<{ configured: boolean; settings: { provider: AIProvider; apiKey: string; baseUrl: string; model: string } | null }>('/api/user/ai-settings'),
    ])
    Object.assign(settings, privacyData.settings)

    if (aiData.configured && aiData.settings) {
      aiConfigured.value = true
      aiForm.provider = aiData.settings.provider
      aiForm.baseUrl = aiData.settings.baseUrl || ''
      aiForm.model = aiData.settings.model || ''
      // Don't set apiKey - it's masked
    }
  } catch {
    // Use defaults
  } finally {
    loading.value = false
  }
}

function onSettingChange() {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveStatus.value = ''
  saveTimeout = setTimeout(() => savePrivacySettings(), 500)
}

async function savePrivacySettings() {
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

async function saveAISettings() {
  if (!aiForm.apiKey && !aiConfigured.value) return
  aiSaving.value = true
  aiStatus.value = null

  try {
    // If no new key entered but already configured, use a placeholder
    // The server will only update if a real key is provided
    if (!aiForm.apiKey) {
      aiStatus.value = { type: 'error', message: '请输入 API Key' }
      return
    }

    await $fetch('/api/user/ai-settings', {
      method: 'PUT',
      body: {
        provider: aiForm.provider,
        apiKey: aiForm.apiKey,
        baseUrl: aiForm.baseUrl || undefined,
        model: aiForm.model || undefined,
      },
    })

    aiConfigured.value = true
    aiForm.apiKey = '' // Clear after save
    aiStatus.value = { type: 'success', message: '✅ AI 设置已保存' }
    setTimeout(() => {
      if (aiStatus.value?.type === 'success') aiStatus.value = null
    }, 3000)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '保存失败'
    aiStatus.value = { type: 'error', message: `❌ ${message}` }
  } finally {
    aiSaving.value = false
  }
}

async function testAI() {
  aiTesting.value = true
  aiStatus.value = null

  try {
    const result = await $fetch<{ success: boolean; message: string; provider?: string; model?: string }>('/api/ai/test', {
      method: 'POST',
    })

    if (result.success) {
      aiStatus.value = {
        type: 'success',
        message: `✅ 连接成功！(${result.provider}/${result.model}) — ${result.message}`,
      }
    } else {
      aiStatus.value = { type: 'error', message: `❌ ${result.message}` }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '测试失败'
    aiStatus.value = { type: 'error', message: `❌ ${message}` }
  } finally {
    aiTesting.value = false
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

/* Section */
.settings-section {
  padding: 20px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px;
}
.settings-section h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}
.section-desc {
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 16px;
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
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px;
}

/* Save status */
.save-status {
  text-align: center;
  font-size: 13px;
  padding: 8px;
  border-radius: 8px;
  margin-top: 8px;
  transition: all 0.3s;
}
.save-status.saving { color: var(--muted); }
.save-status.saved { color: var(--green); }
.save-status.error { color: var(--red); }

/* ── AI Section ── */
.ai-section {
  border-color: rgba(74, 158, 255, 0.2);
}

.ai-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}
.optional {
  font-weight: 400;
  color: var(--muted);
  font-size: 12px;
}

.provider-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.provider-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: var(--bg3);
  border: 2px solid var(--border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text);
}
.provider-btn:hover {
  border-color: var(--accent);
}
.provider-btn.active {
  border-color: var(--accent);
  background: rgba(74, 158, 255, 0.1);
}
.provider-icon {
  font-size: 20px;
}
.provider-name {
  font-size: 12px;
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg3);
  color: var(--text);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  font-family: monospace;
}
.form-input:focus {
  border-color: var(--accent);
}
.form-input::placeholder {
  color: var(--muted);
  font-family: inherit;
}

.input-with-action {
  display: flex;
  gap: 8px;
}
.input-with-action .form-input {
  flex: 1;
}
.input-action {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg3);
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}
.input-action:hover {
  border-color: var(--accent);
}

.form-hint {
  font-size: 11px;
  color: var(--muted);
  line-height: 1.4;
}

.ai-actions {
  display: flex;
  gap: 8px;
}
.btn-save-ai,
.btn-test {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-save-ai {
  background: var(--accent);
  color: #fff;
}
.btn-save-ai:hover:not(:disabled) {
  opacity: 0.9;
}
.btn-test {
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--text);
}
.btn-test:hover:not(:disabled) {
  border-color: var(--accent);
}
.btn-save-ai:disabled,
.btn-test:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ai-status {
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.5;
  word-break: break-word;
}
.ai-status.success {
  background: rgba(0, 184, 148, 0.1);
  color: var(--green);
  border: 1px solid rgba(0, 184, 148, 0.2);
}
.ai-status.error {
  background: rgba(214, 48, 49, 0.1);
  color: var(--red);
  border: 1px solid rgba(214, 48, 49, 0.2);
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
  .settings-section {
    padding: 14px;
  }
  .provider-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }
  .provider-btn {
    padding: 10px 6px;
  }
  .ai-actions {
    flex-direction: column;
  }
}
</style>
