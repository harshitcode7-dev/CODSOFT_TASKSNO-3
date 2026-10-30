import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth/password'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clean existing data
  await prisma.application.deleteMany()
  await prisma.savedJob.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.education.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.job.deleteMany()
  await prisma.recruiterProfile.deleteMany()
  await prisma.candidateProfile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.company.deleteMany()

  console.log('✅ Cleaned existing data')

  // Create Companies
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: 'TechCorp',
        description: 'Leading technology company specializing in software development',
        industry: 'Technology',
        companySize: '1000-5000',
        website: 'https://techcorp.com',
        location: 'San Francisco, CA',
        foundedYear: 2010,
      },
    }),
    prisma.company.create({
      data: {
        name: 'DataDriven Inc',
        description: 'Data analytics and machine learning solutions',
        industry: 'Data Science',
        companySize: '500-1000',
        website: 'https://datadriven.com',
        location: 'New York, NY',
        foundedYear: 2015,
      },
    }),
    prisma.company.create({
      data: {
        name: 'DesignStudio',
        description: 'Creative design agency for digital products',
        industry: 'Design',
        companySize: '100-500',
        website: 'https://designstudio.com',
        location: 'Los Angeles, CA',
        foundedYear: 2018,
      },
    }),
    prisma.company.create({
      data: {
        name: 'FinanceHub',
        description: 'Financial services and fintech solutions',
        industry: 'Finance',
        companySize: '1000-5000',
        website: 'https://financehub.com',
        location: 'Chicago, IL',
        foundedYear: 2012,
      },
    }),
    prisma.company.create({
      data: {
        name: 'HealthTech Solutions',
        description: 'Healthcare technology and telemedicine',
        industry: 'Healthcare',
        companySize: '500-1000',
        website: 'https://healthtech.com',
        location: 'Boston, MA',
        foundedYear: 2016,
      },
    }),
  ])

  console.log(`✅ Created ${companies.length} companies`)

  // Create Recruiters
  const recruiterPasswords = await Promise.all([
    hashPassword('recruiter123'),
    hashPassword('recruiter456'),
    hashPassword('recruiter789'),
  ])

  const recruiters = await Promise.all([
    prisma.user.create({
      data: {
        email: 'recruiter1@techcorp.com',
        password: recruiterPasswords[0],
        role: 'RECRUITER',
        recruiterProfile: {
          create: {
            name: 'John Recruiter',
            companyId: companies[0].id,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'recruiter2@datadriven.com',
        password: recruiterPasswords[1],
        role: 'RECRUITER',
        recruiterProfile: {
          create: {
            name: 'Sarah Recruiter',
            companyId: companies[1].id,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'recruiter3@designstudio.com',
        password: recruiterPasswords[2],
        role: 'RECRUITER',
        recruiterProfile: {
          create: {
            name: 'Mike Recruiter',
            companyId: companies[2].id,
          },
        },
      },
    }),
  ])

  console.log(`✅ Created ${recruiters.length} recruiters`)

  // Reload recruiters with profiles
  const recruitersWithProfiles = await prisma.user.findMany({
    where: { role: 'RECRUITER' },
    include: { recruiterProfile: true },
  })

  // Create Candidates
  const candidatePasswords = await Promise.all([
    hashPassword('candidate123'),
    hashPassword('candidate456'),
    hashPassword('candidate789'),
    hashPassword('candidate000'),
    hashPassword('candidate111'),
  ])

  const candidates = await Promise.all([
    prisma.user.create({
      data: {
        email: 'candidate1@example.com',
        password: candidatePasswords[0],
        role: 'CANDIDATE',
        candidateProfile: {
          create: {
            fullName: 'Alice Johnson',
            location: 'San Francisco, CA',
            professionalHeadline: 'Senior Software Engineer',
            aboutMe: 'Passionate developer with 5 years of experience in full-stack development.',
            phone: '+1-555-0101',
            linkedinUrl: 'https://linkedin.com/in/alice',
            githubUrl: 'https://github.com/alice',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'candidate2@example.com',
        password: candidatePasswords[1],
        role: 'CANDIDATE',
        candidateProfile: {
          create: {
            fullName: 'Bob Smith',
            location: 'New York, NY',
            professionalHeadline: 'Data Scientist',
            aboutMe: 'Data scientist specializing in machine learning and AI.',
            phone: '+1-555-0102',
            linkedinUrl: 'https://linkedin.com/in/bob',
            githubUrl: 'https://github.com/bob',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'candidate3@example.com',
        password: candidatePasswords[2],
        role: 'CANDIDATE',
        candidateProfile: {
          create: {
            fullName: 'Carol Williams',
            location: 'Los Angeles, CA',
            professionalHeadline: 'UI/UX Designer',
            aboutMe: 'Creative designer with expertise in user experience and interface design.',
            phone: '+1-555-0103',
            portfolioUrl: 'https://carol.design',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'candidate4@example.com',
        password: candidatePasswords[3],
        role: 'CANDIDATE',
        candidateProfile: {
          create: {
            fullName: 'David Brown',
            location: 'Chicago, IL',
            professionalHeadline: 'Financial Analyst',
            aboutMe: 'Experienced financial analyst with strong analytical skills.',
            phone: '+1-555-0104',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'candidate5@example.com',
        password: candidatePasswords[4],
        role: 'CANDIDATE',
        candidateProfile: {
          create: {
            fullName: 'Eva Martinez',
            location: 'Boston, MA',
            professionalHeadline: 'Product Manager',
            aboutMe: 'Product manager with experience in tech and healthcare.',
            phone: '+1-555-0105',
            linkedinUrl: 'https://linkedin.com/in/eva',
          },
        },
      },
    }),
  ])

  console.log(`✅ Created ${candidates.length} candidates`)

  // Reload candidates with profiles
  const candidatesWithProfiles = await prisma.user.findMany({
    where: { role: 'CANDIDATE' },
    include: { candidateProfile: true },
  })

  // Add Skills, Education, Experience for candidates
  await Promise.all([
    prisma.skill.createMany({
      data: [
        { name: 'JavaScript', candidateId: candidatesWithProfiles[0].candidateProfile!.id },
        { name: 'React', candidateId: candidatesWithProfiles[0].candidateProfile!.id },
        { name: 'Node.js', candidateId: candidatesWithProfiles[0].candidateProfile!.id },
        { name: 'Python', candidateId: candidatesWithProfiles[1].candidateProfile!.id },
        { name: 'Machine Learning', candidateId: candidatesWithProfiles[1].candidateProfile!.id },
        { name: 'TensorFlow', candidateId: candidatesWithProfiles[1].candidateProfile!.id },
        { name: 'Figma', candidateId: candidatesWithProfiles[2].candidateProfile!.id },
        { name: 'UI Design', candidateId: candidatesWithProfiles[2].candidateProfile!.id },
        { name: 'Excel', candidateId: candidatesWithProfiles[3].candidateProfile!.id },
        { name: 'Financial Modeling', candidateId: candidatesWithProfiles[3].candidateProfile!.id },
      ],
    }),
  ])

  await Promise.all([
    prisma.education.createMany({
      data: [
        {
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          university: 'Stanford University',
          graduationYear: 2018,
          candidateId: candidatesWithProfiles[0].candidateProfile!.id,
        },
        {
          degree: 'Master of Science',
          field: 'Data Science',
          university: 'MIT',
          graduationYear: 2019,
          candidateId: candidatesWithProfiles[1].candidateProfile!.id,
        },
        {
          degree: 'Bachelor of Fine Arts',
          field: 'Design',
          university: 'California College of the Arts',
          graduationYear: 2017,
          candidateId: candidatesWithProfiles[2].candidateProfile!.id,
        },
      ],
    }),
  ])

  await Promise.all([
    prisma.experience.createMany({
      data: [
        {
          jobTitle: 'Software Engineer',
          company: 'Startup Inc',
          location: 'San Francisco, CA',
          startDate: new Date('2019-06-01'),
          endDate: new Date('2021-12-01'),
          current: false,
          description: 'Developed web applications using React and Node.js',
          candidateId: candidatesWithProfiles[0].candidateProfile!.id,
        },
        {
          jobTitle: 'Senior Software Engineer',
          company: 'TechCorp',
          location: 'San Francisco, CA',
          startDate: new Date('2021-12-01'),
          current: true,
          description: 'Leading development of enterprise applications',
          candidateId: candidatesWithProfiles[0].candidateProfile!.id,
        },
        {
          jobTitle: 'Data Analyst',
          company: 'Analytics Co',
          location: 'New York, NY',
          startDate: new Date('2019-08-01'),
          endDate: new Date('2021-06-01'),
          current: false,
          description: 'Analyzed business data and created reports',
          candidateId: candidatesWithProfiles[1].candidateProfile!.id,
        },
      ],
    }),
  ])

  console.log('✅ Added candidate profiles (skills, education, experience)')

  // Create Jobs
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'Senior Software Engineer',
        companyId: companies[0].id,
        recruiterId: recruitersWithProfiles[0].recruiterProfile!.id,
        location: 'San Francisco, CA',
        category: 'Software Development',
        jobType: 'FULL_TIME',
        workMode: 'HYBRID',
        experienceLevel: 'SENIOR_LEVEL',
        minSalary: 120000,
        maxSalary: 160000,
        salaryCurrency: 'USD',
        description: 'We are looking for a senior software engineer to join our team and help build scalable web applications.',
        responsibilities: 'Design and implement new features, mentor junior developers, participate in code reviews',
        requirements: '5+ years of experience in software development, proficiency in JavaScript/TypeScript, experience with React and Node.js',
        benefits: 'Competitive salary, health insurance, 401k, remote work options',
        applicationDeadline: new Date('2026-12-31'),
        applicantCount: 15,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Data Scientist',
        companyId: companies[1].id,
        recruiterId: recruitersWithProfiles[1].recruiterProfile!.id,
        location: 'New York, NY',
        category: 'Data Science',
        jobType: 'FULL_TIME',
        workMode: 'REMOTE',
        experienceLevel: 'MID_LEVEL',
        minSalary: 100000,
        maxSalary: 140000,
        salaryCurrency: 'USD',
        description: 'Join our data science team to build machine learning models and analyze complex datasets.',
        responsibilities: 'Develop ML models, analyze data, create data pipelines',
        requirements: '3+ years of experience in data science, proficiency in Python, experience with ML frameworks',
        benefits: 'Competitive salary, stock options, flexible hours',
        applicationDeadline: new Date('2026-12-15'),
        applicantCount: 22,
      },
    }),
    prisma.job.create({
      data: {
        title: 'UI/UX Designer',
        companyId: companies[2].id,
        recruiterId: recruitersWithProfiles[2].recruiterProfile!.id,
        location: 'Los Angeles, CA',
        category: 'Design',
        jobType: 'FULL_TIME',
        workMode: 'ON_SITE',
        experienceLevel: 'MID_LEVEL',
        minSalary: 80000,
        maxSalary: 110000,
        salaryCurrency: 'USD',
        description: 'We are seeking a talented UI/UX designer to create beautiful and intuitive user experiences.',
        responsibilities: 'Design user interfaces, create wireframes and prototypes, conduct user research',
        requirements: '3+ years of experience in UI/UX design, proficiency in Figma, strong portfolio',
        benefits: 'Creative work environment, health benefits, professional development budget',
        applicationDeadline: new Date('2026-11-30'),
        applicantCount: 18,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Financial Analyst',
        companyId: companies[3].id,
        recruiterId: recruitersWithProfiles[0].recruiterProfile!.id,
        location: 'Chicago, IL',
        category: 'Finance',
        jobType: 'FULL_TIME',
        workMode: 'ON_SITE',
        experienceLevel: 'ENTRY_LEVEL',
        minSalary: 60000,
        maxSalary: 80000,
        salaryCurrency: 'USD',
        description: 'Entry-level financial analyst position for recent graduates looking to start their career in finance.',
        responsibilities: 'Analyze financial data, prepare reports, assist with budget planning',
        requirements: 'Bachelor degree in Finance or related field, strong Excel skills, attention to detail',
        benefits: 'Competitive salary, comprehensive training program, mentorship',
        applicationDeadline: new Date('2026-12-01'),
        applicantCount: 35,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Product Manager',
        companyId: companies[4].id,
        recruiterId: recruitersWithProfiles[1].recruiterProfile!.id,
        location: 'Boston, MA',
        category: 'Product',
        jobType: 'FULL_TIME',
        workMode: 'HYBRID',
        experienceLevel: 'SENIOR_LEVEL',
        minSalary: 130000,
        maxSalary: 170000,
        salaryCurrency: 'USD',
        description: 'Senior product manager to lead product strategy and development for healthcare technology products.',
        responsibilities: 'Define product strategy, work with engineering teams, gather requirements',
        requirements: '5+ years of product management experience, experience in healthcare tech, strong leadership skills',
        benefits: 'Competitive salary, equity, health benefits, flexible work schedule',
        applicationDeadline: new Date('2026-01-15'),
        applicantCount: 12,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Frontend Developer Intern',
        companyId: companies[0].id,
        recruiterId: recruitersWithProfiles[0].recruiterProfile!.id,
        location: 'San Francisco, CA',
        category: 'Software Development',
        jobType: 'INTERNSHIP',
        workMode: 'REMOTE',
        experienceLevel: 'FRESHER',
        minSalary: 30000,
        maxSalary: 40000,
        salaryCurrency: 'USD',
        description: '3-month internship program for students or recent graduates interested in frontend development.',
        responsibilities: 'Build user interfaces, learn modern frameworks, work with senior developers',
        requirements: 'Currently pursuing or recently completed CS degree, basic knowledge of HTML/CSS/JS, eagerness to learn',
        benefits: 'Hands-on experience, mentorship, potential full-time offer',
        applicationDeadline: new Date('2026-11-15'),
        applicantCount: 45,
      },
    }),
  ])

  console.log(`✅ Created ${jobs.length} jobs`)

  // Create Applications
  const applications = await Promise.all([
    prisma.application.create({
      data: {
        jobId: jobs[0].id,
        candidateId: candidatesWithProfiles[0].candidateProfile!.id,
        status: 'UNDER_REVIEW',
        coverLetter: 'I am excited to apply for this position as it aligns perfectly with my experience.',
        expectedSalary: 150000,
        noticePeriod: '2 weeks',
      },
    }),
    prisma.application.create({
      data: {
        jobId: jobs[1].id,
        candidateId: candidatesWithProfiles[1].candidateProfile!.id,
        status: 'SHORTLISTED',
        coverLetter: 'My background in data science makes me a great fit for this role.',
        expectedSalary: 130000,
        noticePeriod: '1 month',
      },
    }),
    prisma.application.create({
      data: {
        jobId: jobs[2].id,
        candidateId: candidatesWithProfiles[2].candidateProfile!.id,
        status: 'INTERVIEW',
        coverLetter: 'I would love to bring my design expertise to your team.',
        expectedSalary: 95000,
        noticePeriod: '2 weeks',
      },
    }),
    prisma.application.create({
      data: {
        jobId: jobs[0].id,
        candidateId: candidatesWithProfiles[1].candidateProfile!.id,
        status: 'APPLIED',
        coverLetter: 'I am interested in transitioning to software development.',
        expectedSalary: 140000,
        noticePeriod: '1 month',
      },
    }),
    prisma.application.create({
      data: {
        jobId: jobs[3].id,
        candidateId: candidatesWithProfiles[3].candidateProfile!.id,
        status: 'SELECTED',
        coverLetter: 'This position is perfect for starting my career in finance.',
        expectedSalary: 70000,
        noticePeriod: 'Available immediately',
      },
    }),
    prisma.application.create({
      data: {
        jobId: jobs[4].id,
        candidateId: candidatesWithProfiles[4].candidateProfile!.id,
        status: 'REJECTED',
        coverLetter: 'I believe my experience qualifies me for this role.',
        expectedSalary: 150000,
        noticePeriod: '1 month',
      },
    }),
  ])

  console.log(`✅ Created ${applications.length} applications`)

  // Create Saved Jobs
  await Promise.all([
    prisma.savedJob.create({
      data: {
        jobId: jobs[1].id,
        candidateId: candidatesWithProfiles[0].candidateProfile!.id,
      },
    }),
    prisma.savedJob.create({
      data: {
        jobId: jobs[2].id,
        candidateId: candidatesWithProfiles[0].candidateProfile!.id,
      },
    }),
    prisma.savedJob.create({
      data: {
        jobId: jobs[0].id,
        candidateId: candidatesWithProfiles[2].candidateProfile!.id,
      },
    }),
  ])

  console.log('✅ Created saved jobs')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
