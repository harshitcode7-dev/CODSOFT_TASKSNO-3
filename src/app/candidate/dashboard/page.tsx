'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Briefcase, FileText, Bookmark, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import Navbar from '@/components/navbar/Navbar'

export default function CandidateDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    total: 0,
    underReview: 0,
    interviews: 0,
    shortlisted: 0,
  })
  const [recentApplications, setRecentApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchDashboardData()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      if (!data.user || data.user.role !== 'CANDIDATE') {
        router.push('/login')
        return
      }
      setUser(data.user)
    } catch (error) {
      router.push('/login')
    }
  }

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/applications')
      const data = await response.json()
      if (data.applications) {
        setRecentApplications(data.applications.slice(0, 5))
        setStats({
          total: data.applications.length,
          underReview: data.applications.filter((a: any) => a.status === 'UNDER_REVIEW').length,
          interviews: data.applications.filter((a: any) => a.status === 'INTERVIEW').length,
          shortlisted: data.applications.filter((a: any) => a.status === 'SHORTLISTED').length,
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.candidateProfile?.fullName || 'Candidate'}!
          </h1>
          <p className="text-gray-600 mt-2">Track your job applications and discover new opportunities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{stats.total}</p>
                </div>
                <Briefcase className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Under Review</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{stats.underReview}</p>
                </div>
                <Clock className="h-10 w-10 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Interviews</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{stats.interviews}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Shortlisted</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{stats.shortlisted}</p>
                </div>
                <FileText className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/jobs">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Browse Jobs</h3>
                    <p className="text-sm text-gray-600">Find your next opportunity</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/candidate/applications">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">My Applications</h3>
                    <p className="text-sm text-gray-600">Track your progress</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/candidate/saved-jobs">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Bookmark className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Saved Jobs</h3>
                    <p className="text-sm text-gray-600">View bookmarked jobs</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Applications</CardTitle>
              <Link href="/candidate/applications">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                You haven't applied to any jobs yet.
                <Link href="/jobs" className="text-blue-600 hover:underline ml-2">
                  Browse jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{application.job?.title}</h3>
                      <p className="text-sm text-gray-600">{application.job?.company?.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
