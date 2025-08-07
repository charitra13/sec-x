import { Skeleton } from './index';
import { SkeletonText } from './SkeletonText';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showMeta?: boolean;
  className?: string;
  imageHeight?: number;
}

/**
 * Card skeleton for blog posts and content cards
 * Flexible card layout with optional sections
 */
export function SkeletonCard({
  showImage = true,
  showTitle = true,
  showDescription = true,
  showMeta = true,
  className,
  imageHeight = 200
}: SkeletonCardProps) {
  return (
    <div className={cn('glass rounded-xl overflow-hidden', className)} role="status" aria-label="Loading card content">
      <span className="sr-only">Card content is loading, please wait</span>
      
      {showImage && (
        <Skeleton 
          height={imageHeight} 
          className="w-full" 
          variant="rectangular"
        />
      )}
      
      <div className="p-6 space-y-4">
        {showTitle && (
          <Skeleton 
            height={28} 
            width="80%" 
            variant="text"
            className="mb-2"
          />
        )}
        
        {showDescription && (
          <SkeletonText 
            lines={3}
            width={['100%', '100%', '70%']}
            spacing="space-y-2"
          />
        )}
        
        {showMeta && (
          <div className="flex items-center justify-between pt-4">
            <Skeleton height={20} width={100} variant="rounded" />
            <Skeleton height={20} width={80} variant="rounded" />
          </div>
        )}
      </div>
    </div>
  );
}