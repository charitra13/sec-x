'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/blog-data'

export default function BlogPage() {
  const [isVisible, setIsVisible] = useState(false)
  const blogPosts = getAllBlogPosts()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <main className="relative pt-16">
      <div className="w-full min-h-screen max-w-7xl mx-auto px-8 py-24 relative z-10">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl mb-6 text-white">
              SecurityX Blog
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Stay updated with the latest cybersecurity insights, research findings, and industry best practices from our expert team.
            </p>
          </div>

          {/* Featured Categories */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-700 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="glass rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-white/90 font-medium">AI Security</h3>
            </div>
            <div className="glass rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-white/90 font-medium">Red Teaming</h3>
            </div>
            <div className="glass rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.586-3H4a1 1 0 000 2h16.586l-4.293 4.293a1 1 0 001.414 1.414L24 12l-6.293-6.293a1 1 0 00-1.414 1.414L20.586 11z" />
                </svg>
              </div>
              <h3 className="text-white/90 font-medium">Penetration Testing</h3>
            </div>
            <div className="glass rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-white/90 font-medium">Security Architecture</h3>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className={`transition-all duration-700 delay-400 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl mb-8 text-white/90">Latest Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {blogPosts.map((post, index) => (
                <Link 
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className={`block transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${500 + index * 100}ms` }}
                >
                  <article className="glass rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer group h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                        {post.category}
                      </span>
                      <span className="text-white/60 text-sm">{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-xl text-white/90 font-medium mb-3 group-hover:text-white transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-white/70 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white/80 text-sm font-medium">{post.author}</p>
                          <p className="text-white/60 text-xs">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-white/60 group-hover:text-white/80 transition-colors">
                        <span className="text-sm mr-2">Read more</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className={`glass rounded-2xl p-8 mt-16 text-center transition-all duration-700 delay-800 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h3 className="text-2xl text-white/90 mb-4">Stay Updated</h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive the latest cybersecurity insights, research updates, and industry news directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-colors"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-white font-medium">
                Subscribe
              </button>
            </div>
          </div>

          {/* Back to Home */}
          <div className="flex justify-center mt-12">
            <Link href="/" className="glass px-6 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-white">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
} 