'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'


interface TeamMember {
  id: number
  name: string
  role: string
  department: string
  bio: string
  achievements: string[]
  certifications: string[]
  experience: string
  linkedin?: string
  avatar: string
}

export default function TeamPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [expandedMember, setExpandedMember] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Add escape key functionality for expanded member cards
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && expandedMember !== null) {
        setExpandedMember(null)
      }
    }

    if (expandedMember !== null) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [expandedMember])

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Chief Security Officer",
      department: "Leadership",
      bio: "Sarah leads our security strategy with 15+ years of experience in enterprise cybersecurity. She specializes in zero-trust architectures and has led security transformations for Fortune 500 companies.",
      achievements: [
        "Led security transformation for 3 Fortune 500 companies",
        "Designed zero-trust architecture for 50,000+ user environments",
        "Reduced security incidents by 85% in previous role",
        "Speaker at RSA Conference and Black Hat events"
      ],
      certifications: ["CISSP", "CISM", "SABSA"],
      experience: "15+ years",
      avatar: "SC"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Principal Security Engineer",
      department: "Engineering",
      bio: "Marcus is our lead security engineer with deep expertise in threat detection and incident response. He has built security tools used by thousands of security professionals worldwide.",
      achievements: [
        "Built threat detection platform with 99.9% uptime",
        "Discovered 12 critical vulnerabilities in open-source projects",
        "Authored security tools with 10,000+ GitHub stars",
        "Mentor to 50+ junior security engineers"
      ],
      certifications: ["OSCP", "GCIH", "CEH"],
      experience: "12+ years",
      avatar: "MR"
    },
    {
      id: 3,
      name: "Dr. Elena Kowalski",
      role: "Head of Threat Intelligence",
      department: "Research",
      bio: "Elena leads our threat intelligence research with a PhD in Computer Security. She has published extensively on advanced persistent threats and nation-state attack patterns.",
      achievements: [
        "Published 25+ peer-reviewed security research papers",
        "Identified 8 new APT groups and attack vectors",
        "PhD in Computer Security from MIT",
        "Advisor to government cybersecurity initiatives"
      ],
      certifications: ["GCTI", "SANS FOR578", "PhD Computer Security"],
      experience: "10+ years",
      avatar: "EK"
    },
    {
      id: 4,
      name: "James Thompson",
      role: "Incident Response Lead",
      department: "Operations",
      bio: "James coordinates our incident response efforts with extensive experience in digital forensics and crisis management. He has handled some of the most complex security incidents in the industry.",
      achievements: [
        "Led incident response for 200+ major security incidents",
        "Reduced average incident response time by 60%",
        "Certified in advanced digital forensics techniques",
        "Built IR playbooks used by 100+ organizations"
      ],
      certifications: ["GCFA", "GCFE", "CISSP"],
      experience: "14+ years",
      avatar: "JT"
    },
    {
      id: 5,
      name: "Aisha Patel",
      role: "Compliance & Risk Manager",
      department: "Risk Management",
      bio: "Aisha ensures our solutions meet the highest compliance standards across industries. She has guided organizations through complex regulatory requirements and audit processes.",
      achievements: [
        "Achieved 100% compliance success rate across 50+ audits",
        "Expert in SOC2, ISO 27001, NIST frameworks",
        "Reduced compliance costs by 40% through automation",
        "Speaker at compliance and risk management conferences"
      ],
      certifications: ["CISA", "CRISC", "ISO 27001 Lead Auditor"],
      experience: "11+ years",
      avatar: "AP"
    },
    {
      id: 6,
      name: "David Kim",
      role: "Cloud Security Architect",
      department: "Architecture",
      bio: "David specializes in securing cloud-native environments and has architected security solutions for some of the largest cloud deployments in the world.",
      achievements: [
        "Designed security for cloud environments serving 1M+ users",
        "AWS Security Hero and Azure MVP recognition",
        "Built automated security testing frameworks",
        "Contributed to NIST cloud security guidelines"
      ],
      certifications: ["AWS Security Specialty", "Azure Security Engineer", "CCSP"],
      experience: "9+ years",
      avatar: "DK"
    }
  ]

  const getDepartmentColor = (department: string) => {
    const colors = {
      'Leadership': 'bg-blue-500/20 text-blue-400',
      'Engineering': 'bg-teal-500/20 text-teal-400',
      'Research': 'bg-purple-500/20 text-purple-400',
      'Operations': 'bg-orange-500/20 text-orange-400',
      'Risk Management': 'bg-gray-500/20 text-gray-400',
      'Architecture': 'bg-green-500/20 text-green-400'
    }
    return colors[department as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'
  }

  const toggleMemberExpansion = (memberId: number) => {
    setExpandedMember(expandedMember === memberId ? null : memberId)
  }

  return (
    <main className="relative">
      {/* Animated Background */}

      <div className="w-full min-h-screen max-w-[1400px] mx-auto px-8 py-24 relative z-10">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-12">
            <h1 className="text-5xl mb-6 text-white">Our Security Experts</h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Meet the cybersecurity professionals who protect what matters most. Our team combines decades of experience with cutting-edge expertise to deliver unparalleled security solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {teamMembers.map((member, index) => (
              <div key={member.id} className="relative">
                {/* Small Profile Card */}
                <div 
                  className={`bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 cursor-pointer transition-all duration-500 hover:bg-black/50 hover:scale-105 ${
                    expandedMember === member.id ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                  onClick={() => toggleMemberExpansion(member.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-full flex items-center justify-center border border-white/10">
                      <span className="text-2xl font-medium text-white">{member.avatar}</span>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-1">{member.name}</h3>
                    <p className="text-white/70 text-sm mb-3">{member.role}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDepartmentColor(member.department)}`}>
                      {member.department}
                    </span>
                    <div className="mt-4 text-white/60 text-xs">
                      Click to view achievements
                    </div>
                  </div>
                </div>

                {/* Expanded Card */}
                {expandedMember === member.id && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div 
                      className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                      style={{ transform: 'translateY(-150px)' }}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-full flex items-center justify-center border border-white/10 mr-4">
                            <span className="text-xl font-medium text-white">{member.avatar}</span>
                          </div>
                          <div>
                            <h2 className="text-2xl text-white">{member.name}</h2>
                            <p className="text-white/80">{member.role}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDepartmentColor(member.department)} mt-2 inline-block`}>
                              {member.department}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setExpandedMember(null)}
                          className="text-white/60 hover:text-white p-2"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <p className="text-white/80 leading-relaxed">{member.bio}</p>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium text-white mb-3">Key Achievements</h3>
                          <ul className="space-y-2">
                            {member.achievements.map((achievement, idx) => (
                              <li key={idx} className="flex items-start text-white/70">
                                <svg className="w-4 h-4 text-teal-400 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-white/90 font-medium mb-2">Experience</h4>
                            <p className="text-white/70">{member.experience}</p>
                          </div>
                          <div>
                            <h4 className="text-white/90 font-medium mb-2">Certifications</h4>
                            <div className="flex flex-wrap gap-2">
                              {member.certifications.map((cert, idx) => (
                                <span key={idx} className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
} 