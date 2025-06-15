'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'


export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <main className="relative">
      {/* Animated Background */}

      <div className="w-full min-h-screen max-w-[1400px] mx-auto px-8 py-24 relative z-10">
        <div className={`max-w-4xl mx-auto transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-5xl mb-12 text-center text-white">
            About Sec-X
          </h1>
          
          {/* Our Story Section */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/5 mb-12">
            <h2 className="text-2xl mb-6 text-white/90">Our Story</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              Founded in 2023 in Indore, Madhya Pradesh, Sec-X is a dedicated cybersecurity firm that provides exceptional security research services. We emerged from the growing need for specialized red teaming and penetration testing solutions, with our team of expert security researchers bringing deep expertise in their respective fields of interest.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              As a compact but highly skilled team of 2-10 cybersecurity professionals, we focus on delivering cutting-edge security solutions while also providing free cybersecurity training to help build a more secure digital community. Our commitment to excellence and knowledge sharing sets us apart in the cybersecurity landscape.
            </p>
          </div>

          {/* Our Vision Section */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/5 mb-12">
            <h2 className="text-2xl mb-6 text-white/90">Our Vision & Innovation</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              We&apos;re committed to staying ahead of the cybersecurity curve, with a special focus on AI Security and advanced penetration testing. As the technology landscape evolves, we&apos;re doubling down on AI Security to ensure that the systems shaping tomorrow are secure today. We&apos;re currently developing a FREE tool to help organizations assess the security of their AI systems, making advanced security accessible to all.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl text-white/90 font-medium mb-2">Red Teaming</h3>
                <p className="text-white/60">
                  Specialized red team exercises to test and improve your organization&apos;s security posture.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl text-white/90 font-medium mb-2">AI Security</h3>
                <p className="text-white/60">
                  Cutting-edge AI security assessments and tools to protect AI systems from emerging threats.
                </p>
              </div>
            </div>
          </div>

          {/* Our Team Section */}
          <div className={`bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/5 mb-12 transition-all duration-700 delay-400 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-2xl mb-6 text-white/90">Our Expert Team</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              Led by industry veterans like Nagendra Tiwari, our team comprises dedicated cybersecurity experts with prestigious certifications including OSCP, eWPTXv2, CRTP, and Security+. Each member brings specialized knowledge in ethical hacking, penetration testing, and advanced security research.
            </p>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              Our compact but highly skilled team of security researchers is recognized in the Hall of Fame at major organizations like Google and Mastercard, demonstrating our commitment to real-world security impact and responsible disclosure.
            </p>
            <div className="text-center">
              <Link href="/team" className="inline-flex items-center bg-white/10 hover:bg-white/20 text-white/80 hover:text-white px-6 py-3 rounded-lg transition-colors">
                <span>Meet Our Team</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className={`text-center transition-all duration-700 delay-100 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/5 h-full">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.586-3H4a1 1 0 000 2h16.586l-4.293 4.293a1 1 0 001.414 1.414L24 12l-6.293-6.293a1 1 0 00-1.414 1.414L20.586 11z" />
                  </svg>
                </div>
                <h3 className="text-xl text-white/90 font-medium mb-4">Penetration Testing</h3>
                <p className="text-white/60">
                  Comprehensive penetration testing services to identify and validate security vulnerabilities before attackers do.
                </p>
              </div>
            </div>
            
            <div className={`text-center transition-all duration-700 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/5 h-full">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl text-white/90 font-medium mb-4">Free Training</h3>
                <p className="text-white/60">
                  Committed to knowledge sharing through free cybersecurity training programs to build a more secure community.
                </p>
              </div>
            </div>
            
            <div className={`text-center transition-all duration-700 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/5 h-full">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl text-white/90 font-medium mb-4">Recognition</h3>
                <p className="text-white/60">
                  Hall of Fame recognition from leading organizations like Google and Mastercard for responsible security research.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <Link href="/publications" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors text-center">
              View Publications
            </Link>
            <Link href="/" className="bg-white/90 hover:bg-white text-black px-6 py-3 rounded-lg transition-colors text-center">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  ) 
} 