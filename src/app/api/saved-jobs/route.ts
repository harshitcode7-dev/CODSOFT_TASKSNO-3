import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { authenticate, requireAuth } from '@/lib/auth/middleware'

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    requireAuth(user)

    const body = await request.json()
    const { jobId } = body

    // Check if user is a candidate
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { candidateProfile: true },
    })

    if (!dbUser || dbUser.role !== 'CANDIDATE' || !dbUser.candidateProfile) {
      return NextResponse.json(
        { error: 'Only candidates can save jobs' },
        { status: 403 }
      )
    }

    // Check if already saved
    const existingSavedJob = await prisma.savedJob.findFirst({
      where: {
        jobId,
        candidateId: dbUser.candidateProfile.id,
      },
    })

    if (existingSavedJob) {
      return NextResponse.json(
        { error: 'Job already saved' },
        { status: 409 }
      )
    }

    // Create saved job
    const savedJob = await prisma.savedJob.create({
      data: {
        jobId,
        candidateId: dbUser.candidateProfile.id,
      },
    })

    return NextResponse.json({ savedJob })
  } catch (error) {
    console.error('Save job error:', error)
    return NextResponse.json(
      { error: 'Failed to save job' },
      { status: 500 }
    )
  }
}

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

    const savedJobs = await prisma.savedJob.findMany({
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

    return NextResponse.json({ savedJobs })
  } catch (error) {
    console.error('Get saved jobs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved jobs' },
      { status: 500 }
    )
  }
}
