export default defineNuxtRouteMiddleware(async (to) => {
  const { authState, fetchUser } = useAuth()

  // Fetch user on first load
  if (authState.value.loading) {
    await fetchUser()
  }

  const publicPages = ['/login', '/register']
  const isPublic = publicPages.includes(to.path)

  if (!authState.value.user && !isPublic) {
    return navigateTo('/login')
  }

  if (authState.value.user && isPublic) {
    return navigateTo('/')
  }
})
