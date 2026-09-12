import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
})

export const profileSchema = z.object({
  bio: z.string().max(500, 'Bio must be less than 500 characters.').optional(),
  avatarUrl: z.string().url('Invalid URL').optional(),
})
