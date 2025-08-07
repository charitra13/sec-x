import { Skeleton } from '@/components/ui/skeleton';

interface UserTableSkeletonProps {
  rows?: number;
  showFilters?: boolean;
  showActions?: boolean;
  showStats?: boolean;
}

/**
 * User management table skeleton with filters and actions
 * Specialized skeleton for user administration interfaces
 */
export function UserTableSkeleton({
  rows = 10,
  showFilters = true,
  showActions = true,
  showStats = true
}: UserTableSkeletonProps) {
  return (
    <div className="space-y-6" role="status" aria-label="Loading user data">
      <span className="sr-only">User data is loading, please wait</span>
      
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton 
            height={32} 
            width={150} 
            variant="text"
          />
          <Skeleton 
            height={16} 
            width={250} 
            variant="text"
          />
        </div>
        {showActions && (
          <div className="flex gap-3">
            <Skeleton height={40} width={100} variant="rounded" />
            <Skeleton height={40} width={120} variant="rounded" />
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Skeleton 
              height={40} 
              className="w-full max-w-sm" 
              variant="rounded"
            />
          </div>
          <div className="flex gap-2">
            <Skeleton height={40} width={120} variant="rounded" />
            <Skeleton height={40} width={100} variant="rounded" />
            <Skeleton height={40} width={80} variant="rounded" />
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Total Users', 'Active Users', 'New This Month', 'Admins'].map((_, i) => (
            <div key={i} className="glass rounded-lg p-4">
              <div className="space-y-2">
                <Skeleton height={14} width="70%" variant="text" />
                <Skeleton height={24} width="50%" variant="text" />
                <div className="flex items-center gap-1">
                  <Skeleton height={12} width={12} variant="rounded" />
                  <Skeleton height={12} width="40%" variant="text" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="glass rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="border-b border-gray-700 p-4">
          <div className="grid grid-cols-6 gap-4 items-center">
            <div className="flex items-center gap-2">
              <Skeleton height={16} width={16} variant="rounded" />
              <Skeleton height={16} width={40} variant="text" />
            </div>
            <Skeleton height={16} width={60} variant="text" />
            <Skeleton height={16} width={50} variant="text" />
            <Skeleton height={16} width={45} variant="text" />
            <Skeleton height={16} width={55} variant="text" />
            <Skeleton height={16} width={50} variant="text" />
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-700">
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="p-4">
              <div className="grid grid-cols-6 gap-4 items-center">
                {/* User Info with Checkbox */}
                <div className="flex items-center gap-3">
                  <Skeleton height={16} width={16} variant="rounded" />
                  <Skeleton height={32} width={32} variant="circular" />
                  <div className="space-y-1">
                    <Skeleton height={14} width={80} variant="text" />
                    <Skeleton height={12} width={120} variant="text" />
                  </div>
                </div>
                
                {/* Email */}
                <Skeleton height={14} width="80%" variant="text" />
                
                {/* Role Badge */}
                <Skeleton height={20} width={60} variant="rounded" />
                
                {/* Status Badge */}
                <Skeleton height={20} width={50} variant="rounded" />
                
                {/* Last Login */}
                <Skeleton height={14} width="70%" variant="text" />
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Skeleton height={32} width={32} variant="rounded" />
                  <Skeleton height={32} width={32} variant="rounded" />
                  <Skeleton height={32} width={32} variant="rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer with Pagination */}
        <div className="border-t border-gray-700 px-4 py-3 flex items-center justify-between">
          <Skeleton height={14} width={120} variant="text" />
          <div className="flex items-center gap-2">
            <Skeleton height={32} width={80} variant="rounded" />
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton
                key={i}
                height={32}
                width={32}
                variant="rounded"
              />
            ))}
            <Skeleton height={32} width={80} variant="rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}