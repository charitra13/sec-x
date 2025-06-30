'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Country codes data for the dropdown
const COUNTRY_CODES = [
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States' },
  { code: '+1', country: 'CA', flag: '🇨🇦', name: 'Canada' },
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
  { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
  { code: '+86', country: 'CN', flag: '🇨🇳', name: 'China' },
  { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
  { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brazil' },
]

// Loading component for Suspense fallback
function ContactPageLoading() {
  return (
    <div className="relative min-h-screen bg-black font-geist pt-20">
      {/* Wave Visualizer Background */}
      <canvas className="fixed inset-0 w-full h-full -z-10" />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] p-4">
        <div className="w-full max-w-4xl">
          <div className="card-border overflow-hidden rounded-2xl flex flex-col lg:flex-row animate-pulse">
            <div className="w-full lg:w-1/2 p-8">
              <div className="w-full h-48 lg:h-64 rounded-xl bg-white/10 mb-6"></div>
              <div className="h-8 bg-white/10 rounded mb-2"></div>
              <div className="h-4 bg-white/10 rounded"></div>
            </div>
            <div className="hidden lg:block w-px bg-white/30"></div>
            <div className="block lg:hidden h-px bg-white/30"></div>
            <div className="w-full lg:w-1/2 p-8">
              <div className="space-y-4">
                <div className="h-12 bg-white/10 rounded-lg"></div>
                <div className="h-12 bg-white/10 rounded-lg"></div>
                <div className="h-12 bg-white/10 rounded-lg"></div>
                <div className="h-24 bg-white/10 rounded-lg"></div>
                <div className="h-12 bg-white/10 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Country Code Dropdown Component
function CountryCodeDropdown({ selectedCode, onSelectCode }: { 
  selectedCode: string, 
  onSelectCode: (code: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredCodes = COUNTRY_CODES.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.includes(searchTerm)
  )
  
  const selectedCountry = COUNTRY_CODES.find(c => c.code === selectedCode) || COUNTRY_CODES[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-3 glass border border-white/20 text-white rounded-lg focus:border-indigo-400 focus:outline-none transition min-w-[80px] w-full sm:w-auto"
      >
        <span className="mr-1">{selectedCountry.flag}</span>
        <span className="text-sm">{selectedCountry.code}</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full sm:w-64 bg-black/90 backdrop-blur-xl border border-white/30 rounded-lg z-50 max-h-64 overflow-hidden shadow-2xl">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 backdrop-blur border border-white/20 rounded text-white placeholder-white/50 text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCodes.map((country) => (
              <button
                key={`${country.code}-${country.country}`}
                type="button"
                onClick={() => {
                  onSelectCode(country.code)
                  setIsOpen(false)
                  setSearchTerm('')
                }}
                className="w-full flex items-center px-3 py-2 text-white hover:bg-white/20 transition text-sm text-left"
              >
                <span className="mr-2">{country.flag}</span>
                <span className="mr-2">{country.code}</span>
                <span>{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ContactForm component that uses useSearchParams
function ContactForm() {
  const searchParams = useSearchParams()
  const formType = searchParams.get('type') === 'assessment' ? 'assessment' : 'contact'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    countryCode: '+1',
    serviceType: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    phone: ''
  })

  const isAssessment = formType === 'assessment'

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Phone validation function
  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\+]?[(]?[\d\s\-\(\)]{10,}$/
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    return cleanPhone.length >= 10 && phoneRegex.test(cleanPhone)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Handle phone input
    if (name === 'phone') {
      const phoneValue = value.replace(/[^0-9\s\-\(\)\+]/g, '')
      setFormData({
        ...formData,
        [name]: phoneValue
      })
      
      if (phoneValue && !validatePhone(phoneValue)) {
        setValidationErrors(prev => ({
          ...prev,
          phone: 'Please enter a valid phone number'
        }))
      } else {
        setValidationErrors(prev => ({
          ...prev,
          phone: ''
        }))
      }
      return
    }

    // Handle email validation
    if (name === 'email') {
      setFormData({
        ...formData,
        [name]: value
      })
      
      if (value && !validateEmail(value)) {
        setValidationErrors(prev => ({
          ...prev,
          email: 'Please enter a valid email address'
        }))
      } else {
        setValidationErrors(prev => ({
          ...prev,
          email: ''
        }))
      }
      return
    }

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const emailError = formData.email && !validateEmail(formData.email) ? 'Please enter a valid email address' : ''
    const phoneError = formData.phone && !validatePhone(formData.phone) ? 'Please enter a valid phone number' : ''
    
    if (emailError || phoneError) {
      setValidationErrors({
        email: emailError,
        phone: phoneError
      })
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
    }, 1000)
  }

  if (submitSuccess) {
    return (
      <div className="relative min-h-screen bg-black font-geist pt-20">
        {/* Wave Visualizer Background */}
        <canvas id="visualizer" className="fixed inset-0 w-full h-full -z-10" />
        
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] p-4">
          <div className="text-center card-border rounded-2xl p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center inner-glow">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl text-white mb-2 font-semibold">Thank you!</h2>
            <p className="text-white/70 mb-6">We&apos;ll get back to you within 24 hours.</p>
            <Link 
              href="/" 
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition duration-200 transform hover:scale-[1.02] shadow-lg inline-block"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black font-geist pt-20">
      {/* Wave Visualizer Background */}
      <canvas id="visualizer" className="fixed inset-0 w-full h-full -z-10" />
      
      {/* Main Card */}
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] p-4">
        <div className="w-full relative max-w-4xl">
          <div className="relative card-border overflow-hidden rounded-2xl flex flex-col lg:flex-row animate-float">
            
            {/* Left Side - Visual/Branding */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center relative p-8">
              {/* Animated Visual */}
              <div className="w-full h-48 lg:h-64 rounded-xl gradient-border inner-glow overflow-hidden relative mb-6">
                {/* Animated grid background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full animate-pulse bg-grid"></div>
                </div>
                
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 250">
                  <defs>
                    <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{stopColor:'#4f46e5', stopOpacity: 0.8}} />
                      <stop offset="50%" style={{stopColor:'#3b82f6', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor:'#8b5cf6', stopOpacity: 0.8}} />
                    </linearGradient>
                  </defs>
                  
                  <g stroke="url(#connectionGradient)" strokeWidth="2" fill="none">
                    <path className="connector" d="M200,125 L120,80 M200,125 L280,80 M200,125 L120,170 M200,125 L280,170" />
                    <circle cx="200" cy="125" r="4" fill="#3b82f6" />
                    <circle cx="120" cy="80" r="3" fill="#4f46e5" />
                    <circle cx="280" cy="80" r="3" fill="#8b5cf6" />
                    <circle cx="120" cy="170" r="3" fill="#f59e0b" />
                    <circle cx="280" cy="170" r="3" fill="#ef4444" />
                  </g>
                </svg>
                
                {/* Floating feature icons */}
                <div className="absolute top-8 left-8 icon-float">
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center border border-indigo-400/30 inner-glow">
                    <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <div className="absolute top-8 right-8 icon-float">
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center border border-purple-400/30 inner-glow">
                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="absolute bottom-8 left-8 icon-float">
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center border border-orange-400/30 inner-glow">
                    <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <div className="absolute bottom-8 right-8 icon-float">
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center border border-blue-400/30 inner-glow">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                </div>
                
                {/* Central logo/brand */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-schema-pulse">
                  <div className="w-16 h-16 glass flex items-center justify-center inner-glow border-blue-400/50 border rounded-2xl">
                    <div className="text-2xl font-bold text-white">S</div>
                  </div>
                </div>
              </div>
              
              {/* Brand text */}
              <div className="text-center">
                <h2 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight mb-2">Get in Touch</h2>
                <p className="text-white/70 text-sm">
                  We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                </p>
              </div>
            </div>
            
            {/* Vertical divider */}
            <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            <div className="block lg:hidden h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
              <div className="max-w-sm mx-auto w-full">
                <span className="inline-block px-3 py-1 glass text-indigo-300 rounded-full text-xs font-medium mb-6 border border-indigo-400/30">
                  {isAssessment ? 'Security Assessment' : 'Contact Us'}
                </span>
                
                <h3 className="text-lg lg:text-xl font-medium text-white mb-6">Send Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 glass rounded-lg border border-white/20 text-white placeholder-white/50 focus:border-indigo-400 focus:outline-none transition" 
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 glass rounded-lg border text-white placeholder-white/50 focus:outline-none transition ${
                        validationErrors.email 
                          ? 'border-red-400 focus:border-red-400' 
                          : 'border-white/20 focus:border-indigo-400'
                      }`}
                      placeholder="you@example.com"
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-400">{validationErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Company</label>
                    <input 
                      type="text" 
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 glass rounded-lg border border-white/20 text-white placeholder-white/50 focus:border-indigo-400 focus:outline-none transition" 
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Phone</label>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <CountryCodeDropdown 
                        selectedCode={formData.countryCode}
                        onSelectCode={(code) => setFormData({...formData, countryCode: code})}
                      />
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full sm:flex-1 px-4 py-3 glass rounded-lg border text-white placeholder-white/50 focus:outline-none transition ${
                          validationErrors.phone 
                            ? 'border-red-400 focus:border-red-400' 
                            : 'border-white/20 focus:border-indigo-400'
                        }`}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    {validationErrors.phone && (
                      <p className="mt-1 text-sm text-red-400">{validationErrors.phone}</p>
                    )}
                  </div>

                  {isAssessment && (
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Service Type *</label>
                      <select
                        name="serviceType"
                        required
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 glass border border-white/20 rounded-lg text-white focus:outline-none focus:border-indigo-400 transition"
                      >
                        <option value="" className="bg-black">Select a service</option>
                        <option value="red-teaming" className="bg-black">Red Team Assessment</option>
                        <option value="penetration-testing" className="bg-black">Penetration Testing</option>
                        <option value="ai-security" className="bg-black">AI Security Assessment</option>
                        <option value="compliance-audit" className="bg-black">Compliance Audit</option>
                        <option value="incident-response" className="bg-black">Incident Response</option>
                        <option value="security-training" className="bg-black">Security Training</option>
                        <option value="other" className="bg-black">Other</option>
                      </select>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 glass rounded-lg border border-white/20 text-white placeholder-white/50 focus:border-indigo-400 focus:outline-none transition resize-none"
                      placeholder={isAssessment 
                        ? "Tell us about your current security setup and what you'd like to assess..."
                        : "How can we help you with your cybersecurity needs?"
                      }
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-white/60 text-sm">
                    Need immediate assistance? 
                    <Link href="/" className="text-indigo-400 hover:text-indigo-300 transition ml-1">
                      Call us
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function ContactPage() {
  return (
    <Suspense fallback={<ContactPageLoading />}>
      <ContactFormWithCanvas />
    </Suspense>
  )
}

// Wrapper component that includes canvas animation
function ContactFormWithCanvas() {
  // Canvas animation effect
  React.useEffect(() => {
    const canvas = document.getElementById('visualizer') as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0
    let animationId: number
    let waveData = Array(8).fill(0).map(() => ({
      value: Math.random() * 0.5 + 0.1,
      targetValue: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.01
    }))
    
    function resizeCanvas() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    function updateWaveData() {
      waveData.forEach(data => {
        if (Math.random() < 0.01) {
          data.targetValue = Math.random() * 0.7 + 0.1
        }
        const diff = data.targetValue - data.value
        data.value += diff * data.speed
      })
    }
    
    function draw() {
      if (!ctx) return
      
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < 8; i++) {
        const freq = waveData[i].value * 7.0
        ctx.beginPath()
        
        for (let x = 0; x < canvas.width; x += 1) {
          const normalizedX = (x / canvas.width) * 2 - 1
          let px = normalizedX + i * 0.04 + freq * 0.03
          let py = Math.sin(px * 10 + time) * Math.cos(px * 2) * freq * 0.1 * ((i + 1) / 8)
          const canvasY = (py + 1) * canvas.height / 2
          
          if (x === 0) {
            ctx.moveTo(x, canvasY)
          } else {
            ctx.lineTo(x, canvasY)
          }
        }
        
        const intensity = Math.min(1, freq * 0.3)
        const r = 79 + intensity * 100
        const g = 70 + intensity * 130
        const b = 229
        
        ctx.lineWidth = 1 + (i * 0.3)
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.6)`
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`
        ctx.shadowBlur = 5
        ctx.stroke()
        ctx.shadowBlur = 0
      }
    }
    
    function animate() {
      time += 0.02
      updateWaveData()
      draw()
      animationId = requestAnimationFrame(animate)
    }
    
    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return <ContactForm />
}

// Import React at the top level for useEffect
import React from 'react'