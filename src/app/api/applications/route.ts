import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { authenticate, requireAuth } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request)
    requireAuth(user)

    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { candidateProfile: true },
    })

    if (!dbUser || dbUser.role !== 'CANDIDATE' || !dbUser.candidateProfile) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const applications = await prisma.application.findMany({
      where: { candidateId: dbUser.candidateProfile.id },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Get applications error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    requireAuth(user)

    const body = await request.json()
    const { jobId, coverLetter, expectedSalary, noticePeriod } = body

    // Check if user is a candidate
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { candidateProfile: true },
    })

    if (!dbUser || dbUser.role !== 'CANDIDATE' || !dbUser.candidateProfile) {
      return NextResponse.json(
        { error: 'Only candidates can apply for jobs' },
        { status: 403 }
      )
    }

    // Check if already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId,
        candidateId: dbUser.candidateProfile.id,
      },
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this job' },
        { status: 409 }
      )
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId,
        candidateId: dbUser.candidateProfile.id,
        coverLetter,
        expectedSalary,
        noticePeriod,
        status: 'APPLIED',
      },
    })

    // Increment job applicant count
    await prisma.job.update({
      where: { id: jobId },
      data: { applicantCount: { increment: 1 } },
    })

    return NextResponse.json({ application })
  } catch (error) {
    console.error('Create application error:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}
