'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image';
import { IBlog } from '@/types'
import SocialShareButtons from './SocialShareButtons';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

interface BlogPostTemplateProps {
  post: IBlog
}

export default function BlogPostTemplate({ post }: BlogPostTemplateProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <main className="relative pt-16">
      <div className="w-full min-h-screen max-w-4xl mx-auto px-8 py-24 relative z-10">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          <div className="mb-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-white/60 hover:text-white transition-colors group"
            >
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>

          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-2 bg-blue-500/20 text-blue-400 text-sm rounded-full font-medium">
                {post.category}
              </span>
              <span className="text-white/60">{post.readingTime} min read</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                {post.author.avatar ? (
                  <Image src={post.author.avatar} alt={post.author.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="text-white/90 font-medium">{post.author.name}</p>
                  <p className="text-white/60 text-sm">{formatDate(post.publishedAt || post.createdAt!)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-white/10 text-white/70 text-sm rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          <figure className="mb-12">
            <Image src={post.coverImage} alt={post.title} width={896} height={504} className="w-full rounded-2xl object-cover aspect-video" />
          </figure>

          <article className={`glass rounded-2xl p-8 lg:p-12 mb-12`}>
            <div 
              className="prose prose-lg max-w-none prose-invert"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Article Footer */}
          <footer className={`transition-all duration-700 delay-400 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Share Section */}
            <div className="glass rounded-2xl p-6 mb-8">
              <h3 className="text-xl text-white/90 font-medium mb-4">Share this article</h3>
              <SocialShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={post.title} />
            </div>

            {/* Related Articles */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl text-white/90 font-medium mb-4">Related Articles</h3>
              <div className="text-white/70">
                <p>Discover more insights on {post.category.toLowerCase()} and cybersecurity best practices.</p>
                <Link 
                  href="/blog" 
                  className="inline-flex items-center mt-4 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View all articles
                </Link>
              </div>
            </div>
          </footer>

          <div className="mt-12 space-y-8">
            <CommentForm blogId={post._id} onCommentPosted={() => setRefreshKey(prev => prev + 1)} />
            <CommentList blogId={post._id} refreshKey={refreshKey} />
          </div>
        </div>
      </div>
    </main>
  )
} 