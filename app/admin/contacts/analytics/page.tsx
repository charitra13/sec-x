"use client";

import useSWR from 'swr';
import { useState } from 'react';
import api from '@/lib/api';
import { BlogContainer, BlogTypography } from '@/components/blog';
import { AdminGlassCard } from '@/components/admin/AdminComponents';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function ContactAnalytics() {
  const [period, setPeriod] = useState('30');
  
  const { data, error, isLoading } = useSWR(`/contacts/analytics?period=${period}`, fetcher);
  
  const analytics = data?.data;

  if (error) {
    return (
      <BlogContainer>
        <AdminGlassCard title="Error">
          <BlogTypography variant="body" className="text-red-400">
            Failed to load analytics. Please try again.
          </BlogTypography>
        </AdminGlassCard>
      </BlogContainer>
    );
  }

  return (
    <BlogContainer>
      <div className="mb-8">
        <BlogTypography variant="h1">Contact Analytics</BlogTypography>
        <BlogTypography variant="body">Insights into contact form submissions and trends</BlogTypography>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
        >
          <option value="7" className="bg-black">Last 7 days</option>
          <option value="30" className="bg-black">Last 30 days</option>
          <option value="90" className="bg-black">Last 90 days</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <BlogTypography variant="body" className="ml-3 mb-0">
            Loading analytics...
          </BlogTypography>
        </div>
      ) : analytics ? (
        <div className="space-y-8">
          {/* Status Distribution */}
          <AdminGlassCard title="Status Distribution">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {analytics.statusDistribution.map((status: any) => (
                <div key={status._id} className="text-center">
                  <div className="text-2xl font-bold text-white">{status.count}</div>
                  <div className="text-sm text-white/70 capitalize">{status._id}</div>
                </div>
              ))}
            </div>
          </AdminGlassCard>

          {/* Service Type Distribution */}
          {analytics.serviceTypeDistribution.length > 0 && (
            <AdminGlassCard title="Assessment Service Types">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.serviceTypeDistribution.map((service: any) => (
                  <div key={service._id} className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-xl font-bold text-white">{service.count}</div>
                    <div className="text-sm text-white/70">{service._id.replace('-', ' ')}</div>
                  </div>
                ))}
              </div>
            </AdminGlassCard>
          )}

          {/* Daily Submissions Chart */}
          <AdminGlassCard title="Daily Submissions">
            <div className="space-y-2">
              {analytics.dailySubmissions.map((day: any) => (
                <div key={day._id} className="flex items-center justify-between">
                  <div className="text-white/80">{day._id}</div>
                  <div className="flex items-center space-x-4">
                    <div className="text-blue-400">Contact: {day.contact}</div>
                    <div className="text-purple-400">Assessment: {day.assessment}</div>
                    <div className="text-white font-medium">Total: {day.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </AdminGlassCard>
        </div>
      ) : (
        <AdminGlassCard>
          <BlogTypography variant="body" className="text-white/60 text-center">
            No analytics data available for the selected period.
          </BlogTypography>
        </AdminGlassCard>
      )}
    </BlogContainer>
  );
}
