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

export default function AdminDashboard() {
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

  return (
    <BlogContainer>
      <div className="mb-8">
        <BlogTypography variant="h1">Admin Dashboard</BlogTypography>
        <BlogTypography variant="body">Manage your blog posts and content</BlogTypography>
      </div>

      <AdminGlassCard>
        <div className="flex flex-row items-center justify-between mb-6">
          <BlogTypography variant="h2" className="mb-0">Manage Blogs ({blogs.length})</BlogTypography>
          <Link href="/admin/posts/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Create New Post</Button>
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
                <th className="py-3.5 px-4 text-left text-sm font-semibold text-white">Date</th>
                <th className="relative py-3.5 px-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </AdminTableHeader>
            <AdminTableBody>
              {blogs.map((post) => (
                <tr key={post._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-white max-w-xs truncate">{post.title}</td>
                  <td className="py-4 px-4 text-sm text-white/80">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${post.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-white/80">{post.views}</td>
                  <td className="py-4 px-4 text-sm text-white/80">{new Date(post.createdAt || '').toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-right text-sm font-medium space-x-2">
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">View</Button>
                    </Link>
                    <Link href={`/admin/posts/edit/${post.slug}`}>
                      <Button variant="outline" size="sm" className="border-blue-400/50 text-blue-400 hover:bg-blue-500/10">Edit</Button>
                    </Link>
                    <Button variant="outline" size="sm" className="border-red-400/50 text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(post._id)}>
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
            <BlogTypography variant="body" className="text-white/60 mb-0">
              No blog posts created yet. Create your first post to get started!
            </BlogTypography>
          </div>
        )}
      </AdminGlassCard>

      <div className="mb-8">
        <ContactStatsSection />
      </div>
    </BlogContainer>
  );
}

// Contact Stats Section Component
const ContactStatsSection = () => {
  const { data: contactData } = useSWR('/contacts?limit=5', fetcher);
  const contacts = contactData?.data?.contacts || [];
  const stats = contactData?.data?.stats;

  return (
    <AdminGlassCard>
      <div className="flex flex-row items-center justify-between mb-6">
        <BlogTypography variant="h2" className="mb-0">
          Recent Contacts ({stats?.total || 0})
        </BlogTypography>
        <Link href="/admin/contacts">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            Manage Contacts
          </Button>
        </Link>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">{stats.newCount}</div>
            <div className="text-xs text-white/70">New</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">{stats.inProgressCount}</div>
            <div className="text-xs text-white/70">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-400">{stats.urgentCount}</div>
            <div className="text-xs text-white/70">Urgent</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">{stats.assessmentFormCount}</div>
            <div className="text-xs text-white/70">Assessments</div>
          </div>
        </div>
      )}

      {contacts.length > 0 ? (
        <div className="space-y-3">
          {contacts.map((contact: any) => (
            <div key={contact._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <div className="font-medium text-white">{contact.name}</div>
                <div className="text-sm text-white/70">{contact.email}</div>
                {contact.company && (
                  <div className="text-xs text-white/60">{contact.company}</div>
                )}
              </div>
              <div className="text-right">
                <div className={`text-xs px-2 py-1 rounded-full ${
                  contact.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                  contact.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                  contact.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {contact.status}
                </div>
                <div className="text-xs text-white/60 mt-1">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <BlogTypography variant="body" className="text-white/60 mb-0">
            No contact submissions yet.
          </BlogTypography>
        </div>
      )}
    </AdminGlassCard>
  );
}; 