"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { IBlog } from '@/types';
import BlogCard from '@/app/components/BlogCard';
import { BlogContainer, BlogGlassCard, BlogTypography } from '@/components/blog';
import { AdvancedSearch } from '@/components/blog/AdvancedSearch';
import { BlogGridSkeleton } from '@/components/ui/skeleton';

interface SearchResult {
  blogs: IBlog[];
  totalResults: number;
  searchTime: number;
  suggestions?: string[];
}

const SearchResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult>({
    blogs: [],
    totalResults: 0,
    searchTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const dateRange = searchParams.get('date') || 'all';

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults({ blogs: [], totalResults: 0, searchTime: 0 });
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      const startTime = Date.now();

      try {
        const params = new URLSearchParams();
        params.set('keyword', query);
        if (category) params.set('category', category);
        if (sortBy !== 'newest') params.set('sort', sortBy);
        if (dateRange !== 'all') params.set('date', dateRange);

        const { data } = await api.get(`/blogs/search?${params.toString()}`);
        const searchTime = (Date.now() - startTime) / 1000;
        setResults({
          blogs: data.blogs || [],
          totalResults: data.totalResults || data.blogs?.length || 0,
          searchTime,
          suggestions: data.suggestions || []
        });
      } catch (err) {
        setError('Failed to fetch search results. Please try again.');
        setResults({ blogs: [], totalResults: 0, searchTime: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, category, sortBy, dateRange]);

  const handleReadBlog = (blog: IBlog) => {
    router.push(`/blog/${blog.slug}`);
  };

  const getFilterSummary = () => {
    const filters = [] as string[];
    if (category) filters.push(`Category: ${category}`);
    if (sortBy !== 'newest') filters.push(`Sort: ${sortBy}`);
    if (dateRange !== 'all') filters.push(`Date: ${dateRange}`);
    return filters;
  };

  return (
    <main className="relative">
      <BlogContainer size="xl">
        {/* Header */}
        <div className="mb-8">
          <BlogTypography variant="h1">
            Search Results
          </BlogTypography>
          {query && (
            <BlogTypography variant="body" className="mb-4">
              {loading ? (
                'Searching...'
              ) : (
                <>
                  {results.totalResults} result{results.totalResults !== 1 ? 's' : ''} for
                  <span className="font-medium text-blue-400"> &quot;{query}&quot;</span>
                  {results.searchTime > 0 && (
                    <span className="text-white/60"> ({results.searchTime.toFixed(2)}s)</span>
                  )}
                </>
              )}
            </BlogTypography>
          )}

          {/* Active filters */}
          {getFilterSummary().length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {getFilterSummary().map((filter, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30"
                >
                  {filter}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Search Interface */}
        <div className="mb-8">
          <AdvancedSearch />
        </div>

        {/* Results */}
        <section aria-label="Search results">
          {error ? (
            <BlogGlassCard variant="default" className="rounded-xl p-8 text-center">
              <svg className="w-16 h-16 text-red-400/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <BlogTypography variant="body" className="text-red-400 mb-0">
                {error}
              </BlogTypography>
            </BlogGlassCard>
          ) : loading ? (
            <BlogGridSkeleton cardCount={6} columns={3} showSearch={false} showTitle={false} />
          ) : results.blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.blogs.map((blog, index) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  index={index}
                  onReadBlog={handleReadBlog}
                  isLoading={false}
                />
              ))}
            </div>
          ) : query ? (
            <BlogGlassCard variant="default" className="rounded-xl p-8 text-center">
              <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <BlogTypography variant="body" className="mb-4">
                No articles found matching your search.
              </BlogTypography>
              <BlogTypography variant="caption" className="mb-6">
                Try adjusting your search terms or filters, or browse our latest articles below.
              </BlogTypography>

              {/* Search suggestions */}
              {results.suggestions && results.suggestions.length > 0 && (
                <div className="mb-6">
                  <BlogTypography variant="caption" className="mb-2">
                    Did you mean:
                  </BlogTypography>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {results.suggestions.map((suggestion, index) => (
                      <Link
                        key={index}
                        href={`/blog/search?q=${encodeURIComponent(suggestion)}`}
                        className="px-3 py-1 bg-white/10 text-white/80 hover:text-white hover:bg-white/20 text-sm rounded-lg transition-colors"
                      >
                        {suggestion}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href="/blog"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Browse All Articles
              </Link>
            </BlogGlassCard>
          ) : (
            <BlogGlassCard variant="default" className="rounded-xl p-8 text-center">
              <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <BlogTypography variant="body" className="mb-4">
                Enter a search term to find articles
              </BlogTypography>
              <BlogTypography variant="caption">
                Search our library of cybersecurity insights, tutorials, and expert analysis
              </BlogTypography>
            </BlogGlassCard>
          )}
        </section>

        {/* Back to blog */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Articles
          </Link>
        </div>
      </BlogContainer>
    </main>
  );
};

const SearchPage = () => (
  <Suspense fallback={<BlogContainer><BlogGridSkeleton cardCount={6} columns={3} /></BlogContainer>}>
    <SearchResults />
  </Suspense>
);

export default SearchPage;