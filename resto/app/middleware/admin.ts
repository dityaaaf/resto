export default defineNuxtRouteMiddleware(async () => {
  // This guard is for navigation only; database access must also be protected by RLS.
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo('/login')
  }

  const { fetchProfile } = useProfile()
  const profile = await fetchProfile()

  if (profile?.role !== 'admin') {
    return abortNavigation(createError({
      statusCode: 404,
      statusMessage: 'Page not found'
    }))
  }
})
