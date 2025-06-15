'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useContactForm } from './ContactFormProvider'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { openAssessmentForm } = useContactForm()

  return (
    <nav className="relative flex items-center justify-between px-4 sm:px-8 py-2 sm:py-3 mt-2.5 z-50">
      <Link href="/" className="flex items-center">
        <div className="text-2xl font-bold text-white">
          SecurityX
        </div>
      </Link>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden z-50 p-2 text-white/80 hover:text-white"
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
      <div className="hidden lg:flex items-center space-x-6">
        <Link href="/" className="text-sm text-white/80 hover:text-white transition-colors">
          Home
        </Link>
        <Link href="/about" className="text-sm text-white/80 hover:text-white transition-colors">
          About Us
        </Link>
        <Link href="/team" className="text-sm text-white/80 hover:text-white transition-colors">
          Team
        </Link>
        <Link href="/publications" className="text-sm text-white/80 hover:text-white transition-colors">
          Publications
        </Link>
        <button 
          onClick={openAssessmentForm}
          className="bg-white/90 hover:bg-white text-black px-5 py-2 rounded-lg transition-colors"
        >
          Get Security Assessment
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`
          fixed inset-0 bg-black/95 backdrop-blur-xl z-40 lg:hidden
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
          About Us
        </Link>
        <Link 
          href="/team" 
          className="text-lg text-white/80 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Team
        </Link>
        <Link 
          href="/publications" 
          className="text-lg text-white/80 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Publications
        </Link>
        <button
          onClick={() => {
            setIsMobileMenuOpen(false)
            openAssessmentForm()
          }}
          className="bg-white/90 hover:bg-white text-black px-5 py-2 rounded-lg transition-colors"
        >
          Get Security Assessment
        </button>
      </div>
    </nav>
  )
} 