'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Briefcase, User, Building2, LogOut, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => { if (data.user) setUser(data.user) })

    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    window.location.href = '/'
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/jobs', label: 'Find Jobs' },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100'
        : 'bg-white border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Career<span className="text-blue-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 font-medium text-sm transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-2">
                {user.role === 'CANDIDATE' && (
                  <Link href="/candidate/dashboard">
                    <Button variant="ghost" size="sm" className="text-gray-700">
                      <User className="h-4 w-4 mr-1.5" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                {user.role === 'RECRUITER' && (
                  <Link href="/recruiter/dashboard">
                    <Button variant="ghost" size="sm" className="text-gray-700">
                      <Building2 className="h-4 w-4 mr-1.5" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <div className="w-px h-5 bg-gray-200 mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-700 font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
              {user ? (
                <>
                  {user.role === 'CANDIDATE' && (
                    <Link href="/candidate/dashboard" className="flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium" onClick={() => setMobileOpen(false)}>
                      <User className="h-4 w-4 mr-2" /> Dashboard
                    </Link>
                  )}
                  {user.role === 'RECRUITER' && (
                    <Link href="/recruiter/dashboard" className="flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium" onClick={() => setMobileOpen(false)}>
                      <Building2 className="h-4 w-4 mr-2" /> Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex w-full items-center px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 font-medium">
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 font-medium" onClick={() => setMobileOpen(false)}>Sign In</Link>
                  <Link href="/register" className="flex items-center justify-center px-3 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
