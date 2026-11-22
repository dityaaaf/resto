import { z } from 'zod'

export const USER_ROLES = ['admin', 'user'] as const

const nameSchema = z.string().trim().min(2, 'Name must have at least 2 characters').max(100)
const emailSchema = z.string().trim().email('Enter a valid email address').transform(value => value.toLowerCase())

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: z.string().min(6, 'Password must have at least 6 characters').max(72),
  role: z.enum(USER_ROLES).default('user')
})

export const updateUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: z.string().min(6, 'Password must have at least 6 characters').max(72).or(z.literal('')).optional(),
  role: z.enum(USER_ROLES)
})

export type CreateUserInput = z.input<typeof createUserSchema>
export type UpdateUserInput = z.input<typeof updateUserSchema>
