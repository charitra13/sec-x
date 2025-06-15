'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Loading component for Suspense fallback
function ContactPageLoading() {
  return (
    <main className="relative min-h-screen">
      {/* Fixed Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50" />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="pt-24 pb-12 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl text-white mb-4">Contact Us</h1>
            <p className="text-white/70 text-lg">Get in touch with our cybersecurity experts</p>
          </div>
        </div>

        {/* Loading Form Section */}
        <div className="px-8 pb-24">
          <div className="max-w-2xl mx-auto">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <div className="animate-pulse space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-12 bg-white/10 rounded-lg"></div>
                  <div className="h-12 bg-white/10 rounded-lg"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-12 bg-white/10 rounded-lg"></div>
                  <div className="h-12 bg-white/10 rounded-lg"></div>
                </div>
                <div className="h-32 bg-white/10 rounded-lg"></div>
                <div className="h-12 bg-white/10 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
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
  const title = 'Contact Us'
  const subtitle = 'Get in touch with our cybersecurity experts'

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Phone validation function
  const validatePhone = (phone: string) => {
    // Allow various phone formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\+]?[(]?[\d\s\-\(\)]{10,}$/
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    return cleanPhone.length >= 10 && phoneRegex.test(cleanPhone)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Handle phone input - only allow numbers, spaces, dashes, parentheses, and plus sign
    if (name === 'phone') {
      const phoneValue = value.replace(/[^0-9\s\-\(\)\+]/g, '')
      setFormData({
        ...formData,
        [name]: phoneValue
      })
      
      // Validate phone
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

    // Handle other inputs normally
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Final validation before submit
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
    
    // Simulate form submission (same logic as original)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
    }, 1000)
  }

  if (submitSuccess) {
    return (
      <main className="relative min-h-screen flex items-center justify-center px-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl text-white mb-2">Thank you!</h2>
          <p className="text-white/70 mb-6">We&apos;ll get back to you within 24 hours.</p>
          <Link href="/" className="text-white/80 hover:text-white underline">
            Return to Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen">
      {/* Fixed Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50" />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="pt-24 pb-12 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl text-white mb-4">{title}</h1>
            <p className="text-white/70 text-lg">{subtitle}</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-24">
          <div className="max-w-2xl mx-auto">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none transition-colors ${
                        validationErrors.email 
                          ? 'border-red-400 focus:border-red-400' 
                          : 'border-white/20 focus:border-white/40'
                      }`}
                      placeholder="your.email@company.com"
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-400">{validationErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-white/80 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none transition-colors ${
                        validationErrors.phone 
                          ? 'border-red-400 focus:border-red-400' 
                          : 'border-white/20 focus:border-white/40'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {validationErrors.phone && (
                      <p className="mt-1 text-sm text-red-400">{validationErrors.phone}</p>
                    )}
                  </div>
                </div>

                {isAssessment && (
                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-white/80 mb-2">
                      Service Type *
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      required
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
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
                  <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors resize-none"
                    placeholder={isAssessment 
                      ? "Tell us about your current security setup and what you&apos;d like to assess..."
                      : "How can we help you with your cybersecurity needs?"
                    }
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-white/90 hover:bg-white text-black px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : (isAssessment ? 'Request Assessment' : 'Send Message')}
                  </button>
                  <Link
                    href="/"
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-center"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

// Main page component with Suspense boundary
export default function ContactPage() {
  return (
    <Suspense fallback={<ContactPageLoading />}>
      <ContactForm />
    </Suspense>
  )
} 