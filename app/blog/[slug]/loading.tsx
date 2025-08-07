import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonText } from '@/components/ui/skeleton/SkeletonText';
import { SkeletonCard } from '@/components/ui/skeleton/SkeletonCard';

/**
 * Individual blog post skeleton loader
 * Matches the structure of a full blog post with hero, content, and sidebar
 */
export default function BlogPostLoading() {
  return (
    <article className="container mx-auto px-4 py-8">
      {/* Hero Image */}
      <div className="mb-8">
        <Skeleton 
          height={400} 
          className="w-full rounded-lg"
          variant="rounded"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Article Header */}
          <header className="mb-8">
            {/* Category */}
            <Skeleton 
              height={20} 
              width={120} 
              variant="rounded"
              className="mb-4"
            />
            
            {/* Title */}
            <Skeleton 
              height={48} 
              width="90%" 
              variant="text"
              className="mb-4"
            />
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Skeleton 
                  height={32} 
                  width={32} 
                  variant="circular"
                />
                <Skeleton height={16} width={100} variant="text" />
              </div>
              <Skeleton height={16} width={80} variant="text" />
              <Skeleton height={16} width={90} variant="text" />
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none">
            {/* Introduction paragraph */}
            <SkeletonText 
              lines={4}
              width={['100%', '100%', '100%', '85%']}
              className="mb-6"
            />

            {/* Content sections */}
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="mb-8">
                {/* Section heading */}
                <Skeleton 
                  height={32} 
                  width="60%" 
                  variant="text"
                  className="mb-4"
                />
                
                {/* Section content */}
                <SkeletonText 
                  lines={5}
                  width={['100%', '100%', '95%', '100%', '80%']}
                  className="mb-4"
                />
                
                {/* Occasional code block or image */}
                {(i + 1) % 3 === 0 && (
                  <Skeleton 
                    height={200} 
                    className="w-full rounded-md my-4"
                    variant="rounded"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Social Share & Tags */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Skeleton height={16} width={80} variant="text" />
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton
                  key={i}
                  height={32}
                  width={40}
                  variant="rounded"
                />
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton
                  key={i}
                  height={28}
                  width={Math.floor(Math.random() * 60) + 60}
                  variant="rounded"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          {/* Author Info */}
          <div className="glass rounded-xl p-6 mb-6">
            <Skeleton height={20} width={100} variant="text" className="mb-4" />
            <div className="flex items-center gap-3 mb-4">
              <Skeleton height={48} width={48} variant="circular" />
              <div className="flex-1">
                <Skeleton height={16} width="80%" variant="text" className="mb-2" />
                <Skeleton height={14} width="60%" variant="text" />
              </div>
            </div>
            <SkeletonText lines={2} className="text-sm" />
          </div>

          {/* Related Posts */}
          <div className="glass rounded-xl p-6">
            <Skeleton height={20} width={120} variant="text" className="mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton height={60} width={80} variant="rounded" />
                  <div className="flex-1">
                    <Skeleton height={14} width="100%" variant="text" className="mb-2" />
                    <Skeleton height={12} width="70%" variant="text" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}