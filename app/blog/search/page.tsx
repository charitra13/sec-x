"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import api from '@/lib/api';
import { IBlog } from '@/types';
import BlogPostTemplate from '@/app/components/BlogPostTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      const fetchBlogs = async () => {
        setLoading(true);
        setError(null);
        try {
          const { data } = await api.get(`/blogs/search?keyword=${query}`);
          setBlogs(data.blogs);
        } catch (err) {
          setError('Failed to fetch search results.');
        } finally {
          setLoading(false);
        }
      };
      fetchBlogs();
    } else {
      setBlogs([]);
      setLoading(false)
    }
  }, [query]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results for &quot;{query}&quot;</h1>
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogPostTemplate key={blog._id} post={blog} />
          ))}
        </div>
      ) : (
        <p className="text-center">No articles found matching your search.</p>
      )}
    </div>
  );
};

const SearchPage = () => (
  <Suspense fallback={<div className="text-center py-10">Loading search...</div>}>
    <SearchResults />
  </Suspense>
);

export default SearchPage; 