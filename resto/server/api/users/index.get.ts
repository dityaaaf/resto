import { requireAdmin } from '../../utils/requireAdmin'

export default defineEventHandler(async (event) => {
  const { admin } = await requireAdmin(event)
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''

  if (search.length > 100) {
    throw createError({ statusCode: 400, statusMessage: 'Search must be 100 characters or fewer' })
  }

  let request = admin
    .from('users')
    .select('id, name, email, role, created_at')
    .order('created_at', { ascending: false })

  if (search) {
    request = request.ilike('name', `%${search}%`)
  }

  const { data, error } = await request

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Unable to load users' })
  }

  return data
})
