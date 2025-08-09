import React from 'react';
import { Button } from '@/components/ui/button';
import { BlogGlassCard, BlogTypography } from '@/components/blog';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const BlogPagination = ({
  currentPage,
  totalPages,
  totalPosts,
  postsPerPage,
  onPageChange,
  isLoading = false
}: BlogPaginationProps) => {
  const startPost = (currentPage - 1) * postsPerPage + 1;
  const endPost = Math.min(currentPage * postsPerPage, totalPosts);

  const getPageNumbers = () => {
    const pages: Array<number | string> = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <BlogGlassCard variant="default" className="rounded-xl p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <BlogTypography variant="caption" className="mb-0">
          Showing {startPost}-{endPost} of {totalPosts} articles
        </BlogTypography>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="border-white/20 text-white hover:bg-white/10"
            aria-label="Go to previous page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-white/40">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    disabled={isLoading}
                    className={
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-white/20 text-white hover:bg-white/10'
                    }
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="border-white/20 text-white hover:bg-white/10"
            aria-label="Go to next page"
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </BlogGlassCard>
  );
};

