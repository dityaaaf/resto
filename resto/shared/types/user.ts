import type { UserRole } from '~~/app/types/database.types'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  created_at: string
}

export interface UserFormValues {
  name: string
  email: string
  password: string
  role: UserRole
}
