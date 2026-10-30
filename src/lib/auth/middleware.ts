import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './jwt'

export interface AuthUser {
  userId: string
  email: string
  role: string
}

export async function authenticate(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return null
    }

    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    }
  } catch (error) {
    return null
  }
}

export function requireAuth(user: AuthUser | null): AuthUser {
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export function requireRole(user: AuthUser, allowedRoles: string[]): AuthUser {
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden')
  }
  return user
}
