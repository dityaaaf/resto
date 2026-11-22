export type UserRole = 'admin' | 'user'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: UserRole
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: UserRole
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: UserRole
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
    }
    CompositeTypes: Record<string, never>
  }
}
