import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { authenticate, requireAuth } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const location = searchParams.get('location') || ''
    const jobType = searchParams.get('jobType') || ''
    const workMode = searchParams.get('workMode') || ''
    const experienceLevel = searchParams.get('experienceLevel') || ''
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'recent'

    const skip = (page - 1) * limit

    const where: any = {
      isActive: true,
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { company: { name: { contains: search } } },
      ]
    }

    if (location) {
      where.location = { contains: location }
    }

    if (jobType) {
      where.jobType = jobType
    }

    if (workMode) {
      where.workMode = workMode
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel
    }

    if (category) {
      where.category = { contains: category }
    }

    let orderBy: any = { createdAt: 'desc' }

    if (sortBy === 'salary-high') {
      orderBy = { maxSalary: 'desc' }
    } else if (sortBy === 'salary-low') {
      orderBy = { minSalary: 'asc' }
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
              location: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.job.count({ where }),
    ])

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get jobs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    requireAuth(user)

    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { recruiterProfile: true },
    })

    if (!dbUser || dbUser.role !== 'RECRUITER' || !dbUser.recruiterProfile) {
      return NextResponse.json(
        { error: 'Only recruiters can create jobs' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      location,
      category,
      jobType,
      workMode,
      experienceLevel,
      minSalary,
      maxSalary,
      salaryCurrency,
      description,
      responsibilities,
      requirements,
      benefits,
      applicationDeadline,
    } = body

    const job = await prisma.job.create({
      data: {
        title,
        companyId: dbUser.recruiterProfile.companyId,
        recruiterId: dbUser.recruiterProfile.id,
        location,
        category,
        jobType,
        workMode,
        experienceLevel,
        minSalary,
        maxSalary,
        salaryCurrency,
        description,
        responsibilities,
        requirements,
        benefits,
        applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
        isActive: true,
        applicantCount: 0,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    })

    return NextResponse.json({ job })
  } catch (error) {
    console.error('Create job error:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}
