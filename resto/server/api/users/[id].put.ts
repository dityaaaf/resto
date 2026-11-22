import { requireAdmin } from '../../utils/requireAdmin'
import { requireUuidParam } from '../../utils/requireUuidParam'
import { updateUserSchema } from '~~/shared/utils/userSchema'

export default defineEventHandler(async (event) => {
  const { admin, adminId } = await requireAdmin(event)
  const id = requireUuidParam(event, 'id')
  const body = await readValidatedBody(event, value => updateUserSchema.parse(value))

  if (id === adminId && body.role !== 'admin') {
    throw createError({ statusCode: 400, statusMessage: 'You cannot remove your own administrator role' })
  }

  const { data: existing, error: lookupError } = await admin
    .from('users')
    .select('id, name, email, role')
    .eq('id', id)
    .maybeSingle()

  if (lookupError) {
    throw createError({ statusCode: 500, statusMessage: 'Unable to load user before update' })
  }

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const { data: profile, error: profileError } = await admin
    .from('users')
    .update({ name: body.name, email: body.email, role: body.role })
    .eq('id', id)
    .select('id, name, email, role, created_at')
    .single()

  if (profileError) {
    throw createError({
      statusCode: profileError.code === '23505' ? 409 : 500,
      statusMessage: profileError.code === '23505' ? 'Email is already registered' : 'Unable to update user profile'
    })
  }

  const authUpdates: {
    email: string
    user_metadata: { name: string }
    password?: string
    email_confirm?: boolean
  } = {
    email: body.email,
    user_metadata: { name: body.name }
  }

  if (body.email !== existing.email) {
    authUpdates.email_confirm = true
  }

  if (body.password) {
    authUpdates.password = body.password
  }

  const { error: authError } = await admin.auth.admin.updateUserById(id, authUpdates)

  if (authError) {
    const { error: rollbackError } = await admin
      .from('users')
      .update({ name: existing.name, email: existing.email, role: existing.role })
      .eq('id', id)

    if (rollbackError) {
      console.error('Unable to roll back user profile update:', rollbackError.message)
      throw createError({
        statusCode: 500,
        statusMessage: `Auth update failed, and profile rollback also failed: ${rollbackError.message}`
      })
    }

    throw createError({
      statusCode: authError.code === 'email_exists' ? 409 : 400,
      statusMessage: authError.code === 'email_exists' ? 'Email is already registered' : authError.message
    })
  }

  return profile
})
