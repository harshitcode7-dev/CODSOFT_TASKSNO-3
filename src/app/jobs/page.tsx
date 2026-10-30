'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, DollarSign, Clock, Building, Search, Filter, ChevronLeft, ChevronRight, Briefcase, X } from 'lucide-react'
import Navbar from '@/components/navbar/Navbar'

const JOB_TYPE_COLORS: Record<string, string> = {
  FULL_TIME: 'bg-green-100 text-green-700',
  PART_TIME: 'bg-blue-100 text-blue-700',
  INTERNSHIP: 'bg-yellow-100 text-yellow-700',
  CONTRACT: 'bg-purple-100 text-purple-700',
}
const WORK_MODE_COLORS: Record<string, string> = {
  REMOTE: 'bg-teal-100 text-teal-700',
  HYBRID: 'bg-orange-100 text-orange-700',
  ON_SITE: 'bg-gray-100 text-gray-700',
}

function CompanyInitial({ name }: { name: string }) {
  const colors = ['bg-blue-500','bg-violet-500','bg-emerald-500','bg-orange-500','bg-pink-500','bg-teal-500']
  const idx = name.charCodeAt(0) % colors.length
  return (
    <div className={`w-12 h-12 ${colors[idx]} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0`}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="skeleton w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
        <div className="skeleton h-3 w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-gray-50">
        <div className="skeleton h-3 w-20" />
        <div className="skeleton h-8 w-24 rounded-lg" />
      </div>
    </div>
  )
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    workMode: '',
    experienceLevel: '',
    sortBy: 'recent',
  })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => { fetchJobs() }, [filters, page])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ ...filters, page: page.toString(), limit: '9' })
      const res = await fetch(`/api/jobs?${params}`)
      const data = await res.json()
      setJobs(data.jobs || [])
      setTotal(data.pagination?.total || 0)
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(f => ({ ...f, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ search: '', location: '', jobType: '', workMode: '', experienceLevel: '', sortBy: 'recent' })
    setPage(1)
  }

  const activeFiltersCount = [filters.jobType, filters.workMode, filters.experienceLevel].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Find Your Dream Job</h1>
          <p className="text-gray-500">
            {total > 0 ? (
              <><span className="font-semibold text-blue-600">{total.toLocaleString()}</span> jobs available</>
            ) : 'Browse all available positions'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Job title, keyword or company…"
                value={filters.search}
                onChange={e => handleFilterChange('search', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchJobs()}
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Location…"
                value={filters.location}
                onChange={e => handleFilterChange('location', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchJobs()}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                activeFiltersCount > 0
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <button
              onClick={fetchJobs}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              Search
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid sm:grid-cols-3 gap-3 animate-fade-in">
              <select
                value={filters.jobType}
                onChange={e => handleFilterChange('jobType', e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Job Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
              </select>
              <select
                value={filters.workMode}
                onChange={e => handleFilterChange('workMode', e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Work Modes</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ON_SITE">On-site</option>
              </select>
              <select
                value={filters.experienceLevel}
                onChange={e => handleFilterChange('experienceLevel', e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Experience Levels</option>
                <option value="FRESHER">Fresher</option>
                <option value="ENTRY_LEVEL">Entry Level</option>
                <option value="MID_LEVEL">Mid Level</option>
                <option value="SENIOR_LEVEL">Senior Level</option>
                <option value="EXECUTIVE">Executive</option>
              </select>
              <select
                value={filters.sortBy}
                onChange={e => handleFilterChange('sortBy', e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="salary-high">Salary: High to Low</option>
                <option value="salary-low">Salary: Low to High</option>
              </select>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 px-3 py-2.5"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Job Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Briefcase className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-5">Try adjusting your search criteria or filters.</p>
            <button onClick={clearFilters} className="text-blue-600 hover:underline text-sm font-medium">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map(job => (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm card-hover flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <CompanyInitial name={job.company.name} />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">{job.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{job.company.name}</p>
                    </div>
                  </div>
                  <span className={`badge ${JOB_TYPE_COLORS[job.jobType] || 'bg-gray-100 text-gray-600'} shrink-0 ml-2`}>
                    {job.jobType.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400 shrink-0" />
                    {job.location}
                  </div>
                  {job.minSalary && job.maxSalary && (
                    <div className="flex items-center text-xs text-gray-500">
                      <DollarSign className="h-3.5 w-3.5 mr-1.5 text-gray-400 shrink-0" />
                      ${job.minSalary.toLocaleString()} – ${job.maxSalary.toLocaleString()} / yr
                    </div>
                  )}
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400 shrink-0" />
                    {job.experienceLevel.replace('_', ' ')}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className={`badge ${WORK_MODE_COLORS[job.workMode] || 'bg-gray-100 text-gray-600'}`}>
                      {job.workMode.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-400">
                    {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <Link href={`/jobs/${job.id}`}>
                    <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                      View Details →
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === p
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
