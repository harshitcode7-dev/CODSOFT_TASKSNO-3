'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, DollarSign, Clock, Building, Users, Calendar, ArrowLeft, Bookmark } from 'lucide-react'
import Navbar from '@/components/navbar/Navbar'

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    expectedSalary: '',
    noticePeriod: '',
  })
  const [hasApplied, setHasApplied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    fetchJob()
    fetchUser()
  }, [resolvedParams.id])

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${resolvedParams.id}`)
      const data = await response.json()
      setJob(data.job)
    } catch (error) {
      console.error('Error fetching job:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      if (data.user) {
        setUser(data.user)
        checkApplicationStatus(data.user.id)
        checkSavedStatus(data.user.id)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const checkApplicationStatus = async (userId: string) => {
    try {
      const response = await fetch('/api/applications')
      const data = await response.json()
      if (data.applications) {
        const applied = data.applications.some((app: any) => app.jobId === resolvedParams.id)
        setHasApplied(applied)
      }
    } catch (error) {
      console.error('Error checking application status:', error)
    }
  }

  const checkSavedStatus = async (userId: string) => {
    try {
      const response = await fetch('/api/saved-jobs')
      const data = await response.json()
      if (data.savedJobs) {
        const saved = data.savedJobs.some((sj: any) => sj.jobId === resolvedParams.id)
        setIsSaved(saved)
      }
    } catch (error) {
      console.error('Error checking saved status:', error)
    }
  }

  const handleApply = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: resolvedParams.id,
          ...applicationData,
          expectedSalary: parseInt(applicationData.expectedSalary),
        }),
      })

      if (response.ok) {
        setHasApplied(true)
        setShowApplyModal(false)
        alert('Application submitted successfully!')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error applying:', error)
      alert('Failed to submit application')
    }
  }

  const handleSaveJob = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/saved-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: resolvedParams.id }),
      })

      if (response.ok) {
        setIsSaved(true)
        alert('Job saved successfully!')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to save job')
      }
    } catch (error) {
      console.error('Error saving job:', error)
      alert('Failed to save job')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">Loading job details...</div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">Job not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/jobs" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-900">{job.title}</CardTitle>
                      <p className="text-gray-600 mt-1">{job.company.name}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSaveJob}
                    disabled={isSaved}
                  >
                    <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-blue-600 text-blue-600' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-5 w-5 mr-2" />
                    {job.minSalary && job.maxSalary
                      ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
                      : 'Not specified'}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    {job.jobType.replace('_', ' ')}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    {job.experienceLevel.replace('_', ' ')}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    {job.applicantCount} applicants
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </CardContent>
            </Card>

            {job.responsibilities && (
              <Card>
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">{job.responsibilities}</p>
                </CardContent>
              </Card>
            )}

            {job.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                </CardContent>
              </Card>
            )}

            {job.benefits && (
              <Card>
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">{job.benefits}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{job.company.name}</h3>
                    <p className="text-sm text-gray-600">{job.company.industry}</p>
                  </div>
                </div>
                {job.company.description && (
                  <p className="text-sm text-gray-600">{job.company.description}</p>
                )}
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Visit Website
                  </a>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                {hasApplied ? (
                  <Button className="w-full" disabled>
                    Application Submitted
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setShowApplyModal(true)}
                  >
                    Apply Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>Apply for {job.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Cover Letter</label>
                  <textarea
                    className="w-full h-32 rounded-md border border-gray-300 p-3"
                    placeholder="Tell us why you're a great fit for this role..."
                    value={applicationData.coverLetter}
                    onChange={(e) =>
                      setApplicationData({ ...applicationData, coverLetter: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Expected Salary</label>
                  <Input
                    type="number"
                    placeholder="e.g., 120000"
                    value={applicationData.expectedSalary}
                    onChange={(e) =>
                      setApplicationData({ ...applicationData, expectedSalary: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notice Period</label>
                  <Input
                    placeholder="e.g., 2 weeks"
                    value={applicationData.noticePeriod}
                    onChange={(e) =>
                      setApplicationData({ ...applicationData, noticePeriod: e.target.value })
                    }
                  />
                </div>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowApplyModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleApply}>
                    Submit Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
