'use client'

import { useState } from 'react'
import Link from 'next/link'


export default function PublicationsPage() {

  const publications = [
    {
      id: 1,
      title: "Zero Trust Architecture: A Comprehensive Implementation Guide",
      type: "Whitepaper",
      description: "Detailed framework for implementing zero trust security principles across enterprise environments.",
      category: "Architecture",
      readTime: "15 min read",
      publishDate: "2024-01-15"
    },
    {
      id: 2,
      title: "The Evolution of Ransomware: Detection and Response Strategies",
      type: "Research Paper",
      description: "Analysis of modern ransomware techniques and proven defense mechanisms for organizations.",
      category: "Threat Intelligence",
      readTime: "12 min read",
      publishDate: "2024-01-08"
    },
    {
      id: 3,
      title: "Cloud Security Compliance: Navigating Multi-Cloud Environments",
      type: "Case Study",
      description: "Best practices for maintaining security compliance across hybrid and multi-cloud deployments.",
      category: "Cloud Security",
      readTime: "10 min read",
      publishDate: "2023-12-20"
    },
    {
      id: 4,
      title: "AI-Powered Threat Detection: Machine Learning in Cybersecurity",
      type: "Technical Report",
      description: "Exploring the application of artificial intelligence in modern threat detection systems.",
      category: "AI Security",
      readTime: "18 min read",
      publishDate: "2023-12-10"
    },
    {
      id: 5,
      title: "Incident Response Playbook: Critical Infrastructure Protection",
      type: "Playbook",
      description: "Step-by-step incident response procedures for critical infrastructure organizations.",
      category: "Incident Response",
      readTime: "25 min read",
      publishDate: "2023-11-28"
    },
    {
      id: 6,
      title: "Supply Chain Security: Mitigating Third-Party Risks",
      type: "Advisory",
      description: "Comprehensive guide to identifying and mitigating supply chain cybersecurity risks.",
      category: "Risk Management",
      readTime: "14 min read",
      publishDate: "2023-11-15"
    }
  ]

  const getCategoryColor = (category: string) => {
    const colors = {
      'Architecture': 'bg-blue-500/20 text-blue-400',
      'Threat Intelligence': 'bg-red-500/20 text-red-400',
      'Cloud Security': 'bg-teal-500/20 text-teal-400',
      'AI Security': 'bg-purple-500/20 text-purple-400',
      'Incident Response': 'bg-orange-500/20 text-orange-400',
      'Risk Management': 'bg-gray-500/20 text-gray-400'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'
  }

  return (
    <main className="relative">
      {/* Animated Background */}

      {/* Publications Section */}
      <div className="px-4 py-8 sm:py-12 relative z-10 min-h-screen">
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-light text-white mb-4">SecurityX Publications</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Insights, research, and best practices from our cybersecurity experts to help you stay ahead of evolving threats.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((publication, index) => (
              <div 
                key={publication.id}
                className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/50 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(publication.category)}`}>
                    {publication.category}
                  </span>
                  <span className="text-xs text-white/60">{publication.type}</span>
                </div>
                
                <h3 className="text-xl font-medium text-white mb-3 leading-tight">
                  {publication.title}
                </h3>
                
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  {publication.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                  <span>{publication.readTime}</span>
                  <span>{new Date(publication.publishDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                </div>
                
                <button className="w-full bg-white/10 hover:bg-white/20 text-white/90 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                  Read Publication
                </button>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 p-8 mt-12 text-center">
            <h2 className="text-2xl font-light text-white mb-4">Need Custom Security Research?</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Our security experts can provide tailored research and analysis specific to your industry or threat landscape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="mailto:research@securityx.com" 
                className="bg-white/90 hover:bg-white text-black px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Contact Research Team
              </Link>
              <Link 
                href="/about" 
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Learn More About Us
              </Link>
            </div>
          </div>

          <div className="text-center mt-8">
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