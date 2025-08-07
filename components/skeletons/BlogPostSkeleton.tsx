import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonText } from '@/components/ui/skeleton/SkeletonText';

interface BlogPostSkeletonProps {
  showHeroImage?: boolean;
  showSidebar?: boolean;
  showTags?: boolean;
  showComments?: boolean;
  contentSections?: number;
}

/**
 * Individual blog post skeleton with hero, content, and sidebar
 * Comprehensive skeleton for full blog post layouts
 */
export function BlogPostSkeleton({
  showHeroImage = true,
  showSidebar = true,
  showTags = true,
  showComments = false,
  contentSections = 6
}: BlogPostSkeletonProps) {
  return (
    <article className="space-y-8" role="status" aria-label="Loading blog post">
      <span className="sr-only">Blog post content is loading, please wait</span>
      
      {/* Hero Image */}
      {showHeroImage && (
        <Skeleton 
          height={400} 
          className="w-full rounded-lg"
          variant="rounded"
        />
      )}

      <div className={`grid gap-8 ${showSidebar ? 'lg:grid-cols-4' : 'lg:grid-cols-1'}`}>
        {/* Main Content */}
        <div className={showSidebar ? 'lg:col-span-3' : 'lg:col-span-1'}>
          {/* Article Header */}
          <header className="space-y-4 mb-8">
            {/* Category */}
            <Skeleton 
              height={20} 
              width={120} 
              variant="rounded"
            />
            
            {/* Title */}
            <Skeleton 
              height={48} 
              width="90%" 
              variant="text"
            />
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4">
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
          <div className="prose prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <SkeletonText 
              lines={4}
              width={['100%', '100%', '100%', '85%']}
            />

            {/* Content sections */}
            {Array.from({ length: contentSections }, (_, i) => (
              <div key={i} className="space-y-4">
                {/* Section heading */}
                <Skeleton 
                  height={32} 
                  width="60%" 
                  variant="text"
                />
                
                {/* Section content */}
                <SkeletonText 
                  lines={5}
                  width={['100%', '100%', '95%', '100%', '80%']}
                />
                
                {/* Occasional content block */}
                {(i + 1) % 3 === 0 && (
                  <Skeleton 
                    height={200} 
                    className="w-full rounded-md"
                    variant="rounded"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Social Share & Tags */}
          <div className="mt-12 pt-8 border-t border-gray-700 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
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
            
            {showTags && (
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
            )}
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-12 pt-8 border-t border-gray-700 space-y-6">
              <Skeleton height={24} width={120} variant="text" />
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="space-y-3 p-4 glass rounded-lg">
                  <div className="flex items-center gap-3">
                    <Skeleton height={40} width={40} variant="circular" />
                    <div className="space-y-1">
                      <Skeleton height={14} width={100} variant="text" />
                      <Skeleton height={12} width={80} variant="text" />
                    </div>
                  </div>
                  <SkeletonText lines={2} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <aside className="lg:col-span-1 space-y-6">
            {/* Author Info */}
            <div className="glass rounded-xl p-6">
              <Skeleton height={20} width={100} variant="text" className="mb-4" />
              <div className="flex items-center gap-3 mb-4">
                <Skeleton height={48} width={48} variant="circular" />
                <div className="flex-1 space-y-2">
                  <Skeleton height={16} width="80%" variant="text" />
                  <Skeleton height={14} width="60%" variant="text" />
                </div>
              </div>
              <SkeletonText lines={2} />
            </div>

            {/* Related Posts */}
            <div className="glass rounded-xl p-6">
              <Skeleton height={20} width={120} variant="text" className="mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton height={60} width={80} variant="rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton height={14} width="100%" variant="text" />
                      <Skeleton height={12} width="70%" variant="text" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}