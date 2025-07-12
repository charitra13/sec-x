'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryData {
  totalPosts: number;
  totalViews: number;
  totalShares: number;
}

interface PostPerformanceData {
  post: {
    _id: string;
    title: string;
    slug: string;
  };
  totalViews: number;
  totalShares: number;
}

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [postPerformance, setPostPerformance] = useState<PostPerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryRes, postPerformanceRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/analytics/posts'),
        ]);
        setSummary(summaryRes.data.data);
        setPostPerformance(postPerformanceRes.data.data);
      } catch (err) {
        setError('Failed to fetch analytics data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading analytics...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="mb-8 text-4xl font-bold text-white">Analytics Dashboard</h1>

      {summary && (
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summary.totalPosts}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summary.totalViews}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Shares</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summary.totalShares}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Most Viewed Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={postPerformance
                  .sort((a, b) => b.totalViews - a.totalViews)
                  .slice(0, 5)}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="post.title" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalViews" fill="#8884d8" name="Total Views" />
                <Bar dataKey="totalShares" fill="#82ca9d" name="Total Shares" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 