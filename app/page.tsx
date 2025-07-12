'use client'

import Link from 'next/link'
import { useEffect, useState, useRef, useCallback } from 'react'

export default function Home() {
  const [currentCard, setCurrentCard] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Card stack functionality
  const updateDots = (cardNumber: number) => {
    const dots = document.querySelectorAll('.nav-dot')
    dots.forEach((dot, index) => {
      if (index === cardNumber - 1) {
        dot.className = 'nav-dot w-2 h-2 rounded-full bg-blue-400 transition-all duration-300 scale-125'
      } else {
        dot.className = 'nav-dot w-2 h-2 rounded-full bg-white/30 hover:bg-white/50 transition-all duration-300'
      }
    })
  }

  const setActiveCard = (cardNumber: number) => {
    if (isAnimating || cardNumber === currentCard) return
    
    setIsAnimating(true)
    const container = document.getElementById('services-cards')
    if (container) {
      // Preserve existing classes and only update the active card class
      const existingClasses = container.className.split(' ').filter(cls => 
        !cls.startsWith('card-') || cls === 'card-stack'
      )
      container.className = `${existingClasses.join(' ')} card-${cardNumber}-active`
      setCurrentCard(cardNumber)
      updateDots(cardNumber)
    }
    
    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  // Manual navigation functions
  const goToPreviousCard = () => {
    if (isAnimating || !isInitialized) return
    const prevCard = currentCard === 1 ? 4 : currentCard - 1
    setActiveCard(prevCard)
    resetAutoRotation()
  }

  const goToNextCard = () => {
    if (isAnimating || !isInitialized) return
    const nextCard = currentCard === 4 ? 1 : currentCard + 1
    setActiveCard(nextCard)
    resetAutoRotation()
  }

  // Reset auto-rotation timer
  const resetAutoRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (isInitialized) {
      startAutoRotation()
    }
  }

  // Start auto-rotation
  const startAutoRotation = useCallback(() => {
    if (!isInitialized) return
    
    intervalRef.current = setInterval(() => {
      if (!isAnimating) {
        setCurrentCard(prev => {
          const nextCard = prev === 4 ? 1 : prev + 1
          // Use requestAnimationFrame to ensure proper timing
          requestAnimationFrame(() => {
            setActiveCard(nextCard)
          })
          return nextCard
        })
      }
    }, 5000)
  }, [isAnimating, isInitialized])

  // Initialize the component after the fade-in animation completes
  useEffect(() => {
    // Wait for the initial fade-in animation to complete
    // (0.2s delay + 0.8s duration = 1s total)
    initTimeoutRef.current = setTimeout(() => {
      setIsInitialized(true)
    }, 1200) // Add a small buffer to ensure animation is complete

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
    }
  }, [])

  // Start auto-rotation only after initialization
  useEffect(() => {
    if (isInitialized) {
      startAutoRotation()
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isInitialized, startAutoRotation])

  return (
    <main className="relative min-h-screen pt-16">
      <div className="max-w-7xl w-full mx-auto px-8 pt-8">
        
        {/* Center: Services Card Stack - Now First */}
        <div className="flex flex-col items-center mb-16">
          <div className="relative flex items-center justify-center w-full">
            {/* Left Arrow Button */}
            <button
              onClick={goToPreviousCard}
              disabled={isAnimating || !isInitialized}
              className="absolute left-1 sm:left-2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed opacity-0 animate-fade-in"
              style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
              aria-label="Previous card"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>

            {/* Card Stack */}
            <section id="services-cards" className="card-stack card-1-active opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            
            {/* Card 1: Penetration Testing */}
            <article className="card card-1 relative h-[32rem] glass rounded-2xl shadow-2xl">
              <div className="h-full flex flex-col p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-400">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Expert Testing</span>
                  </div>
                  <span className="text-sm font-bold text-green-400">OSCP Certified</span>
                </div>
                
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white">
                      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                      <path d="m8.5 8.5 7 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight mb-2">Penetration Testing</h3>
                  <p className="text-sm text-white/60 mb-8">Advanced security assessments</p>
                  
                  <div className="space-y-4 mb-8 w-full max-w-xs">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Success Rate</span>
                      <span className="font-semibold text-green-400">100%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Vulnerabilities Found</span>
                      <span className="font-semibold">1000+</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-red-500 to-orange-600 h-2 rounded-full transition-all duration-500" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
                
                <Link href="/contact" className="w-full py-3 px-4 glass rounded-xl text-white hover:bg-white/10 transition-all duration-300 font-medium text-center block">
                  Learn More
                </Link>
              </div>
            </article>

            {/* Card 2: AI Security */}
            <article className="card card-2 relative h-[32rem] glass rounded-2xl shadow-2xl">
              <div className="h-full flex flex-col p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-purple-400">
                      <path d="M12 2v20M2 12h20" />
                      <path d="m19.07 4.93-2.12 2.12M6.05 6.05l2.12 2.12m-.01 7.66-2.12 2.12M17.01 17.99l2.12 2.12" />
                    </svg>
                    <span className="text-xs font-medium text-white/60 uppercase tracking-wider">AI Security</span>
                  </div>
                  <span className="text-sm font-bold text-green-400">Free Tool</span>
                </div>
                
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white">
                      <path d="M12 2v20M2 12h20" />
                      <path d="m19.07 4.93-2.12 2.12M6.05 6.05l2.12 2.12m-.01 7.66-2.12 2.12M17.01 17.99l2.12 2.12" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-1">AI Security</h3>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">Assessment</h3>
                  <p className="text-sm text-white/60 mb-8">Next-gen AI protection</p>
                  
                  <div className="space-y-4 mb-8 w-full max-w-xs">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">AI Systems Tested</span>
                      <span className="font-semibold">50+</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Innovation Score</span>
                      <span className="font-semibold text-green-400">100%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
                
                <Link href="/contact" className="w-full py-3 px-4 glass rounded-xl text-white hover:bg-white/10 transition-all duration-300 font-medium text-center block">
                  Get In Touch
                </Link>
              </div>
            </article>

            {/* Card 3: Red Teaming */}
            <article className="card card-3 relative h-[32rem] glass rounded-2xl shadow-2xl">
              <div className="h-full flex flex-col p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-400">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                    <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Red Team</span>
                  </div>
                  <span className="text-sm font-bold text-green-400">Elite Team</span>
                </div>
                
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight mb-2">Red Teaming</h3>
                  <p className="text-sm text-white/60 mb-8">Advanced adversary simulation</p>
                  
                  <div className="space-y-4 mb-8 w-full max-w-xs">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Campaigns Executed</span>
                      <span className="font-semibold">25+</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Success Rate</span>
                      <span className="font-semibold text-green-400">95%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-teal-600 h-2 rounded-full transition-all duration-500" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
                
                <Link href="/contact" className="w-full py-3 px-4 glass rounded-xl text-white hover:bg-white/10 transition-all duration-300 font-medium text-center block">
                  Get Started
                </Link>
              </div>
            </article>

            {/* Card 4: Training */}
            <article className="card card-4 relative h-[32rem] glass rounded-2xl shadow-2xl">
              <div className="h-full flex flex-col p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-orange-400">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Free Training</span>
                  </div>
                  <span className="text-sm font-bold text-green-400">Free</span>
                </div>
                
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight mb-2">Free Training</h3>
                  <p className="text-sm text-white/60 mb-8">Community education</p>
                  
                  <div className="space-y-4 mb-8 w-full max-w-xs">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Students Trained</span>
                      <span className="font-semibold">500+</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Course Rating</span>
                      <span className="font-semibold text-green-400">4.9/5</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-500" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                </div>
                
                <Link href="/contact" className="w-full py-3 px-4 glass rounded-xl text-white hover:bg-white/10 transition-all duration-300 font-medium text-center block">
                  Join Training
                </Link>
              </div>
            </article>
          </section>

          {/* Right Arrow Button */}
          <button
            onClick={goToNextCard}
            disabled={isAnimating || !isInitialized}
            className="absolute right-1 sm:right-2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed opacity-0 animate-fade-in"
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
            aria-label="Next card"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

                  {/* Navigation Dots */}
          <div className="flex space-x-3 opacity-0 animate-fade-in mb-8 mt-2.5" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          <button onClick={() => { setActiveCard(1); resetAutoRotation(); }} className="nav-dot w-2 h-2 rounded-full bg-blue-400 transition-all duration-300 scale-125" disabled={!isInitialized}></button>
          <button onClick={() => { setActiveCard(2); resetAutoRotation(); }} className="nav-dot w-2 h-2 rounded-full bg-white/30 hover:bg-white/50 transition-all duration-300" disabled={!isInitialized}></button>
          <button onClick={() => { setActiveCard(3); resetAutoRotation(); }} className="nav-dot w-2 h-2 rounded-full bg-white/30 hover:bg-white/50 transition-all duration-300" disabled={!isInitialized}></button>
          <button onClick={() => { setActiveCard(4); resetAutoRotation(); }} className="nav-dot w-2 h-2 rounded-full bg-white/30 hover:bg-white/50 transition-all duration-300" disabled={!isInitialized}></button>
        </div>
              </div>

        {/* Header Section - Now Below Cards */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-sm uppercase tracking-widest text-white/60 font-medium">SecurityX • Founded 2023 • Elite Cybersecurity</p>
          </div>
          
          <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-medium leading-tight tracking-tighter mb-4">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                Advanced Cybersecurity for
              </span>
              <span className="block bg-clip-text italic text-transparent font-instrument-serif bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Digital Business
              </span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-3xl mx-auto">
              Comprehensive security solutions designed to protect, detect, and respond to cyber threats. Enhanced security posture, compliance, and resilience—all in one intelligent platform.
            </p>
          </div>
        </div>

        {/* Features List - Now Below Header */}
        <div className="text-center mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
            
            {/* Feature Card 1: Penetration Testing */}
            <div className="glass rounded-xl p-6 flex items-center space-x-4 hover:bg-white/5 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
              </div>
              <span className="text-white/80 text-sm sm:text-base font-medium">Expert penetration testing and red team services</span>
            </div>

            {/* Feature Card 2: AI Security */}
            <div className="glass rounded-xl p-6 flex items-center space-x-4 hover:bg-white/5 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
              </div>
              <span className="text-white/80 text-sm sm:text-base font-medium">Cutting-edge AI security assessments</span>
            </div>

            {/* Feature Card 3: Training */}
            <div className="glass rounded-xl p-6 flex items-center space-x-4 hover:bg-white/5 transition-all duration-300">
              <div className="w-12 h-12 bg-pink-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-pink-400 rounded-full"></div>
              </div>
              <span className="text-white/80 text-sm sm:text-base font-medium">Free cybersecurity training programs</span>
            </div>

            {/* Feature Card 4: Recognition */}
            <div className="glass rounded-xl p-6 flex items-center space-x-4 hover:bg-white/5 transition-all duration-300">
              <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              </div>
              <span className="text-white/80 text-sm sm:text-base font-medium">Hall of Fame recognition from Google & Mastercard</span>
            </div>

          </div>
        </div>

        {/* CTA Section */}
        <div className="opacity-0 animate-fade-in text-center mt-16 mb-16" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-white">Ready to Secure Your Digital Assets?</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Connect with our expert team and get the cybersecurity protection your business deserves. 
              Join organizations who trust us with their digital security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact" className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                Get Security Assessment
              </Link>
              <Link href="/about" className="px-8 py-3 glass rounded-xl text-white hover:bg-white/10 transition-all duration-300 font-medium">
                Learn About Our Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}