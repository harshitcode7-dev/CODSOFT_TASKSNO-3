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

    const jobs = await prisma.job.findMany({
      where: { recruiterId: dbUser.recruiterProfile.id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Add applicant count to each job
    const jobsWithCount = jobs.map((job) => ({
      ...job,
      applicantCount: job._count.applications,
    }))

    return NextResponse.json({ jobs: jobsWithCount })
  } catch (error) {
    console.error('Get recruiter jobs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}
