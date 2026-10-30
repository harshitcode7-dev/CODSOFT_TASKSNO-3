'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building, MapPin, Calendar, ArrowRight } from 'lucide-react'
import Navbar from '@/components/navbar/Navbar'

export default function CandidateApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchApplications()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      if (!data.user || data.user.role !== 'CANDIDATE') {
        router.push('/login')
        return
      }
    } catch (error) {
      router.push('/login')
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications')
      const data = await response.json()
      if (data.applications) {
        setApplications(data.applications)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-blue-100 text-blue-800'
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-800'
      case 'SHORTLISTED':
        return 'bg-green-100 text-green-800'
      case 'INTERVIEW':
        return 'bg-purple-100 text-purple-800'
      case 'SELECTED':
        return 'bg-emerald-100 text-emerald-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusTimeline = (status: string) => {
    const stages = [
      { name: 'Applied', status: 'APPLIED' },
      { name: 'Under Review', status: 'UNDER_REVIEW' },
      { name: 'Shortlisted', status: 'SHORTLISTED' },
      { name: 'Interview', status: 'INTERVIEW' },
      { name: 'Selected', status: 'SELECTED' },
    ]

    const currentIndex = stages.findIndex((s) => s.status === status)

    return (
      <div className="flex items-center space-x-2 mt-4">
        {stages.map((stage, index) => (
          <div key={stage.status} className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full ${
                index <= currentIndex
                  ? 'bg-blue-600'
                  : 'bg-gray-300'
              }`}
            />
            {index < stages.length - 1 && (
              <div
                className={`w-8 h-0.5 ${
                  index < currentIndex
                    ? 'bg-blue-600'
                    : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">Track all your job applications</p>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No applications yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't applied to any jobs. Start exploring opportunities!
              </p>
              <Link href="/jobs">
                <Button>Browse Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">{application.job?.title}</h3>
                          <p className="text-gray-600">{application.job?.company?.name}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {application.job?.location}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Applied {new Date(application.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      {getStatusTimeline(application.status)}
                    </div>
                    <div className="flex flex-col items-end space-y-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {application.status.replace('_', ' ')}
                      </span>
                      <Link href={`/jobs/${application.jobId}`}>
                        <Button variant="outline" size="sm">
                          View Job
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
