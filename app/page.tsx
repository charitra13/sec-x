'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { useContactForm } from './components/ContactFormProvider'


export default function Home() {
  const [isAboutVisible, setIsAboutVisible] = useState(false)
  const { openContactForm } = useContactForm()
  const aboutRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAboutVisible(entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    )

    const currentRef = aboutRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  const scrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="relative min-h-screen">
      {/* Fixed Animated Background */}
      <div className="fixed inset-0 z-0">
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10">
        <div className="w-full h-screen max-w-[1400px] mx-auto rounded-[32px] overflow-hidden">
          {/* Hero Section */}
          <div className="relative min-h-[400px] h-[calc(100vh-3rem)] flex items-center justify-center px-4 sm:px-8">
            {/* Central Content */}
            <div className="text-center max-w-4xl mt-[-1rem] sm:mt-0">
              <h1 className="text-[28px] sm:text-[48px] md:text-[64px] leading-tight font-light mb-3 sm:mb-4">
                <span className="text-white/40">Advanced Cybersecurity for</span> Digital Business
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/60 mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
                Comprehensive security solutions designed to protect, detect, and respond to cyber threats. Enhanced security posture, compliance, and resilience—all in one intelligent platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Link href="/about" className="bg-black/40 hover:bg-black/60 text-white/80 px-6 py-2.5 rounded-lg transition-colors border border-white/10 backdrop-blur-sm text-center">
                  Learn More
                </Link>
                <button 
                  onClick={openContactForm}
                  className="bg-white/10 hover:bg-white/20 text-white/80 px-6 py-2.5 rounded-lg transition-colors border border-white/10 backdrop-blur-sm text-center"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SecurityX Brief Section */}
        <div ref={aboutRef} id="about" className="w-full min-h-screen max-w-[1400px] mx-auto px-8 pt-36 pb-36 mt-36">
          <div className={`max-w-4xl mx-auto transition-all duration-1000 transform ${isAboutVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl font-light mb-12 text-center text-white">
              About SecurityX
            </h2>
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/5">
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                SecurityX is a trusted cybersecurity partner dedicated to protecting businesses from digital threats. Our comprehensive security solutions span threat detection, incident response, compliance management, and security awareness training.
              </p>
              <p className="text-lg text-white/80 leading-relaxed mb-12">
                We serve organizations from emerging startups to established enterprises, delivering tailored security strategies that build resilience and trust in today's digital landscape.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4">
                <div className={`text-center transition-all duration-700 delay-100 transform ${isAboutVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-white/90 font-medium mb-2">Protection</h3>
                  <p className="text-sm text-white/60">Advanced threat prevention and security hardening</p>
                </div>
                <div className={`text-center transition-all duration-700 delay-200 transform ${isAboutVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white/90 font-medium mb-2">Compliance</h3>
                  <p className="text-sm text-white/60">Regulatory compliance and risk management</p>
                </div>
                <div className={`text-center sm:col-span-2 lg:col-span-1 transition-all duration-700 delay-300 transform ${isAboutVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-white/90 font-medium mb-2">Response</h3>
                  <p className="text-sm text-white/60">Rapid incident response and recovery</p>
                </div>
              </div>
              <div className="mt-12 text-center">
                <Link href="/about" className="inline-flex items-center bg-white/10 hover:bg-white/20 text-white/80 hover:text-white px-5 py-2 rounded-lg transition-colors">
                  <span>Learn more about us</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>


    </main>
  )
}