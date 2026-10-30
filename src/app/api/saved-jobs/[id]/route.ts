import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { authenticate, requireAuth } from '@/lib/auth/middleware'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticate(request)
    requireAuth(user)

    const { id } = await params
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

    // Check if saved job belongs to user
    const savedJob = await prisma.savedJob.findUnique({
      where: { id },
    })

    if (!savedJob || savedJob.candidateId !== dbUser.candidateProfile.id) {
      return NextResponse.json(
        { error: 'Saved job not found' },
        { status: 404 }
      )
    }

    await prisma.savedJob.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Saved job removed' })
  } catch (error) {
    console.error('Delete saved job error:', error)
    return NextResponse.json(
      { error: 'Failed to remove saved job' },
      { status: 500 }
    )
  }
}
