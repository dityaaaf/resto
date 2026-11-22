import { requireAdmin } from '../../utils/requireAdmin'
import { requireUuidParam } from '../../utils/requireUuidParam'

export default defineEventHandler(async (event) => {
  const { admin, adminId } = await requireAdmin(event)
  const id = requireUuidParam(event, 'id')

  if (id === adminId) {
    throw createError({ statusCode: 400, statusMessage: 'You cannot delete your own account' })
  }

  const { data: profile, error: lookupError } = await admin
    .from('users')
    .select('id')
    .eq('id', id)
    .maybeSingle()

  if (lookupError) {
    throw createError({ statusCode: 500, statusMessage: 'Unable to load user before deletion' })
  }

  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const { error } = await admin.auth.admin.deleteUser(id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Unable to delete user from Supabase Auth' })
  }

  return { deleted: true }
})
