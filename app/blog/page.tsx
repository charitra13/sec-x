'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { IBlog } from '@/types';
import BlogCard from '../components/BlogCard';
import SearchBar from '../components/SearchBar';
import { BlogGridSkeleton } from '@/components/ui/skeleton';

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
  const router = useRouter();
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    router.push(`/blog/${blog.slug}`);
  };
  // Detail view anti-pattern removed; listing page only.

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