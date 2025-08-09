'use client'

import Image from 'next/image';
import { IBlog } from '@/types'
import { BlogGlassCard, BlogTypography } from '@/components/blog';
import { SkeletonCard } from '@/components/ui/skeleton/SkeletonCard'

interface BlogCardProps {
  blog?: IBlog
  index: number
  onReadBlog: (blog: IBlog) => void
  isLoading?: boolean
}

export default function BlogCard({ blog, index, onReadBlog, isLoading = false }: BlogCardProps) {
  // Show skeleton if loading or no blog data
  if (isLoading || !blog) {
    return (
      <SkeletonCard
        showImage={true}
        showTitle={true}
        showDescription={true}
        showMeta={true}
        imageHeight={192}
        className="min-h-[500px] bg-black/40 backdrop-blur-sm border border-white/5"
      />
    )
  }
  const getCategoryColor = (category: string) => {
    const colors = {
      'Technology': 'bg-blue-500/20 text-blue-400',
      'Security': 'bg-red-500/20 text-red-400',
      'Cloud': 'bg-teal-500/20 text-teal-400',
      'AI': 'bg-purple-500/20 text-purple-400',
      'DevOps': 'bg-orange-500/20 text-orange-400',
      'Cybersecurity': 'bg-red-500/20 text-red-400',
      'Web Development': 'bg-green-500/20 text-green-400',
      'Mobile': 'bg-indigo-500/20 text-indigo-400',
      'Data Science': 'bg-pink-500/20 text-pink-400',
      'Blockchain': 'bg-yellow-500/20 text-yellow-400',
      'IoT': 'bg-cyan-500/20 text-cyan-400',
      'Machine Learning': 'bg-purple-500/20 text-purple-400'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'
  }

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <BlogGlassCard 
      variant="interactive"
      className="rounded-2xl p-6 min-h-[500px] flex flex-col focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 focus-within:ring-offset-black"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Cover Image */}
      <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
        <Image 
          src={blog.coverImage} 
          alt={`Cover image for "${blog.title}" - ${blog.excerpt.substring(0, 100)}...`}
          width={400}
          height={192}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Header with Category and Type */}
      <div className="flex items-center justify-between mb-4">
        <span 
          className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(blog.category)}`}
          role="badge"
          aria-label={`Category: ${blog.category}`}
        >
          {blog.category}
        </span>
        <BlogTypography variant="meta">
          <span className="sr-only">Content type: </span>
          Blog Post
        </BlogTypography>
      </div>
      
      {/* Title */}
      <BlogTypography variant="h3" id={`blog-title-${blog._id}`} className="mb-3">
        {blog.title}
      </BlogTypography>
      
      {/* Excerpt */}
      <BlogTypography variant="caption" className="mb-4 flex-grow">
        {blog.excerpt}
      </BlogTypography>
      
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-4">
        {blog.author.avatar ? (
          <Image 
            src={blog.author.avatar} 
            alt={`${blog.author.name}'s profile picture`} 
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div 
            className="w-8 h-8 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center"
            aria-label={`${blog.author.name}'s avatar`}
          >
            <span aria-hidden="true" className="w-4 h-4 text-white">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
          </div>
        )}
        <div>
          <BlogTypography variant="caption" className="font-medium mb-0">
            <span className="sr-only">Author: </span>
            {blog.author.name}
          </BlogTypography>
          <BlogTypography variant="meta" className="mb-0">
            <time dateTime={new Date(blog.publishedAt || blog.createdAt!).toISOString()}>
              <span className="sr-only">Published on </span>
              {formatDate(blog.publishedAt || blog.createdAt!)}
            </time>
          </BlogTypography>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {blog.tags.slice(0, 3).map((tag, tagIndex) => (
          <span 
            key={tagIndex}
            className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-md"
          >
            #{tag}
          </span>
        ))}
        {blog.tags.length > 3 && (
          <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-md">
            +{blog.tags.length - 3} more
          </span>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-auto">
        <div className="flex items-center justify-between text-xs text-white/60 mb-4">
          <span>
            <span className="sr-only">Reading time: </span>
            {blog.readingTime} min read
          </span>
          <div className="flex items-center gap-4">
            <span>
              <span className="sr-only">View count: </span>
              {blog.views} views
            </span>
            <span>
              <span className="sr-only">Comment count: </span>
              {blog.commentsCount || 0} comments
            </span>
          </div>
        </div>
        
        <button 
          className="w-full bg-white/10 hover:bg-white/20 text-white/90 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation()
            onReadBlog(blog)
          }}
          aria-label={`Read full article: ${blog.title}`}
        >
          Read Article
        </button>
      </div>
    </BlogGlassCard>
  )
} 