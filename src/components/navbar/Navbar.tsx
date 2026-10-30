'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Briefcase, Building2, User, LogOut } from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user)
      })
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    window.location.href = '/'
  }

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">CareerHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-900 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link href="/jobs" className="text-gray-900 hover:text-blue-600 font-medium">
              Find Jobs
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'CANDIDATE' && (
                  <Link href="/candidate/dashboard">
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                {user.role === 'RECRUITER' && (
                  <Link href="/recruiter/dashboard">
                    <Button variant="ghost" size="sm">
                      <Building2 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
