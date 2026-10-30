'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Briefcase, MapPin, DollarSign, Clock, Users, Building,
  TrendingUp, ArrowRight, Search, Star, CheckCircle,
  Code, BarChart2, Palette, Megaphone, PiggyBank, Headphones,
  ChevronRight, Zap, Shield, Globe
} from 'lucide-react'
import Navbar from '@/components/navbar/Navbar'

const CATEGORIES = [
  { name: 'Software Development', icon: Code, color: 'bg-blue-100 text-blue-600', count: '2,400+' },
  { name: 'Data Science', icon: BarChart2, color: 'bg-violet-100 text-violet-600', count: '1,200+' },
  { name: 'UI/UX Design', icon: Palette, color: 'bg-pink-100 text-pink-600', count: '800+' },
  { name: 'Marketing', icon: Megaphone, color: 'bg-orange-100 text-orange-600', count: '950+' },
  { name: 'Finance', icon: PiggyBank, color: 'bg-emerald-100 text-emerald-600', count: '700+' },
  { name: 'Human Resources', icon: Users, color: 'bg-teal-100 text-teal-600', count: '600+' },
  { name: 'Sales', icon: TrendingUp, color: 'bg-yellow-100 text-yellow-600', count: '1,100+' },
  { name: 'Customer Support', icon: Headphones, color: 'bg-red-100 text-red-600', count: '450+' },
]

const STATS = [
  { value: '10,000+', label: 'Active Jobs', icon: Briefcase },
  { value: '50,000+', label: 'Candidates', icon: Users },
  { value: '5,000+', label: 'Companies', icon: Building },
  { value: '15,000+', label: 'Jobs Filled', icon: CheckCircle },
]

const STEPS = [
  { step: '01', title: 'Create Your Profile', desc: 'Sign up and build your professional profile to get noticed by top employers.', icon: Users, color: 'bg-blue-600' },
  { step: '02', title: 'Discover Opportunities', desc: 'Browse thousands of curated jobs from verified companies worldwide.', icon: Search, color: 'bg-violet-600' },
  { step: '03', title: 'Apply in One Click', desc: 'Apply instantly with your saved profile and track every application.', icon: Zap, color: 'bg-emerald-600' },
  { step: '04', title: 'Get Hired', desc: 'Connect with recruiters and land your dream job faster.', icon: CheckCircle, color: 'bg-orange-500' },
]

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

function SkeletonJobCard() {
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
      </div>
      <div className="skeleton h-9 w-full rounded-lg" />
    </div>
  )
}

function CompanyInitial({ name }: { name: string }) {
  const colors = ['bg-blue-500','bg-violet-500','bg-emerald-500','bg-orange-500','bg-pink-500','bg-teal-500']
  const idx = name.charCodeAt(0) % colors.length
  return (
    <div className={`w-12 h-12 ${colors[idx]} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export default function HomePage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    fetch('/api/jobs?limit=6')
      .then(r => r.json())
      .then(d => { if (d.jobs) setJobs(d.jobs) })
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (location) params.set('location', location)
    window.location.href = `/jobs?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero-gradient py-20 px-4 relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Zap className="h-3.5 w-3.5" />
            10,000+ jobs added this month
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
            Find the Right Job.{' '}
            <span className="gradient-text">Build Your Future.</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            CareerHub connects talented professionals with companies looking for their next great hire. Start your journey today.
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100"
                  placeholder="Job title, keyword or company…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100"
                  placeholder="Location…"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors shadow-sm whitespace-nowrap"
              >
                Search Jobs
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mt-6">
            {['Remote', 'Full Time', 'Internship', 'Tech'].map(tag => (
              <Link
                key={tag}
                href={`/jobs?search=${tag}`}
                className="text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full border border-gray-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.label} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-3 group-hover:bg-blue-100 transition-colors">
                  <s.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Popular Job Categories</h2>
            <p className="text-gray-500">Explore opportunities across industries</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                href={`/jobs?search=${encodeURIComponent(cat.name)}`}
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-md card-hover text-center group"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${cat.color} rounded-xl mb-3 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{cat.name}</div>
                <div className="text-xs text-gray-400">{cat.count} jobs</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Jobs ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Jobs</h2>
              <p className="text-gray-500">Hand-picked opportunities from top companies</p>
            </div>
            <Link href="/jobs" className="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group">
              View all jobs
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonJobCard key={i} />)
              : jobs.length === 0
                ? (
                  <div className="col-span-full text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No jobs found right now. Check back soon!</p>
                  </div>
                )
                : jobs.map(job => (
                  <div key={job.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm card-hover">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <CompanyInitial name={job.company.name} />
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{job.title}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{job.company.name}</p>
                        </div>
                      </div>
                      <span className={`badge ${(JOB_TYPE_COLORS[job.jobType]) || 'bg-gray-100 text-gray-600'}`}>
                        {job.jobType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="space-y-2 mb-5">
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
                      <div className="flex items-center gap-2">
                        <span className={`badge ${(WORK_MODE_COLORS[job.workMode]) || 'bg-gray-100 text-gray-600'}`}>
                          {job.workMode.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-xs text-gray-400">
                        {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <Link href={`/jobs/${job.id}`}>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center group">
                          View Details
                          <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
            }
          </div>

          <div className="text-center mt-10">
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold">
                Browse All Jobs
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How CareerHub Works</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Land your dream job in four simple steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((item, i) => (
              <div key={item.step} className="text-center relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+2rem)] right-0 h-0.5 bg-gradient-to-r from-gray-200 to-gray-100" />
                )}
                <div className={`w-14 h-14 ${item.color} text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="text-xs font-bold text-gray-400 tracking-widest mb-2">STEP {item.step}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <Shield className="h-10 w-10 text-blue-200 mx-auto mb-5" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Next Opportunity?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">Join thousands of candidates who found their dream jobs on CareerHub. It's free to get started.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-lg">
                Create Free Account
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold">
                <Globe className="h-4 w-4 mr-2" />
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-white pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold">Career<span className="text-blue-400">Hub</span></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Connect. Apply. Get Hired. The fastest way to land your dream job.</p>
            </div>
            {[
              {
                title: 'For Candidates',
                links: [
                  { href: '/jobs', label: 'Browse Jobs' },
                  { href: '/register', label: 'Create Profile' },
                  { href: '/login', label: 'Sign In' },
                ]
              },
              {
                title: 'For Recruiters',
                links: [
                  { href: '/register', label: 'Post a Job' },
                  { href: '/login', label: 'Employer Login' },
                ]
              },
              {
                title: 'Company',
                links: [
                  { href: '/', label: 'About Us' },
                  { href: '/', label: 'Contact' },
                  { href: '/', label: 'Privacy Policy' },
                ]
              }
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} CareerHub. All rights reserved.</p>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              Verified & Secure Platform
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
