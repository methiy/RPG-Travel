<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-logo">🗺️</div>
        <h1>旅行者传说</h1>
        <p>创建你的旅行者账号</p>
      </div>

      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="field">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="字母、数字、下划线，3-20位"
            autocomplete="username"
            :disabled="loading"
            required
          />
          <span v-if="fieldErrors.username" class="field-error">{{ fieldErrors.username }}</span>
        </div>

        <div class="field">
          <label for="displayName">昵称 <span class="optional">（选填，默认与用户名相同）</span></label>
          <input
            id="displayName"
            v-model="displayName"
            type="text"
            placeholder="你的旅行者称号"
            autocomplete="nickname"
            :disabled="loading"
          />
        </div>

        <div class="field">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="至少6位"
            autocomplete="new-password"
            :disabled="loading"
            required
          />
          <span v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</span>
        </div>

        <div class="field">
          <label for="confirmPassword">确认密码</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="再次输入密码"
            autocomplete="new-password"
            :disabled="loading"
            required
          />
          <span v-if="fieldErrors.confirmPassword" class="field-error">{{ fieldErrors.confirmPassword }}</span>
        </div>

        <div v-if="errorMsg" class="error">{{ errorMsg }}</div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>

      <div class="auth-footer">
        已有账号？<NuxtLink to="/login">登录</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { register } = useAuth()

const username = ref('')
const displayName = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const fieldErrors = ref<Record<string, string>>({})
const loading = ref(false)

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/

function validate() {
  const errors: Record<string, string> = {}

  if (!USERNAME_RE.test(username.value)) {
    errors.username = '用户名只能包含字母、数字和下划线，长度3-20位'
  }

  if (password.value.length < 6) {
    errors.password = '密码至少需要6位'
  }

  if (password.value !== confirmPassword.value) {
    errors.confirmPassword = '两次输入的密码不一致'
  }

  return errors
}

async function handleRegister() {
  errorMsg.value = ''
  fieldErrors.value = {}

  const errors = validate()
  if (Object.keys(errors).length > 0) {
    fieldErrors.value = errors
    return
  }

  loading.value = true
  try {
    const name = displayName.value.trim() || username.value
    await register(username.value, password.value, name)
    const { loadFromServer } = useGameState()
    await loadFromServer()
    await navigateTo('/')
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; statusMessage?: string }
    errorMsg.value = err?.data?.message || err?.statusMessage || '注册失败，请稍后重试'
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
.optional { font-weight: 400; font-size: 11px; opacity: 0.7; }
.field-error { color: #ff6b6b; font-size: 12px; }
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
</style>
