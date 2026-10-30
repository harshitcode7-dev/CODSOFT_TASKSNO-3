'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, FileText, Bookmark, Clock, CheckCircle, ArrowRight, TrendingUp, Search, Plus } from 'lucide-react'
import Navbar from '@/components/navbar/Navbar'

const STATUS_STYLES: Record<string, string> = {
  APPLIED: 'bg-blue-100 text-blue-700 border-blue-200',
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  SHORTLISTED: 'bg-green-100 text-green-700 border-green-200',
  INTERVIEW: 'bg-purple-100 text-purple-700 border-purple-200',
  SELECTED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
}

export default function CandidateDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ total: 0, underReview: 0, interviews: 0, shortlisted: 0 })
  const [recentApplications, setRecentApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (!data.user || data.user.role !== 'CANDIDATE') { router.push('/login'); return }
      setUser(data.user)
    } catch { router.push('/login') }
  }

  const fetchData = async () => {
    try {
      const res = await fetch('/api/applications')
      const data = await res.json()
      if (data.applications) {
        const apps = data.applications
        setRecentApplications(apps.slice(0, 5))
        setStats({
          total: apps.length,
          underReview: apps.filter((a: any) => a.status === 'UNDER_REVIEW').length,
          interviews: apps.filter((a: any) => a.status === 'INTERVIEW').length,
          shortlisted: apps.filter((a: any) => a.status === 'SHORTLISTED').length,
        })
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const STAT_CARDS = [
    { label: 'Total Applied', value: stats.total, icon: Briefcase, color: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Under Review', value: stats.underReview, icon: Clock, color: 'bg-yellow-50', iconColor: 'text-yellow-600' },
    { label: 'Interviews', value: stats.interviews, icon: CheckCircle, color: 'bg-purple-50', iconColor: 'text-purple-600' },
    { label: 'Shortlisted', value: stats.shortlisted, icon: TrendingUp, color: 'bg-green-50', iconColor: 'text-green-600' },
  ]

  const QUICK_ACTIONS = [
    { href: '/jobs', icon: Search, label: 'Browse Jobs', desc: 'Find your next opportunity', color: 'bg-blue-600' },
    { href: '/candidate/applications', icon: FileText, label: 'My Applications', desc: 'Track your progress', color: 'bg-violet-600' },
    { href: '/candidate/saved-jobs', icon: Bookmark, label: 'Saved Jobs', desc: 'View bookmarked jobs', color: 'bg-emerald-600' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading your dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.candidateProfile?.fullName?.split(' ')[0] || 'there'} 👋
              </h1>
              <p className="text-gray-500 mt-1">Track your applications and discover new opportunities</p>
            </div>
            <Link href="/jobs">
              <button className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm shadow-sm">
                <Plus className="h-4 w-4" />
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(card => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500 font-medium">{card.label}</span>
                <div className={`w-9 h-9 ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map(action => (
              <Link key={action.href} href={action.href}>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm card-hover flex items-center gap-4">
                  <div className={`w-11 h-11 ${action.color} rounded-xl flex items-center justify-center shrink-0`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{action.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
            <Link href="/candidate/applications">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group">
                View All
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </div>
          <div className="p-6">
            {recentApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-gray-500 mb-3">You haven't applied to any jobs yet.</p>
                <Link href="/jobs">
                  <button className="text-sm text-blue-600 hover:underline font-medium">Browse Jobs →</button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApplications.map(app => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{app.job?.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{app.job?.company?.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Applied {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <span className={`badge border ${STATUS_STYLES[app.status] || 'bg-gray-100 text-gray-600 border-gray-200'} ml-4 shrink-0`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
