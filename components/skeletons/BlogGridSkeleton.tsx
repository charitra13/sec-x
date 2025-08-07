import { SkeletonCard } from '@/components/ui/skeleton/SkeletonCard';
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
          <Skeleton 
            height={48} 
            width={300} 
            variant="text"
            className="mx-auto"
          />
          <Skeleton 
            height={20} 
            width={500} 
            variant="text"
            className="mx-auto"
          />
        </div>
      )}

      {/* Search Bar */}
      {showSearch && (
        <div className="max-w-md mx-auto">
          <Skeleton 
            height={48} 
            className="w-full" 
            variant="rounded"
          />
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className={`grid ${gridClass} gap-6`}>
        {Array.from({ length: cardCount }, (_, i) => (
          <SkeletonCard
            key={i}
            showImage={true}
            showTitle={true}
            showDescription={true}
            showMeta={true}
            imageHeight={200}
            className="h-full"
          />
        ))}
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex justify-center items-center gap-2">
          <Skeleton height={40} width={80} variant="rounded" />
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton
              key={i}
              height={40}
              width={40}
              variant="rounded"
            />
          ))}
          <Skeleton height={40} width={80} variant="rounded" />
        </div>
      )}
    </div>
  );
}