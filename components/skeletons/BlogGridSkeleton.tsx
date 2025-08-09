import { BlogGlassCard } from '@/components/blog';
import { Skeleton } from '@/components/ui/skeleton';

interface BlogGridSkeletonProps {
  cardCount?: number;
  showPagination?: boolean;
  showSearch?: boolean;
  showTitle?: boolean;
  columns?: 1 | 2 | 3 | 4;
}

/**
 * Blog grid skeleton with responsive card layout
 * Used for blog listing pages and similar content grids
 */
export function BlogGridSkeleton({
  cardCount = 9,
  showPagination = true,
  showSearch = true,
  showTitle = true,
  columns = 3
}: BlogGridSkeletonProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }[columns];

  return (
    <div className="space-y-8" role="status" aria-label="Loading blog posts">
      <span className="sr-only">Blog content is loading, please wait</span>
      
      {/* Page Title */}
      {showTitle && (
        <div className="text-center space-y-4">
          <Skeleton height={48} width={300} className="mx-auto bg-white/10 rounded-lg" />
          <Skeleton height={20} width={500} className="mx-auto bg-white/10 rounded-lg" />
        </div>
      )}

      {/* Search Bar */}
      {showSearch && (
        <div className="max-w-md mx-auto">
          <BlogGlassCard variant="default" className="rounded-lg p-4">
            <Skeleton height={40} className="w-full bg-white/10 rounded-lg" />
          </BlogGlassCard>
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className={`grid ${gridClass} gap-6`}>
        {Array.from({ length: cardCount }, (_, i) => (
          <BlogGlassCard key={i} variant="default" className="rounded-xl p-6 min-h-[500px] flex flex-col">
            <div className="space-y-4 flex-grow">
              {/* Image */}
              <Skeleton height={192} className="w-full bg-white/10 rounded-lg" />
              {/* Category and type */}
              <div className="flex justify-between items-center">
                <Skeleton height={20} width={80} className="bg-white/10 rounded-full" />
                <Skeleton height={16} width={60} className="bg-white/10 rounded" />
              </div>
              {/* Title */}
              <div className="space-y-2">
                <Skeleton height={24} className="bg-white/10 rounded w-[90%]" />
                <Skeleton height={24} className="bg-white/10 rounded w-[70%]" />
              </div>
              {/* Excerpt */}
              <div className="space-y-2">
                <Skeleton height={16} className="bg-white/10 rounded w-full" />
                <Skeleton height={16} className="bg-white/10 rounded w-[85%]" />
                <Skeleton height={16} className="bg-white/10 rounded w-[60%]" />
              </div>
              {/* Author */}
              <div className="flex items-center gap-3">
                <Skeleton height={32} width={32} className="bg-white/10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton height={14} width={80} className="bg-white/10 rounded" />
                  <Skeleton height={12} width={60} className="bg-white/10 rounded" />
                </div>
              </div>
              {/* Tags */}
              <div className="flex gap-2">
                <Skeleton height={20} width={50} className="bg-white/10 rounded" />
                <Skeleton height={20} width={60} className="bg-white/10 rounded" />
                <Skeleton height={20} width={40} className="bg-white/10 rounded" />
              </div>
            </div>
            {/* Footer */}
            <div className="mt-auto pt-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton height={12} width={60} className="bg-white/10 rounded" />
                <Skeleton height={12} width={80} className="bg-white/10 rounded" />
              </div>
              <Skeleton height={36} className="bg-white/10 rounded-lg w-full" />
            </div>
          </BlogGlassCard>
        ))}
      </div>

      {/* Pagination */}
      {showPagination && (
        <BlogGlassCard variant="default" className="rounded-xl p-6">
          <div className="flex justify-center items-center gap-2">
            <Skeleton height={36} width={80} className="bg-white/10 rounded-lg" />
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} height={36} width={36} className="bg-white/10 rounded-lg" />
            ))}
            <Skeleton height={36} width={80} className="bg-white/10 rounded-lg" />
          </div>
        </BlogGlassCard>
      )}
    </div>
  );
}