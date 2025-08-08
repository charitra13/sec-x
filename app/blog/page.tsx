'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { IBlog } from '@/types';
import BlogCard from '../components/BlogCard';
import SearchBar from '../components/SearchBar';
import SocialShareButtons from '../components/SocialShareButtons';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import { formatBlogContent } from '../utils/contentFormatter';
import { BlogGridSkeleton, BlogPostSkeleton } from '@/components/ui/skeleton';

async function fetchBlogs() {
  try {
    const { data } = await api.get('/blogs');
    // API response structure: { success: boolean, data: { blogs: IBlog[] } }
    if (data?.data?.blogs) {
      return data.data.blogs as IBlog[];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<IBlog | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostLoading, setIsPostLoading] = useState(false);

  useEffect(() => {
    const getBlogs = async () => {
      setIsLoading(true);
      try {
        const fetchedBlogs = await fetchBlogs();
        setBlogs(fetchedBlogs);
      } finally {
        setIsLoading(false);
      }
    };
    getBlogs();
  }, []);

  const handleReadBlog = (blog: IBlog) => {
    setIsPostLoading(true);
    setSelectedBlog(blog);
    // Simulate loading for demo purposes - in real app this might load additional data
    setTimeout(() => setIsPostLoading(false), 500);
  };

  const handleBackToList = () => {
    setSelectedBlog(null);
    setIsPostLoading(false);
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-400';
  };

  // Blog Detail View with Loading State
  if (selectedBlog) {
    if (isPostLoading) {
      return (
        <main className="relative">
          <div className="px-4 py-8 sm:py-12 relative z-10 min-h-screen">
            <div className="w-full max-w-[1000px] mx-auto">
              <Suspense fallback={<BlogPostSkeleton showSidebar={false} />}>
                <BlogPostSkeleton showSidebar={false} />
              </Suspense>
            </div>
          </div>
        </main>
      );
    }
    return (
      <main className="relative">
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
              Back to Blog
            </button>

            {/* Blog Header */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedBlog.category)}`}>
                  {selectedBlog.category}
                </span>
                <span className="text-xs text-white/60">Blog Post</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-medium text-white mb-4 leading-tight">
                {selectedBlog.title}
              </h1>
              
              <p className="text-lg text-white/70 mb-6 leading-relaxed">
                {selectedBlog.excerpt}
              </p>
              
              {/* Author Info */}
              <div className="flex items-center gap-4 mb-6">
                {selectedBlog.author.avatar ? (
                  <Image 
                    src={selectedBlog.author.avatar} 
                    alt={selectedBlog.author.name} 
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="text-white/90 font-medium">{selectedBlog.author.name}</p>
                  <p className="text-white/60 text-sm">{formatDate(selectedBlog.publishedAt || selectedBlog.createdAt!)}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedBlog.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-white/10 text-white/70 text-sm rounded-lg hover:bg-white/20 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-white/60 border-t border-white/10 pt-6">
                <span>{selectedBlog.readingTime} min read</span>
                <div className="flex items-center gap-4">
                  <span>{selectedBlog.views} views</span>
                  <span>{selectedBlog.commentsCount || 0} comments</span>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 p-4 mb-8">
              <Image 
                src={selectedBlog.coverImage} 
                alt={selectedBlog.title} 
                width={1000}
                height={562}
                className="w-full rounded-lg object-cover aspect-video"
              />
            </div>

            {/* Blog Content */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 p-8 mb-8">
              <div className="space-y-6">
                {formatBlogContent(selectedBlog.content)}
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 p-6 mb-8">
              <h3 className="text-xl text-white/90 font-medium mb-4">Share this article</h3>
              <SocialShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={selectedBlog.title} />
            </div>

            {/* Comments Section */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 p-6 mb-8">
              <h3 className="text-xl text-white/90 font-medium mb-6">Comments</h3>
              <div className="space-y-6">
                <CommentForm 
                  blogId={selectedBlog._id} 
                  onCommentPosted={() => setRefreshKey(prev => prev + 1)} 
                />
                <CommentList 
                  blogId={selectedBlog._id} 
                  refreshKey={refreshKey} 
                />
              </div>
            </div>

            {/* Related Articles */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 p-6 mb-8">
              <h3 className="text-xl text-white/90 font-medium mb-4">Related Articles</h3>
              <div className="text-white/70">
                <p>Discover more insights on {selectedBlog.category.toLowerCase()} and cybersecurity best practices.</p>
                <button 
                  onClick={handleBackToList}
                  className="inline-flex items-center mt-4 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View all articles
                </button>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="text-center">
              <button 
                onClick={handleBackToList}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Back to All Articles
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Blog List View
  return (
    <main className="relative">
      <div className="px-4 py-8 sm:py-12 relative z-10 min-h-screen">
        <div className="w-full max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl text-white mb-4">From the Blog</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Insights, tutorials, and expert perspectives from our cybersecurity team to help you stay ahead of the curve.
            </p>
            <div className="flex justify-center">
              <SearchBar />
            </div>
          </div>
          
          {/* Blog Grid with Loading State */}
          <Suspense fallback={<BlogGridSkeleton cardCount={9} columns={3} />}>
            {isLoading ? (
              <BlogGridSkeleton 
                cardCount={9} 
                columns={3}
                showSearch={false}
                showTitle={false}
              />
            ) : blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog, index) => (
                  <BlogCard 
                    key={blog._id} 
                    blog={blog} 
                    index={index} 
                    onReadBlog={handleReadBlog}
                    isLoading={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 p-8">
                  <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-white/60 text-lg mb-4">No articles have been published yet.</p>
                  <p className="text-white/40 text-sm">Check back soon for cybersecurity insights and tutorials!</p>
                </div>
              </div>
            )}
          </Suspense>

          {/* Contact Section */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 p-8 mt-12 text-center">
            <h2 className="text-2xl text-white mb-4">Want to Contribute?</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Have insights to share with the cybersecurity community? We welcome guest contributions from industry experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-white/90 hover:bg-white text-black px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Submit Your Article
              </Link>
              <Link 
                href="/about" 
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Learn More About Us
              </Link>
            </div>
          </div>

          {/* Back to Home */}
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
  );
} 