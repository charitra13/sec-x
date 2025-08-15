"use client";

import { useForm, Controller, useWatch } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import '@/styles/dark-quill.css';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { AdminGlassCard } from '@/components/admin/AdminComponents';
import { BlogContainer } from '@/components/blog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NotionImageReposition } from '@/components/ui/NotionImageReposition';
import useSWR from 'swr';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-white/5 border border-white/20 rounded-lg flex items-center justify-center">
      <div className="flex items-center gap-2 text-white/60">
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        Loading editor...
      </div>
    </div>
  )
});

const categories = ['AI Security', 'Red Teaming', 'Penetration Testing', 'Security Architecture', 'Cybersecurity'] as const;
const statuses = ['draft', 'published'] as const;

const editPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  coverImage: z.string().url('Cover image must be a valid URL'),
  imagePosition: z.string().optional(),
  category: z.enum(categories),
  tags: z.string().min(1, 'At least one tag is required'),
  status: z.enum(statuses),
});

type EditPostValues = z.infer<typeof editPostSchema>;

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { id: slug } = params; // Note: Despite the name 'id', this is now the slug

  // ✅ CHANGED: Use slug-based API endpoint instead of ID
  const { data: postData, error: postError, isLoading } = useSWR(
    slug ? `/blogs/slug/${slug}` : null,
    fetcher
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<EditPostValues>({
    resolver: zodResolver(editPostSchema),
  });

  // Watch coverImage and imagePosition for preview
  const watchCoverImage = useWatch({
    control,
    name: 'coverImage'
  });
  const watchImagePosition = useWatch({
    control,
    name: 'imagePosition'
  });

  useEffect(() => {
    if (postData) {
      const post = postData.data;
      reset({
        ...post,
        tags: post.tags.join(', '),
        imagePosition: post.imagePosition || 'center',
      });
    }
  }, [postData, reset]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setValue('coverImage', data.data.url, { shouldValidate: true });
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Image upload failed.');
    }
  };

  const onSubmit = async (data: EditPostValues) => {
    if (!postData?.data?._id) {
      toast.error('Blog data not loaded yet. Please wait.');
      return;
    }

    setIsSubmitting(true);
    try {
      const tagsArray = data.tags.split(',').map(tag => tag.trim());
      const payload = { ...data, tags: tagsArray };

      // ✅ CHANGED: Use the blog ID from fetched data for the PUT request
      await api.put(`/blogs/${postData.data._id}`, payload);
      toast.success('Blog post updated successfully!');
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced error handling
  if (postError) {
    return (
      <BlogContainer>
        <AdminGlassCard title="Error">
          <div className="text-center py-8">
            <div className="text-red-400 mb-4">
              ❌ Failed to load blog post
            </div>
            <p className="text-white/60 mb-4">
              {postError.response?.status === 404
                ? 'Blog post not found. It may have been deleted or the URL is incorrect.'
                : 'An error occurred while loading the blog post.'
              }
            </p>
            <Button
              onClick={() => router.push('/admin/dashboard')}
              variant="outline"
            >
              Back to Dashboard
            </Button>
          </div>
        </AdminGlassCard>
      </BlogContainer>
    );
  }

  if (isLoading || !postData) {
    return (
      <BlogContainer>
        <AdminGlassCard title="Loading">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-3 text-white/60">Loading blog post...</span>
          </div>
        </AdminGlassCard>
      </BlogContainer>
    );
  }

  return (
    <BlogContainer>
      <AdminGlassCard title={`Edit: ${postData.data.title}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Cover Image</Label>
            
            {/* Toggle buttons for input mode */}
            <div className="flex gap-2 mt-2 mb-3">
              <Button
                type="button"
                variant={imageInputMode === 'upload' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setImageInputMode('upload')}
                className="px-4 py-2"
              >
                Upload File
              </Button>
              <Button
                type="button"
                variant={imageInputMode === 'url' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setImageInputMode('url')}
                className="px-4 py-2"
              >
                Enter URL
              </Button>
            </div>

            {/* Conditional input based on mode */}
            {imageInputMode === 'upload' ? (
              <>
                <Input type="file" onChange={handleImageUpload} className="mb-2" />
                <Input {...register('coverImage')} readOnly placeholder="Image URL will appear here" className="bg-gray-100/10" />
              </>
            ) : (
              <Input 
                {...register('coverImage')} 
                placeholder="Enter image URL manually" 
                className="bg-white/5"
              />
            )}
            
            {errors.coverImage && <p className="text-red-500 text-xs mt-1">{errors.coverImage.message}</p>}

            {/* Image Position Controls - Notion Style */}
            {watchCoverImage && (
              <div className="mt-4">
                <Label className="text-sm text-white mb-2 block">Image Position</Label>
                <Controller
                  name="imagePosition"
                  control={control}
                  render={({ field }) => (
                    <NotionImageReposition
                      imageUrl={watchCoverImage}
                      initialPosition={field.value || 'center'}
                      onPositionChange={field.onChange}
                      className="w-full"
                    />
                  )}
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} className="mt-2" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Input id="excerpt" {...register('excerpt')} className="mt-2" />
            {errors.excerpt && <p className="text-red-500 text-xs mt-1">{errors.excerpt.message}</p>}
          </div>

          <div>
            <Label className="text-white">Content</Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <div className="mt-2">
                  <Suspense fallback={<div>Loading editor...</div>}>
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      className="dark-quill"
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ list: 'ordered' }, { list: 'bullet' }],
                          ['blockquote', 'code-block'],
                          ['link', 'image'],
                          ['clean']
                        ]
                      }}
                      placeholder="Write your blog content here..."
                    />
                  </Suspense>
                </div>
              )}
            />
            {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <Label>Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(stat => <SelectItem key={stat} value={stat}>{stat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" {...register('tags')} className="mt-2" />
            {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>}
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Post'}
            </Button>
          </div>
        </form>
      </AdminGlassCard>
    </BlogContainer>
  );
}