'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import UserMenu from './UserMenu'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout, loading } = useAuth()

  // Add escape key functionality for mobile menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isMobileMenuOpen])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <Image 
              src="/sec-x-logo.png" 
              alt="SecurityX Logo" 
              width={32} 
              height={32}
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-semibold tracking-tight">SecurityX</span>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden z-50 p-2 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 text-sm opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <Link href="/" className="text-white/60 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-white/60 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/team" className="text-white/60 hover:text-white transition-colors">
              Team
            </Link>
            <Link href="/blog" className="text-white/60 hover:text-white transition-colors">
              Blog
            </Link>
            <Link href="/publications" className="text-white/60 hover:text-white transition-colors">
              Publications
            </Link>
            {!loading && (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/contact"
                  className="glass-button px-4 py-2 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-300"
                >
                  Contact
                </Link>
                {isAuthenticated && user ? (
                  <UserMenu user={user} onLogout={logout} />
                ) : (
                  <Link 
                    href="/login"
                    className="glass-button px-4 py-2 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-300"
                  >
                    Log In
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`
          fixed inset-0 bg-black/95 backdrop-blur-xl z-40 md:hidden
          flex flex-col items-center justify-center space-y-6 
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      >
        <Link 
          href="/" 
          className="text-lg text-white/80 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className="text-lg text-white/80 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          About
        </Link>
        <Link 
          href="/team" 
          className="text-lg text-white/80 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Team
        </Link>
        <Link 
          href="/blog" 
          className="text-lg text-white/80 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Blog
        </Link>
        <Link 
          href="/publications" 
          className="text-lg text-white/80 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Publications
        </Link>
        <div className="flex flex-col space-y-4">
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="glass-button px-6 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-300"
          >
            Contact
          </Link>
          {!loading && (
            <>
              {isAuthenticated && user ? (
                <UserMenu user={user} onLogout={logout} isMobile={true} />
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="glass-button px-6 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-300"
                >
                  Log In
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 