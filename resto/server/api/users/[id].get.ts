import { requireAdmin } from '../../utils/requireAdmin'
import { requireUuidParam } from '../../utils/requireUuidParam'

export default defineEventHandler(async (event) => {
  const { admin } = await requireAdmin(event)
  const id = requireUuidParam(event, 'id')
  const { data, error } = await admin
    .from('users')
    .select('id, name, email, role, created_at')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Unable to load user' })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return data
})
