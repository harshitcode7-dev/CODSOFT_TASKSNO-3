export type UserRole = 'CANDIDATE' | 'RECRUITER' | 'ADMIN'

export type ApplicationStatus =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'SELECTED'
  | 'REJECTED'

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT'

export type WorkMode = 'REMOTE' | 'HYBRID' | 'ON_SITE'

export type ExperienceLevel =
  | 'FRESHER'
  | 'ENTRY_LEVEL'
  | 'MID_LEVEL'
  | 'SENIOR_LEVEL'
  | 'EXECUTIVE'

export interface User {
  id: string
  email: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface CandidateProfile {
  id: string
  userId: string
  fullName: string
  profilePhoto: string | null
  phone: string | null
  location: string
  professionalHeadline: string | null
  aboutMe: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  portfolioUrl: string | null
  resumeUrl: string | null
  resumeFileName: string | null
  createdAt: Date
  updatedAt: Date
}

export interface RecruiterProfile {
  id: string
  userId: string
  name: string
  companyId: string
  createdAt: Date
  updatedAt: Date
}

export interface Company {
  id: string
  name: string
  logo: string | null
  description: string | null
  industry: string | null
  companySize: string | null
  website: string | null
  location: string | null
  foundedYear: number | null
  createdAt: Date
  updatedAt: Date
}

export interface Job {
  id: string
  title: string
  companyId: string
  recruiterId: string
  location: string
  category: string | null
  jobType: JobType
  workMode: WorkMode
  experienceLevel: ExperienceLevel
  minSalary: number | null
  maxSalary: number | null
  salaryCurrency: string
  description: string
  responsibilities: string | null
  requirements: string | null
  benefits: string | null
  applicationDeadline: Date | null
  isActive: boolean
  applicantCount: number
  createdAt: Date
  updatedAt: Date
  company?: Company
}

export interface Application {
  id: string
  jobId: string
  candidateId: string
  status: ApplicationStatus
  coverLetter: string | null
  expectedSalary: number | null
  noticePeriod: string | null
  resumeUrl: string | null
  resumeFileName: string | null
  createdAt: Date
  updatedAt: Date
  job?: Job
  candidate?: CandidateProfile
}

export interface SavedJob {
  id: string
  jobId: string
  candidateId: string
  createdAt: Date
  job?: Job
}

export interface Skill {
  id: string
  name: string
  candidateId: string
  createdAt: Date
}

export interface Education {
  id: string
  degree: string
  field: string | null
  university: string
  graduationYear: number
  candidateId: string
  createdAt: Date
}

export interface Experience {
  id: string
  jobTitle: string
  company: string
  location: string | null
  startDate: Date
  endDate: Date | null
  current: boolean
  description: string | null
  candidateId: string
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: string
  read: boolean
  link: string | null
  createdAt: Date
}
