import type { UserRole } from '~/types/database.types'

export interface Profile {
  id: string
  name: string
  email: string
  role: UserRole
}

export const useProfile = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const profile = useState<Profile | null>('profile', () => null)
  const profileError = useState<string | null>('profile-error', () => null)

  const fetchProfile = async (force = false): Promise<Profile | null> => {
    const id = user.value?.sub

    if (!id) {
      profile.value = null
      profileError.value = null
      return null
    }

    if (!force && profile.value?.id === id) {
      return profile.value
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', id)
      .single()

    if (error) {
      console.error('fetchProfile:', error.message)
      profileError.value = error.message
      profile.value = null
      return null
    }

    profileError.value = null
    profile.value = data
    return profile.value
  }

  const isAdmin = computed(() => profile.value?.role === 'admin')

  return {
    profile,
    profileError,
    isAdmin,
    fetchProfile
  }
}
