import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonTable } from '@/components/ui/skeleton/SkeletonTable';
import { Card } from '@/components/ui/card';

/**
 * Users management table skeleton loader
 * Shows skeleton for user table with actions and filters
 */
export default function UsersLoading() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <div className="p-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <Skeleton 
                height={32} 
                width={150} 
                variant="text"
                className="mb-2"
              />
              <Skeleton 
                height={16} 
                width={250} 
                variant="text"
              />
            </div>
            <div className="flex gap-3">
              <Skeleton height={40} width={100} variant="rounded" />
              <Skeleton height={40} width={120} variant="rounded" />
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              'Total Users',
              'Active Users',
              'New This Month',
              'Admins'
            ].map((stat, i) => (
              <Card key={i} className="p-4">
                <div className="space-y-2">
                  <Skeleton height={14} width="70%" variant="text" />
                  <Skeleton height={24} width="50%" variant="text" />
                  <div className="flex items-center gap-1">
                    <Skeleton height={12} width={12} variant="rounded" />
                    <Skeleton height={12} width="40%" variant="text" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Users Table */}
          <div className="rounded-lg border border-gray-700 overflow-hidden">
            {/* Custom Table Header */}
            <div className="bg-gray-800 p-4">
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
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="p-4">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    {/* User Info */}
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
                    
                    {/* Role */}
                    <Skeleton height={20} width={60} variant="rounded" />
                    
                    {/* Status */}
                    <Skeleton height={20} width={50} variant="rounded" />
                    
                    {/* Last Login */}
                    <Skeleton height={14} width="70%" variant="text" />
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Skeleton height={32} width={32} variant="rounded" />
                      <Skeleton height={32} width={32} variant="rounded" />
                      <Skeleton height={32} width={32} variant="rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Footer */}
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
              <Skeleton height={14} width={120} variant="text" />
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton
                    key={i}
                    height={32}
                    width={32}
                    variant="rounded"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}