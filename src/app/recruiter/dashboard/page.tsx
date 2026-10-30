'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Briefcase, Users, FileText, CheckCircle, Clock, ArrowRight, Building, Plus } from 'lucide-react'
import Navbar from '@/components/navbar/Navbar'

export default function RecruiterDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    shortlisted: 0,
    interviews: 0,
    selected: 0,
  })
  const [recentJobs, setRecentJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchDashboardData()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      if (!data.user || data.user.role !== 'RECRUITER') {
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
      const [jobsRes, applicationsRes] = await Promise.all([
        fetch('/api/jobs/recruiter'),
        fetch('/api/applications/recruiter'),
      ])

      const jobsData = await jobsRes.json()
      const applicationsData = await applicationsRes.json()

      if (jobsData.jobs) {
        setRecentJobs(jobsData.jobs.slice(0, 5))
        setStats((prev) => ({
          ...prev,
          activeJobs: jobsData.jobs.filter((j: any) => j.isActive).length,
        }))
      }

      if (applicationsData.applications) {
        const applications = applicationsData.applications
        setStats({
          activeJobs: jobsData.jobs?.filter((j: any) => j.isActive).length || 0,
          totalApplicants: applications.length,
          shortlisted: applications.filter((a: any) => a.status === 'SHORTLISTED').length,
          interviews: applications.filter((a: any) => a.status === 'INTERVIEW').length,
          selected: applications.filter((a: any) => a.status === 'SELECTED').length,
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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
            Welcome back, {user?.recruiterProfile?.name || 'Recruiter'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your job postings and track applicants
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Jobs</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{stats.activeJobs}</p>
                </div>
                <Briefcase className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applicants</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{stats.totalApplicants}</p>
                </div>
                <Users className="h-10 w-10 text-blue-600" />
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Interviews</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{stats.interviews}</p>
                </div>
                <Clock className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selected</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{stats.selected}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer opacity-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Plus className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Post a New Job</h3>
                  <p className="text-sm text-gray-600">Create a new job posting (Coming Soon)</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer opacity-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Manage Jobs</h3>
                  <p className="text-sm text-gray-600">View and edit your job postings (Coming Soon)</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Job Postings */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Job Postings</CardTitle>
              <Button variant="outline" size="sm" disabled>View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                You haven't posted any jobs yet.
                <span className="text-gray-400 ml-2">(Job posting feature coming soon)</span>
              </div>
            ) : (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.company?.name}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{job.applicantCount} applicants</span>
                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {job.isActive ? 'Active' : 'Closed'}
                      </span>
                      <Button size="sm" disabled>View Applicants</Button>
                    </div>
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
