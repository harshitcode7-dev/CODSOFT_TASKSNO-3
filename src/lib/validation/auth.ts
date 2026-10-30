import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['CANDIDATE', 'RECRUITER']),
  // Candidate fields
  fullName: z.string().optional(),
  location: z.string().optional(),
  // Recruiter fields
  name: z.string().optional(),
  companyName: z.string().optional(),
  companyWebsite: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === 'CANDIDATE') {
    return !!data.fullName && !!data.location
  }
  if (data.role === 'RECRUITER') {
    return !!data.name && !!data.companyName
  }
  return true
}, {
  message: "Required fields are missing",
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
