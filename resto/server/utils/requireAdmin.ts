import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import type { H3Event } from 'h3'

export async function requireAdmin(event: H3Event) {
  const user = await serverSupabaseUser(event)

  if (!user?.sub) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const config = useRuntimeConfig(event)
  if (!config.supabase.secretKey && !config.supabase.serviceKey) {
    throw createError({ statusCode: 503, statusMessage: 'Server Supabase key is not configured' })
  }

  const admin = serverSupabaseServiceRole(event)
  const { data: profile, error } = await admin
    .from('users')
    .select('role')
    .eq('id', user.sub)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Unable to verify administrator access' })
  }

  if (profile?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Administrator access required' })
  }

  return { admin, adminId: user.sub }
}
