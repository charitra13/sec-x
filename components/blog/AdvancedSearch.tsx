"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BlogGlassCard, BlogTypography } from '@/components/blog';

interface SearchFilters {
  query: string;
  category: string;
  sortBy: 'newest' | 'oldest' | 'popular' | 'relevant';
  dateRange: 'all' | 'week' | 'month' | 'year';
}

const categories = [
  'All Categories',
  'AI Security',
  'Red Teaming',
  'Penetration Testing',
  'Security Architecture',
  'Cybersecurity'
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'relevant', label: 'Most Relevant' }
];

const dateRanges = [
  { value: 'all', label: 'All Time' },
  { value: 'week', label: 'Past Week' },
  { value: 'month', label: 'Past Month' },
  { value: 'year', label: 'Past Year' }
];

export const AdvancedSearch = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'All Categories',
    sortBy: 'newest',
    dateRange: 'all'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const searchParams = new URLSearchParams();
    if (filters.query.trim()) searchParams.set('q', filters.query.trim());
    if (filters.category !== 'All Categories') searchParams.set('category', filters.category);
    if (filters.sortBy !== 'newest') searchParams.set('sort', filters.sortBy);
    if (filters.dateRange !== 'all') searchParams.set('date', filters.dateRange);

    router.push(`/blog/search?${searchParams.toString()}`);
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      category: 'All Categories',
      sortBy: 'newest',
      dateRange: 'all'
    });
  };

  return (
    <BlogGlassCard variant="default" className="rounded-xl p-6">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Main search input */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search cybersecurity insights..."
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Expand/Collapse filters button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Clear
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Advanced filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
            {/* Category filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-black text-white">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as SearchFilters['sortBy'] }))}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-black text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date range filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as SearchFilters['dateRange'] }))}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value} className="bg-black text-white">
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </form>
    </BlogGlassCard>
  );
};

export default AdvancedSearch;

