'use client'

import { useState } from 'react'
import Link from 'next/link'
import publicationsData from '@/lib/publications.json'

interface Publication {
  id: number
  title: string
  type: string
  description: string
  category: string
  readTime: string
  publishDate: string
  content: {
    introduction: string
    sections: Array<{
      title: string
      content: string
    }>
    keyTakeaways: string[]
    conclusion: string
  }
}

export default function PublicationsPage() {
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)

  const publications: Publication[] = publicationsData

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

  const handleReadPublication = (publication: Publication) => {
    setSelectedPublication(publication)
  }

  const handleBackToList = () => {
    setSelectedPublication(null)
  }

  if (selectedPublication) {
    return (
      <main className="relative">
        {/* Publication Detail View */}
        <div className="px-4 py-8 sm:py-12 relative z-10 min-h-screen">
          <div className="w-full max-w-[1000px] mx-auto">
            {/* Back Button */}
            <button 
              onClick={handleBackToList}
              className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-8"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Publications
            </button>

            {/* Publication Header */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedPublication.category)}`}>
                  {selectedPublication.category}
                </span>
                <span className="text-xs text-white/60">{selectedPublication.type}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-medium text-white mb-4 leading-tight">
                {selectedPublication.title}
              </h1>
              
              <p className="text-lg text-white/70 mb-6 leading-relaxed">
                {selectedPublication.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-white/60 border-t border-white/10 pt-6">
                <span>{selectedPublication.readTime}</span>
                <span>{new Date(selectedPublication.publishDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>

            {/* Publication Content */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 p-8">
              {/* Introduction */}
              <div className="mb-12">
                <h2 className="text-2xl text-white mb-4">Introduction</h2>
                <p className="text-white/80 leading-relaxed text-lg">
                  {selectedPublication.content.introduction}
                </p>
              </div>

              {/* Sections */}
              {selectedPublication.content.sections.map((section, index) => (
                <div key={index} className="mb-10">
                  <h3 className="text-xl text-white mb-3">{section.title}</h3>
                  <p className="text-white/80 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}

              {/* Key Takeaways */}
              <div className="mb-10">
                <h3 className="text-xl text-white mb-4">Key Takeaways</h3>
                <ul className="space-y-3">
                  {selectedPublication.content.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="flex items-start text-white/80">
                      <svg className="w-2 h-2 rounded-full bg-white/40 mt-2 mr-3 flex-shrink-0" />
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conclusion */}
              <div className="mb-8">
                <h3 className="text-xl text-white mb-3">Conclusion</h3>
                <p className="text-white/80 leading-relaxed">
                  {selectedPublication.content.conclusion}
                </p>
              </div>

              {/* Bottom Navigation */}
              <div className="border-t border-white/10 pt-8 text-center">
                <button 
                  onClick={handleBackToList}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Back to All Publications
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative">
      {/* Publications List View */}
      <div className="px-4 py-8 sm:py-12 relative z-10 min-h-screen">
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl text-white mb-4">SecurityX Publications</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Insights, research, and best practices from our cybersecurity experts to help you stay ahead of evolving threats.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((publication, index) => (
              <div 
                key={publication.id}
                className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/50 transition-all duration-300 hover:scale-105 min-h-[400px] flex flex-col"
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
                
                <p className="text-white/70 text-sm mb-4 leading-relaxed flex-grow">
                  {publication.description}
                </p>
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                    <span>{publication.readTime}</span>
                    <span>{new Date(publication.publishDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleReadPublication(publication)}
                    className="w-full bg-white/10 hover:bg-white/20 text-white/90 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    Read Publication
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 p-8 mt-12 text-center">
            <h2 className="text-2xl text-white mb-4">Need Custom Security Research?</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Our security experts can provide tailored research and analysis specific to your industry or threat landscape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
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