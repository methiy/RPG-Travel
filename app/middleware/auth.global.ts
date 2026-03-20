export default defineNuxtRouteMiddleware(async (to) => {
  const { authState, fetchUser } = useAuth()

  // Fetch user on first load
  if (authState.value.loading) {
    await fetchUser()
  }

  const publicPages = ['/login', '/register']
  const isAuthPage = publicPages.includes(to.path)
  const isPublic = isAuthPage || to.path.startsWith('/user/')

  if (!authState.value.user && !isPublic) {
    return navigateTo('/login')
  }

  // Only redirect away from login/register, not from /user/ pages
  if (authState.value.user && isAuthPage) {
    return navigateTo('/')
  }
})
