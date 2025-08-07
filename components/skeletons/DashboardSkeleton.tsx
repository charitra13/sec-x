import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonTable } from '@/components/ui/skeleton/SkeletonTable';
import { Card } from '@/components/ui/card';

interface DashboardSkeletonProps {
  showStats?: boolean;
  showTable?: boolean;
  statsCount?: number;
  tableRows?: number;
  tableCols?: number;
}

/**
 * Dashboard skeleton composition with stats cards and data table
 * Reusable component for various dashboard layouts
 */
export function DashboardSkeleton({
  showStats = true,
  showTable = true,
  statsCount = 3,
  tableRows = 8,
  tableCols = 5
}: DashboardSkeletonProps) {
  return (
    <div className="space-y-6" role="status" aria-label="Loading dashboard">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <Skeleton 
          height={32} 
          width={200} 
          variant="text"
        />
        <Skeleton 
          height={40} 
          width={150} 
          variant="rounded"
        />
      </div>
      
      {/* Stats Cards */}
      {showStats && (
        <div className={`grid gap-4 ${
          statsCount === 2 ? 'grid-cols-1 md:grid-cols-2' :
          statsCount === 3 ? 'grid-cols-1 md:grid-cols-3' :
          statsCount === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
          'grid-cols-1 md:grid-cols-3'
        }`}>
          {Array.from({ length: statsCount }, (_, i) => (
            <Card key={i} className="p-4">
              <div className="space-y-3">
                <Skeleton 
                  height={20} 
                  width="60%" 
                  variant="text"
                />
                <Skeleton 
                  height={32} 
                  width="40%" 
                  variant="text"
                  className="text-xl font-bold"
                />
                <div className="flex items-center gap-2">
                  <Skeleton 
                    height={16} 
                    width={20} 
                    variant="rounded"
                  />
                  <Skeleton 
                    height={16} 
                    width="30%" 
                    variant="text"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Data Table */}
      {showTable && (
        <div>
          <Skeleton 
            height={24} 
            width={180} 
            variant="text"
            className="mb-4"
          />
          <SkeletonTable 
            rows={tableRows} 
            columns={tableCols} 
            showHeader={true}
          />
        </div>
      )}
    </div>
  );
}