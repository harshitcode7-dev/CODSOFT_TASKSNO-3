import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { hashPassword } from '@/lib/auth/password'
import { generateToken } from '@/lib/auth/jwt'
import { registerSchema } from '@/lib/validation/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(validatedData.password)

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
      },
    })

    if (validatedData.role === 'CANDIDATE') {
      await prisma.candidateProfile.create({
        data: {
          userId: user.id,
          fullName: validatedData.fullName!,
          location: validatedData.location!,
        },
      })
    } else if (validatedData.role === 'RECRUITER') {
      let company = await prisma.company.findUnique({
        where: { name: validatedData.companyName! },
      })

      if (!company) {
        company = await prisma.company.create({
          data: {
            name: validatedData.companyName!,
            website: validatedData.companyWebsite,
          },
        })
      }

      await prisma.recruiterProfile.create({
        data: {
          userId: user.id,
          name: validatedData.name!,
          companyId: company.id,
        },
      })
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
