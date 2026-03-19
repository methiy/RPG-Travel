import type { AuthUser } from '~/types'

interface AuthState {
  user: AuthUser | null
  loading: boolean
}

export function useAuth() {
  const state = useState<AuthState>('auth', () => ({
    user: null,
    loading: true,
  }))

  const isLoggedIn = computed(() => !!state.value.user)

  async function fetchUser() {
    try {
      const data = await $fetch('/api/auth/me')
      state.value.user = data.user
    } catch {
      state.value.user = null
    } finally {
      state.value.loading = false
    }
  }

  async function login(username: string, password: string) {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username, password },
    })
    state.value.user = data.user
    return data.user
  }

  async function register(username: string, password: string, displayName: string) {
    const data = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { username, password, displayName },
    })
    state.value.user = data.user
    return data.user
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    state.value.user = null
    await navigateTo('/login')
  }

  return {
    authState: state,
    isLoggedIn,
    fetchUser,
    login,
    register,
    logout,
  }
}
