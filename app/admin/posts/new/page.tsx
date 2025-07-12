"use client";

import { useForm, Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const categories = ['AI Security', 'Red Teaming', 'Penetration Testing', 'Security Architecture', 'Cybersecurity'] as const;
const statuses = ['draft', 'published'] as const;

const createPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  coverImage: z.string().url('Cover image must be a valid URL'),
  category: z.enum(categories),
  tags: z.string().min(1, 'At least one tag is required'),
  status: z.enum(statuses),
});

type CreatePostValues = z.infer<typeof createPostSchema>;

export default function NewPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<CreatePostValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      status: 'draft'
    }
  });

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

  const onSubmit = async (data: CreatePostValues) => {
    setIsSubmitting(true);
    try {
      const tagsArray = data.tags.split(',').map(tag => tag.trim());
      const payload = { ...data, tags: tagsArray };

      await api.post('/blogs', payload);
      toast.success('Blog post created successfully!');
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>Cover Image</Label>
              <Input type="file" onChange={handleImageUpload} className="mt-2" />
              {errors.coverImage && <p className="text-red-500 text-xs mt-1">{errors.coverImage.message}</p>}
              <Input {...register('coverImage')} readOnly placeholder="Image URL will appear here" className="mt-2" />
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
              <Label>Content</Label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => <ReactQuill theme="snow" value={field.value} onChange={field.onChange} className="mt-2 bg-white text-black" />}
              />
              {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Post'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 