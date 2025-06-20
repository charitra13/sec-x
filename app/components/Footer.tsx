'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    // Don't render on specific pages if needed
    if (pathname === '/jobs') {
      setShouldRender(false)
      return
    }

    // For other pages, check for custom footer attribute as a fallback
    const hasCustomFooter = document.body.hasAttribute('data-custom-footer')
    setShouldRender(!hasCustomFooter)
  }, [pathname])

  if (!shouldRender) {
    return null
  }

  return (
    <footer className="relative z-10 mt-24 py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-orange-400 rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-white font-medium">SecurityX</span>
          </div>
          <div className="text-sm text-white/50">
            © 2024 SecurityX. Advanced cybersecurity for digital business.
          </div>
          <div className="flex space-x-6 text-sm text-white/60">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/team" className="hover:text-white transition-colors">Team</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 