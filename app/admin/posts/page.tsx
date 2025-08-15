"use client";

import useSWR, { mutate } from 'swr';
import Link from 'next/link';
import api from '@/lib/api';
import { IBlog } from '@/types';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { BlogContainer, BlogTypography } from '@/components/blog';
import { AdminGlassCard, AdminTable, AdminTableHeader, AdminTableBody } from '@/components/admin/AdminComponents';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function AdminPosts() {
  const { data, error } = useSWR('/blogs?status=all', fetcher);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/blogs/${id}`);
        toast.success('Blog post deleted successfully!');
        // Mutate SWR data to re-fetch
        mutate('/blogs?status=all');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete post.');
      }
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await api.patch(`/blogs/${id}`, { status: newStatus });
      toast.success(`Post ${newStatus === 'published' ? 'published' : 'moved to draft'} successfully!`);
      // Mutate SWR data to re-fetch
      mutate('/blogs?status=all');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update post status.');
    }
  };

  if (error) {
    return (
      <BlogContainer>
        <AdminGlassCard title="Error">
          <BlogTypography variant="body" className="text-red-400">
            Failed to load blogs. Please try again.
          </BlogTypography>
        </AdminGlassCard>
      </BlogContainer>
    );
  }

  if (!data) {
    return (
      <BlogContainer>
        <AdminGlassCard title="Loading">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <BlogTypography variant="body" className="ml-3 mb-0">
              Loading blog posts...
            </BlogTypography>
          </div>
        </AdminGlassCard>
      </BlogContainer>
    );
  }

  const blogs: IBlog[] = data.data.blogs;

  // Calculate statistics
  const publishedCount = blogs.filter(blog => blog.status === 'published').length;
  const draftCount = blogs.filter(blog => blog.status === 'draft').length;
  const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);
  const featuredCount = blogs.filter(blog => blog.isFeature).length;

  return (
    <BlogContainer>
      <div className="mb-8">
        <BlogTypography variant="h1">Blog Posts Management</BlogTypography>
        <BlogTypography variant="body">Manage and organize your blog content</BlogTypography>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdminGlassCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{blogs.length}</div>
            <div className="text-sm text-white/70">Total Posts</div>
          </div>
        </AdminGlassCard>
        <AdminGlassCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{publishedCount}</div>
            <div className="text-sm text-white/70">Published</div>
          </div>
        </AdminGlassCard>
        <AdminGlassCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{draftCount}</div>
            <div className="text-sm text-white/70">Drafts</div>
          </div>
        </AdminGlassCard>
        <AdminGlassCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{totalViews.toLocaleString()}</div>
            <div className="text-sm text-white/70">Total Views</div>
          </div>
        </AdminGlassCard>
      </div>

      <AdminGlassCard>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <BlogTypography variant="h2" className="mb-0">All Blog Posts ({blogs.length})</BlogTypography>
            <BlogTypography variant="body" className="text-white/60 mt-1">
              {publishedCount} published, {draftCount} drafts
            </BlogTypography>
          </div>
          <Link href="/admin/posts/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Post
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <AdminTable>
            <AdminTableHeader>
              <tr>
                <th className="py-3.5 px-4 text-left text-sm font-semibold text-white">Title</th>
                <th className="py-3.5 px-4 text-left text-sm font-semibold text-white">Category</th>
                <th className="py-3.5 px-4 text-left text-sm font-semibold text-white">Status</th>
                <th className="py-3.5 px-4 text-left text-sm font-semibold text-white">Views</th>
                <th className="py-3.5 px-4 text-left text-sm font-semibold text-white">Featured</th>
                <th className="py-3.5 px-4 text-left text-sm font-semibold text-white">Date</th>
                <th className="relative py-3.5 px-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </AdminTableHeader>
            <AdminTableBody>
              {blogs.map((post) => (
                <tr key={post._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="max-w-xs">
                      <div className="font-medium text-white truncate">{post.title}</div>
                      <div className="text-xs text-white/60 truncate">{post.excerpt}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-white/80">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      post.status === 'published' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-white/80">
                    {post.views.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    {post.isFeature ? (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                        Featured
                      </span>
                    ) : (
                      <span className="text-white/40 text-xs">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm text-white/80">
                    {new Date(post.createdAt || '').toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-right text-sm font-medium space-x-2">
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/posts/edit/${post.slug}`}>
                      <Button variant="outline" size="sm" className="border-blue-400/50 text-blue-400 hover:bg-blue-500/10">
                        Edit
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`${
                        post.status === 'published' 
                          ? 'border-yellow-400/50 text-yellow-400 hover:bg-yellow-500/10' 
                          : 'border-green-400/50 text-green-400 hover:bg-green-500/10'
                      }`}
                      onClick={() => handleStatusToggle(post._id, post.status)}
                    >
                      {post.status === 'published' ? 'Draft' : 'Publish'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-400/50 text-red-400 hover:bg-red-500/10" 
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </AdminTableBody>
          </AdminTable>
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <BlogTypography variant="body" className="text-white/60 mb-4">
              No blog posts created yet. Create your first post to get started!
            </BlogTypography>
            <Link href="/admin/posts/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Create Your First Post
              </Button>
            </Link>
          </div>
        )}
      </AdminGlassCard>
    </BlogContainer>
  );
}
