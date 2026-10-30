'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, Eye, EyeOff, Mail, Lock, User, MapPin, Building2, Globe, ArrowRight, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<'CANDIDATE' | 'RECRUITER'>('CANDIDATE')
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    fullName: '', location: '',
    name: '', companyName: '', companyWebsite: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed'); return }
      if (data.user.role === 'CANDIDATE') router.push('/candidate/dashboard')
      else if (data.user.role === 'RECRUITER') router.push('/recruiter/dashboard')
    } catch { setError('An error occurred. Please try again.') }
    finally { setLoading(false) }
  }

  const Field = ({ icon: Icon, label, id, type = 'text', placeholder, value, onChange, required = false }: any) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} required={required}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-violet-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CareerHub</span>
          </Link>
        </div>
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Start your career journey today</h2>
            <p className="text-blue-100 text-lg">Join 50,000+ professionals already on CareerHub.</p>
          </div>
          <div className="space-y-4">
            {[
              'Free to join — no credit card needed',
              'Apply to jobs with one click',
              'Get notified of new matching jobs',
              'Track all your applications in one place',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-blue-200 shrink-0" />
                <span className="text-blue-100">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-300 text-sm relative z-10">© {new Date().getFullYear()} CareerHub</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8 animate-fade-in">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Career<span className="text-blue-600">Hub</span></span>
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
            <p className="text-gray-500">Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign in</Link>
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            {(['CANDIDATE', 'RECRUITER'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  role === r
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {r === 'CANDIDATE' ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                {r === 'CANDIDATE' ? 'Job Seeker' : 'Recruiter'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field icon={Mail} label="Email address" id="email" type="email" placeholder="you@example.com"
              value={formData.email} onChange={(e: any) => setFormData({ ...formData, email: e.target.value })} required />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters"
                  value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password" placeholder="••••••••"
                  value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {role === 'CANDIDATE' ? (
              <>
                <Field icon={User} label="Full Name" id="fullName" placeholder="John Doe"
                  value={formData.fullName} onChange={(e: any) => setFormData({ ...formData, fullName: e.target.value })} required />
                <Field icon={MapPin} label="Location" id="location" placeholder="New York, NY"
                  value={formData.location} onChange={(e: any) => setFormData({ ...formData, location: e.target.value })} required />
              </>
            ) : (
              <>
                <Field icon={User} label="Your Name" id="name" placeholder="John Doe"
                  value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} required />
                <Field icon={Building2} label="Company Name" id="companyName" placeholder="Acme Inc"
                  value={formData.companyName} onChange={(e: any) => setFormData({ ...formData, companyName: e.target.value })} required />
                <Field icon={Globe} label="Company Website (optional)" id="companyWebsite" type="url" placeholder="https://acme.com"
                  value={formData.companyWebsite} onChange={(e: any) => setFormData({ ...formData, companyWebsite: e.target.value })} />
              </>
            )}

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">!</div>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm mt-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account…</>
              ) : (
                <>Create Account <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            By signing up, you agree to our{' '}
            <Link href="/" className="underline hover:text-gray-600">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/" className="underline hover:text-gray-600">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
