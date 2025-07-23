'use client'

import Link from 'next/link'
import Image from 'next/image'
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
            <Image 
              src="/sec-x-logo.png" 
              alt="SecurityX Logo" 
              width={24} 
              height={24}
              className="w-6 h-6 object-contain"
            />
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