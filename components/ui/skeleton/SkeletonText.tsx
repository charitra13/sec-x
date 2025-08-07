import { Skeleton } from './index';
import { cn } from '@/lib/utils';

interface SkeletonTextProps {
  lines?: number;
  width?: string[];
  lastLineWidth?: string;
  spacing?: string;
  className?: string;
}

/**
 * Text line skeleton with multiple lines support
 * @param lines - Number of text lines to show
 * @param width - Array of widths for each line, or single width for all
 * @param lastLineWidth - Custom width for the last line (commonly shorter)
 * @param spacing - Spacing between lines
 */
export function SkeletonText({
  lines = 3,
  width = ['100%'],
  lastLineWidth = '70%',
  spacing = 'space-y-2',
  className
}: SkeletonTextProps) {
  const widthArray = Array.isArray(width) ? width : [width];
  
  return (
    <div className={cn(spacing, className)} role="status" aria-label="Loading text content">
      <span className="sr-only">Content is loading, please wait</span>
      {Array.from({ length: lines }, (_, index) => {
        const isLastLine = index === lines - 1;
        const lineWidth = isLastLine && lastLineWidth 
          ? lastLineWidth 
          : widthArray[index % widthArray.length] || '100%';
        
        return (
          <Skeleton
            key={index}
            variant="text"
            height="1rem"
            width={lineWidth}
            className="block"
          />
        );
      })}
    </div>
  );
}