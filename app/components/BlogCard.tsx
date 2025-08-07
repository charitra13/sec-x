'use client'

import { IBlog } from '@/types'
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
    <div 
      className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/50 transition-all duration-300 hover:scale-105 min-h-[500px] flex flex-col cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => onReadBlog(blog)}
    >
      {/* Cover Image */}
      <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
        <img 
          src={blog.coverImage} 
          alt={blog.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Header with Category and Type */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(blog.category)}`}>
          {blog.category}
        </span>
        <span className="text-xs text-white/60">Blog Post</span>
      </div>
      
      {/* Title */}
      <h3 className="text-xl font-medium text-white mb-3 leading-tight">
        {blog.title}
      </h3>
      
      {/* Excerpt */}
      <p className="text-white/70 text-sm mb-4 leading-relaxed flex-grow">
        {blog.excerpt}
      </p>
      
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-4">
        {blog.author.avatar ? (
          <img 
            src={blog.author.avatar} 
            alt={blog.author.name} 
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        <div>
          <p className="text-white/90 text-sm font-medium">{blog.author.name}</p>
          <p className="text-white/60 text-xs">{formatDate(blog.publishedAt || blog.createdAt!)}</p>
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
          <span>{blog.readingTime} min read</span>
          <div className="flex items-center gap-4">
            <span>{blog.views} views</span>
            <span>{blog.commentsCount || 0} comments</span>
          </div>
        </div>
        
        <button 
          className="w-full bg-white/10 hover:bg-white/20 text-white/90 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation()
            onReadBlog(blog)
          }}
        >
          Read Article
        </button>
      </div>
    </div>
  )
} 