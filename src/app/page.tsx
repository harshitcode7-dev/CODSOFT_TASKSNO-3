'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Briefcase, MapPin, DollarSign, Clock, Users, Building, TrendingUp, ArrowRight, Search } from 'lucide-react'
import Navbar from '@/components/navbar/Navbar'

export default function HomePage() {
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs?limit=6')
      const data = await response.json()
      if (data.jobs) {
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find the Right Job. Build Your Future.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            CareerHub connects talented professionals with companies looking for their next great hire.
          </p>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Job title, keywords, or company"
                  className="pl-10 h-12"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Location"
                  className="pl-10 h-12"
                />
              </div>
              <Link href="/jobs">
                <Button size="lg" className="h-12 px-8">
                  Search Jobs
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/jobs">
              <Button size="lg" variant="outline">
                Find Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg">
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Registered Candidates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">5,000+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">15,000+</div>
              <div className="text-gray-600">Jobs Filled</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Popular Job Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Software Development', icon: Briefcase },
              { name: 'Data Science', icon: TrendingUp },
              { name: 'UI/UX Design', icon: Users },
              { name: 'Marketing', icon: Building },
              { name: 'Finance', icon: DollarSign },
              { name: 'Sales', icon: Briefcase },
              { name: 'Human Resources', icon: Users },
              { name: 'Customer Support', icon: Clock },
            ].map((category) => (
              <Link
                key={category.name}
                href="/jobs"
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <category.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="font-medium text-gray-900">{category.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
            <Link href="/jobs" className="text-blue-600 hover:underline">
              View all jobs →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-600">
                Loading featured jobs...
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    {job.minSalary && job.maxSalary && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {job.jobType.replace('_', ' ')} • {job.workMode.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <Link href={`/jobs/${job.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How CareerHub Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Create Your Profile', description: 'Sign up and build your professional profile' },
              { step: '2', title: 'Discover Opportunities', description: 'Browse thousands of jobs from top companies' },
              { step: '3', title: 'Apply for Jobs', description: 'Apply with one click and track your applications' },
              { step: '4', title: 'Get Hired', description: 'Connect with recruiters and land your dream job' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="h-8 w-8" />
                <span className="text-xl font-bold">CareerHub</span>
              </div>
              <p className="text-gray-400">Connect. Apply. Get Hired.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/jobs" className="hover:text-white">Find Jobs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Candidates</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register" className="hover:text-white">Create Profile</Link></li>
                <li><Link href="/jobs" className="hover:text-white">Browse Jobs</Link></li>
                <li><Link href="/login" className="hover:text-white">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Recruiters</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register" className="hover:text-white">Post a Job</Link></li>
                <li><Link href="/login" className="hover:text-white">Employer Login</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 CareerHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
