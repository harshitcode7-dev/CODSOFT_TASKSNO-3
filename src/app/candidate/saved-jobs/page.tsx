'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building, MapPin, DollarSign, Clock, Bookmark, X } from 'lucide-react'
import Navbar from '@/components/navbar/Navbar'

export default function CandidateSavedJobsPage() {
  const router = useRouter()
  const [savedJobs, setSavedJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchSavedJobs()
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

  const fetchSavedJobs = async () => {
    try {
      const response = await fetch('/api/saved-jobs')
      const data = await response.json()
      if (data.savedJobs) {
        setSavedJobs(data.savedJobs)
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (savedJobId: string) => {
    try {
      await fetch(`/api/saved-jobs/${savedJobId}`, { method: 'DELETE' })
      setSavedJobs(savedJobs.filter((sj) => sj.id !== savedJobId))
    } catch (error) {
      console.error('Error removing saved job:', error)
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
          <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="text-gray-600 mt-2">Jobs you've bookmarked for later</p>
        </div>

        {savedJobs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No saved jobs</h3>
              <p className="text-gray-600 mb-6">
                Save jobs to view them later. Start exploring opportunities!
              </p>
              <Link href="/jobs">
                <Button>Browse Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((savedJob) => (
              <Card key={savedJob.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{savedJob.job?.title}</h3>
                        <p className="text-sm text-gray-600">{savedJob.job?.company?.name}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(savedJob.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {savedJob.job?.location}
                    </div>
                    {savedJob.job?.minSalary && savedJob.job?.maxSalary && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        ${savedJob.job.minSalary.toLocaleString()} - ${savedJob.job.maxSalary.toLocaleString()}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {savedJob.job?.jobType.replace('_', ' ')} • {savedJob.job?.workMode.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Saved {new Date(savedJob.createdAt).toLocaleDateString()}
                    </span>
                    <Link href={`/jobs/${savedJob.jobId}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
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
