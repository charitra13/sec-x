'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import api from '@/lib/api';
import { IBlog } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Footer from '@/app/components/Footer';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function UserDashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Fetch user's favorite/recent blogs
  const { data: blogsData, error: blogsError } = useSWR('/blogs?limit=6', fetcher);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <div className="flex h-screen items-center justify-center relative z-10">
          <div className="text-xl font-semibold text-white">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const blogs: IBlog[] = blogsData?.data?.blogs || [];

  return (
    <div className="relative flex min-h-screen flex-col">
      
      <main className="flex-1 relative z-10">
        <div className="container mx-auto p-4 sm:p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {getGreeting()}, {user.name}! 👋
                  </h1>
                  <p className="text-white/70">
                    Welcome to your SecurityX dashboard
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                    <span>{formatDate(currentTime)}</span>
                    <span>•</span>
                    <span>{formatTime(currentTime)}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/blog">
                    <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      Browse Articles
                    </Button>
                  </Link>
                  <Button 
                    onClick={logout}
                    variant="outline" 
                    className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-black/40 backdrop-blur-sm border-white/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-white/60">Name</label>
                  <p className="text-white font-medium">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm text-white/60">Email</label>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-white/60">Role</label>
                  <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full capitalize">
                    {user.role}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-white/60">Member Since</label>
                  <p className="text-white/80 text-sm">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Articles Available</span>
                  <span className="text-white font-bold">{blogs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Account Status</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Email Verified</span>
                  <span className={user.isEmailVerified ? 'text-green-400' : 'text-yellow-400'}>
                    {user.isEmailVerified ? 'Yes' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Newsletter</span>
                  <span className={user.newsletter ? 'text-green-400' : 'text-white/60'}>
                    {user.newsletter ? 'Subscribed' : 'Not subscribed'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/blog" className="block">
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Browse All Articles
                  </Button>
                </Link>
                <Link href="/contact" className="block">
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/about" className="block">
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    About SecurityX
                  </Button>
                </Link>
                <Link href="/team" className="block">
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Meet Our Team
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Articles Section */}
          <Card className="bg-black/40 backdrop-blur-sm border-white/5 mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Latest Articles
              </CardTitle>
              <Link href="/blog">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {blogsError ? (
                <div className="text-center py-8">
                  <p className="text-white/60">Failed to load articles</p>
                </div>
              ) : blogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {blogs.slice(0, 6).map((blog) => (
                    <Link key={blog._id} href={`/blog/${blog.slug}`}>
                      <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors border border-white/10">
                        <div className="mb-3">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                            {blog.category}
                          </span>
                        </div>
                        <h3 className="text-white font-medium mb-2 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-white/70 text-sm mb-3 line-clamp-2">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-white/60">
                          <span>{blog.readingTime} min read</span>
                          <span>{blog.views} views</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/60">No articles available yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Tips Section */}
          <Card className="bg-black/40 backdrop-blur-sm border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Security Tips for Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-medium mb-2">🔐 Strong Passwords</h4>
                  <p className="text-white/70 text-sm">
                    Use unique, complex passwords for each account. Consider using a password manager.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-medium mb-2">🛡️ Two-Factor Authentication</h4>
                  <p className="text-white/70 text-sm">
                    Enable 2FA on all important accounts for an extra layer of security.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-medium mb-2">📧 Phishing Awareness</h4>
                  <p className="text-white/70 text-sm">
                    Always verify sender identity before clicking links or downloading attachments.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-medium mb-2">🔄 Regular Updates</h4>
                  <p className="text-white/70 text-sm">
                    Keep your software, operating system, and browsers updated with latest patches.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}