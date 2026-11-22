import { requireAdmin } from '../../utils/requireAdmin'
import { createUserSchema } from '~~/shared/utils/userSchema'

export default defineEventHandler(async (event) => {
  const { admin } = await requireAdmin(event)
  const body = await readValidatedBody(event, value => createUserSchema.parse(value))
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true,
    user_metadata: { name: body.name }
  })

  if (authError) {
    throw createError({
      statusCode: authError.code === 'email_exists' ? 409 : 400,
      statusMessage: authError.code === 'email_exists' ? 'Email is already registered' : authError.message
    })
  }

  if (!authData.user) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase did not return the created user' })
  }

  const { data: profile, error: profileError } = await admin
    .from('users')
    .upsert({
      id: authData.user.id,
      name: body.name,
      email: body.email,
      role: body.role
    })
    .select('id, name, email, role, created_at')
    .single()

  if (profileError) {
    const { error: cleanupError } = await admin.auth.admin.deleteUser(authData.user.id)

    if (cleanupError) {
      console.error('Unable to roll back created auth user:', cleanupError.message)
      throw createError({
        statusCode: 500,
        statusMessage: `User profile creation failed, and auth cleanup also failed: ${cleanupError.message}`
      })
    }

    throw createError({ statusCode: 500, statusMessage: 'Unable to create user profile' })
  }

  setResponseStatus(event, 201)
  return profile
})
