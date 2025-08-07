import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonCard } from '@/components/ui/skeleton/SkeletonCard';
import { SkeletonTable } from '@/components/ui/skeleton/SkeletonTable';
import { Card } from '@/components/ui/card';

/**
 * Dashboard skeleton loader with stats cards and data table
 * Matches the actual dashboard layout structure
 */
export default function DashboardLoading() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <div className="p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <Skeleton 
              height={32} 
              width={200} 
              variant="text"
              className="text-2xl"
            />
            <Skeleton 
              height={40} 
              width={150} 
              variant="rounded"
            />
          </div>
          
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="space-y-3">
                  <Skeleton 
                    height={20} 
                    width="60%" 
                    variant="text"
                    className="mb-2" 
                  />
                  <Skeleton 
                    height={32} 
                    width="40%" 
                    variant="text"
                    className="text-xl font-bold"
                  />
                  <div className="flex items-center gap-2 mt-2">
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
          
          {/* Data Table Section */}
          <div className="mb-4">
            <Skeleton 
              height={24} 
              width={180} 
              variant="text"
              className="mb-4 text-lg"
            />
            <SkeletonTable 
              rows={8} 
              columns={5} 
              showHeader={true}
              headerHeight={24}
              rowHeight={18}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}