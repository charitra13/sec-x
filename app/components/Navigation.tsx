'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isBlogPage = pathname.startsWith('/blog')

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
            <div className="w-8 h-8 flex bg-gradient-to-r from-red-400 to-orange-400 rounded-lg items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
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
            {isBlogPage ? (
              <Link 
                href="/login"
                className="glass-button px-4 py-2 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-300"
              >
                Log In
              </Link>
            ) : (
              <Link 
                href="/contact"
                className="glass-button px-4 py-2 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-300"
              >
                Contact
              </Link>
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
        {isBlogPage ? (
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="glass-button px-6 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-300"
          >
            Log In
          </Link>
        ) : (
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="glass-button px-6 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-300"
          >
            Contact
          </Link>
        )}
      </div>
    </nav>
  )
} 