<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-logo">🗺️</div>
        <h1>旅行者传说</h1>
        <p>登录你的旅行者账号</p>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="field">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            autocomplete="username"
            :disabled="loading"
            required
          />
        </div>

        <div class="field">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="请输入密码"
            autocomplete="current-password"
            :disabled="loading"
            required
          />
        </div>

        <div v-if="errorMsg" class="error">{{ errorMsg }}</div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="auth-footer">
        还没有账号？<NuxtLink to="/register">注册</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { login } = useAuth()

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function handleLogin() {
  errorMsg.value = ''
  loading.value = true
  try {
    await login(username.value, password.value)
    const { loadFromServer, getLocalMigrationData, migrateLocalToServer } = useGameState()
    const { migrateLocalPhotosToServer, loadFromServer: loadPhotosFromServer } = usePhotoCheckin()

    // Load server progress first
    await loadFromServer()

    // Check if local has data and server is empty
    const localData = getLocalMigrationData()
    const { state } = useGameState()
    const serverIsEmpty = state.value.exp === 0 && state.value.completed.length === 0

    if (localData && serverIsEmpty) {
      const shouldMigrate = confirm(
        `发现本地存档（${localData.exp} EXP，${localData.completed.length} 个任务）。是否导入到你的账号？`
      )
      if (shouldMigrate) {
        await migrateLocalToServer()
      }
    }

    // Migrate local photos to server and load server photos
    try {
      await migrateLocalPhotosToServer()
      await loadPhotosFromServer()
    } catch {
      // Photo migration failure should not block login
    }

    await navigateTo('/')
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; statusMessage?: string }
    errorMsg.value = err?.data?.message || err?.statusMessage || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #0a0e1a 0%, #0d1020 50%, #111528 100%);
}
.auth-card {
  width: 100%;
  max-width: 400px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 40px 32px;
}
.auth-header { text-align: center; margin-bottom: 32px; }
.auth-logo { font-size: 48px; margin-bottom: 12px; }
.auth-header h1 {
  font-size: 24px; font-weight: 800;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}
.auth-header p { color: var(--muted); font-size: 14px; }
.auth-form { display: flex; flex-direction: column; gap: 20px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 13px; font-weight: 600; color: var(--muted); }
.field input {
  padding: 12px 14px; background: var(--bg3); border: 1px solid var(--border);
  border-radius: 10px; color: #fff; font-size: 14px; outline: none;
  transition: border-color 0.2s;
}
.field input:focus { border-color: var(--accent); }
.field input::placeholder { color: var(--muted); opacity: 0.5; }
.error {
  color: #ff6b6b; font-size: 13px; text-align: center; padding: 8px;
  background: rgba(255, 107, 107, 0.1); border-radius: 8px;
}
.btn-primary {
  padding: 12px; background: linear-gradient(135deg, var(--accent), var(--accent2));
  border: none; border-radius: 10px; color: #fff; font-size: 15px;
  font-weight: 700; cursor: pointer; transition: opacity 0.2s;
}
.btn-primary:hover { opacity: 0.9; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.auth-footer { text-align: center; margin-top: 24px; font-size: 13px; color: var(--muted); }
.auth-footer a { color: var(--accent); text-decoration: none; font-weight: 600; }
.auth-footer a:hover { text-decoration: underline; }

@media (max-width: 640px) {
  .auth-page { padding: 16px; }
  .auth-card { padding: 24px 20px; }
  .auth-header { margin-bottom: 24px; }
  .auth-logo { font-size: 40px; }
  .auth-header h1 { font-size: 20px; }
}
</style>
