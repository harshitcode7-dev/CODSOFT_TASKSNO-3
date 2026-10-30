import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { authenticate, requireAuth } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request)
    requireAuth(user)

    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { recruiterProfile: true },
    })

    if (!dbUser || dbUser.role !== 'RECRUITER' || !dbUser.recruiterProfile) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const applications = await prisma.application.findMany({
      where: {
        job: {
          recruiterId: dbUser.recruiterProfile.id,
        },
      },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        candidate: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Get recruiter applications error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
