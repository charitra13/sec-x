import { Skeleton } from './index';
import { cn } from '@/lib/utils';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
  headerHeight?: number;
  rowHeight?: number;
}

/**
 * Table skeleton for data tables with configurable rows and columns
 */
export function SkeletonTable({
  rows = 5,
  columns = 4,
  showHeader = true,
  className,
  headerHeight = 20,
  rowHeight = 16
}: SkeletonTableProps) {
  const gridColsClass = `grid-cols-${Math.min(columns, 12)}`; // Tailwind max is 12
  
  return (
    <div className={cn('w-full', className)} role="status" aria-label="Loading table data">
      <span className="sr-only">Table data is loading, please wait</span>
      
      <div className="border border-gray-700 rounded-lg overflow-hidden">
        {showHeader && (
          <div className="bg-gray-800 p-4">
            <div className={cn('grid gap-4', gridColsClass)}>
              {Array.from({ length: columns }, (_, i) => (
                <Skeleton 
                  key={`header-${i}`} 
                  height={headerHeight} 
                  width="60%" 
                  variant="text"
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="divide-y divide-gray-700">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="p-4">
              <div className={cn('grid gap-4', gridColsClass)}>
                {Array.from({ length: columns }, (_, colIndex) => (
                  <Skeleton
                    key={`cell-${rowIndex}-${colIndex}`}
                    height={rowHeight}
                    width={colIndex === 0 ? '70%' : '50%'}
                    variant="text"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}