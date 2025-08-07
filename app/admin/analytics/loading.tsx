import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonCard } from '@/components/ui/skeleton/SkeletonCard';
import { Card } from '@/components/ui/card';

/**
 * Analytics dashboard skeleton with charts and metrics
 * Shows placeholder for various analytics widgets
 */
export default function AnalyticsLoading() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <Skeleton 
              height={32} 
              width={180} 
              variant="text"
            />
            <div className="flex gap-3">
              <Skeleton height={40} width={120} variant="rounded" />
              <Skeleton height={40} width={100} variant="rounded" />
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', icon: true },
              { label: 'Page Views', icon: true },
              { label: 'Bounce Rate', icon: true },
              { label: 'Avg Session', icon: true }
            ].map((metric, i) => (
              <Card key={i} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton height={16} width="60%" variant="text" />
                    <Skeleton height={20} width={20} variant="rounded" />
                  </div>
                  <Skeleton height={28} width="50%" variant="text" />
                  <div className="flex items-center gap-1">
                    <Skeleton height={16} width={16} variant="rounded" />
                    <Skeleton height={14} width="40%" variant="text" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Traffic Chart */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton height={20} width={140} variant="text" />
                  <Skeleton height={32} width={80} variant="rounded" />
                </div>
                <Skeleton height={300} className="w-full" variant="rounded" />
              </div>
            </Card>

            {/* User Acquisition */}
            <Card className="p-6">
              <div className="space-y-4">
                <Skeleton height={20} width={160} variant="text" />
                <div className="flex items-center justify-center">
                  <Skeleton height={200} width={200} variant="circular" />
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton height={12} width={12} variant="rounded" />
                        <Skeleton height={14} width={80} variant="text" />
                      </div>
                      <Skeleton height={14} width={40} variant="text" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <Skeleton height={18} width={120} variant="text" className="mb-4" />
              <Skeleton height={250} className="w-full" variant="rounded" />
            </Card>
            
            <Card className="p-6">
              <Skeleton height={18} width={100} variant="text" className="mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton height={16} width="60%" variant="text" />
                    <Skeleton height={16} width="25%" variant="text" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <Skeleton height={18} width={90} variant="text" className="mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Skeleton height={14} width="50%" variant="text" />
                      <Skeleton height={14} width="20%" variant="text" />
                    </div>
                    <Skeleton height={6} className="w-full" variant="rounded" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity Table */}
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton height={20} width={140} variant="text" />
              <div className="space-y-3">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 items-center py-2">
                    <div className="flex items-center gap-3">
                      <Skeleton height={32} width={32} variant="circular" />
                      <Skeleton height={16} width={100} variant="text" />
                    </div>
                    <Skeleton height={16} width="80%" variant="text" />
                    <Skeleton height={16} width="60%" variant="text" />
                    <Skeleton height={16} width="50%" variant="text" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}