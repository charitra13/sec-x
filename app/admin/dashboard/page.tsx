"use client";

import useSWR, { mutate } from 'swr';
import Link from 'next/link';
import api from '@/lib/api';
import { IBlog } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

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

  if (error) return <div>Failed to load blogs</div>;
  if (!data) return <div>Loading...</div>;

  const blogs: IBlog[] = data.data.blogs;

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Blogs</CardTitle>
          <Link href="/admin/posts/new">
            <Button>Create New Post</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-white">Title</th>
                  <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-white">Category</th>
                  <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-white">Status</th>
                  <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-white">Views</th>
                  <th scope="col" className="relative py-3.5 px-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {blogs.map((post) => (
                  <tr key={post._id}>
                    <td className="whitespace-nowrap py-4 px-4 text-sm font-medium text-white">{post.title}</td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-300">{post.category}</td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-300">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-300">{post.views}</td>
                    <td className="relative whitespace-nowrap py-4 px-4 text-right text-sm font-medium space-x-2">
                      <Link href={`/admin/posts/edit/${post._id}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(post._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 