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

  // Add escape key functionality and body scroll prevention for mobile menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      // Restore body scroll when menu is closed
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
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
            className="md:hidden z-[10000] relative p-2 text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
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
            {/* Publications link removed from navigation - page still accessible via direct URL */}
            {/* <Link href="/publications" className="text-white/60 hover:text-white transition-colors">
              Publications
            </Link> */}
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

      
      {/* Mobile Navigation Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[9999] md:hidden mobile-menu-overlay"
          style={{
            background: 'rgba(0, 0, 0, 0.99)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            animation: 'fadeIn 0.3s ease-in-out'
          }}
          onClick={(e) => {
            // Close menu when clicking on the background (not on menu items)
            if (e.target === e.currentTarget) {
              setIsMobileMenuOpen(false)
            }
          }}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8"
               onClick={(e) => e.stopPropagation()}
          >
        <div className="flex flex-col items-center space-y-6 mt-8">
          <Link 
            href="/" 
            className="text-xl font-medium text-white/90 hover:text-white transition-all duration-200 px-6 py-3 rounded-lg hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="text-xl font-medium text-white/90 hover:text-white transition-all duration-200 px-6 py-3 rounded-lg hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/team" 
            className="text-xl font-medium text-white/90 hover:text-white transition-all duration-200 px-6 py-3 rounded-lg hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Team
          </Link>
          <Link 
            href="/blog" 
            className="text-xl font-medium text-white/90 hover:text-white transition-all duration-200 px-6 py-3 rounded-lg hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blog
          </Link>
          {/* Publications link removed from mobile navigation - page still accessible via direct URL */}
          {/* <Link 
            href="/publications" 
            className="text-xl font-medium text-white/90 hover:text-white transition-all duration-200 px-6 py-3 rounded-lg hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Publications
          </Link> */}
        </div>
        <div className="flex flex-col items-center space-y-4 mt-8 pb-8">
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="glass-button px-8 py-4 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 backdrop-blur-xl"
          >
            Contact
          </Link>
          {!loading && (
            <>
              {isAuthenticated && user ? (
                <div className="pt-2">
                  <UserMenu user={user} onLogout={logout} isMobile={true} />
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="glass-button px-8 py-4 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 backdrop-blur-xl"
                >
                  Log In
                </Link>
              )}
            </>
          )}
        </div>
          </div>
        </div>
      )}
    </nav>
    </>
  )
} 