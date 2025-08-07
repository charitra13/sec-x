import { SkeletonCard } from '@/components/ui/skeleton/SkeletonCard';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Blog listing page skeleton with grid layout
 * Shows skeleton cards for blog posts in responsive grid
 */
export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="text-center mb-12">
        <Skeleton 
          height={48} 
          width={300} 
          variant="text"
          className="mx-auto mb-4"
        />
        <Skeleton 
          height={20} 
          width={500} 
          variant="text"
          className="mx-auto"
        />
      </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-md mx-auto">
        <Skeleton 
          height={48} 
          width="100%" 
          variant="rounded"
          className="w-full"
        />
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {Array.from({ length: 9 }, (_, i) => (
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
      <div className="flex justify-center items-center gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton
            key={i}
            height={40}
            width={40}
            variant="rounded"
          />
        ))}
      </div>
    </div>
  );
}