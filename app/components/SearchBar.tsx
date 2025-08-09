"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { BlogGlassCard } from '@/components/blog';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-lg">
      <div className="relative">
        <BlogGlassCard 
          variant="interactive"
          className="rounded-lg p-1 flex items-center"
        >
          <div className="flex items-center flex-grow">
            <svg 
              className="w-5 h-5 text-white/60 ml-3" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <input
              type="text"
              placeholder="Search cybersecurity insights..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              onBlur={() => setIsExpanded(false)}
              className="flex-grow bg-transparent px-3 py-2 text-white placeholder-white/50 focus:outline-none"
            />
          </div>
          
          <button
            type="submit"
            disabled={!query.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-white/10 disabled:text-white/40 text-white px-4 py-2 rounded-md transition-colors font-medium disabled:cursor-not-allowed"
          >
            Search
          </button>
        </BlogGlassCard>
        
        {isExpanded && query.length > 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50">
            <BlogGlassCard variant="default" className="rounded-lg p-4">
              <div className="text-white/60 text-sm">
                Press Enter to search for &quot;{query}&quot;
              </div>
            </BlogGlassCard>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;