export default defineNuxtRouteMiddleware(async () => {
  const { public: publicConfig } = useRuntimeConfig()

  if (
    publicConfig.supabase.url === 'https://your-project.supabase.co'
    || publicConfig.supabase.key === 'your-supabase-publishable-key'
  ) {
    return
  }

  const user = useSupabaseUser()

  if (user.value) {
    return navigateTo('/')
  }
})
