"use client";

import { useForm, Controller, useWatch } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useRef, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import '@/styles/dark-quill.css';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { AdminGlassCard } from '@/components/admin/AdminComponents';
import { BlogContainer } from '@/components/blog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Dynamically import ReactQuill to avoid SSR issues with loading state
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
  const [uploadMode, setUploadMode] = useState<'url' | 'upload'>('url');
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<CreatePostValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      status: 'draft'
    }
  });

  // Watch coverImage for preview
  const watchCoverImage = useWatch({
    control,
    name: 'coverImage'
  });

  // Ref to scope tooltip enhancements to this editor instance
  const quillContainerRef = useRef<HTMLDivElement | null>(null);

  // Add simple native title-based tooltips to Quill toolbar controls
  useEffect(() => {
    if (!quillContainerRef.current) return;
    const container = quillContainerRef.current;

    const setTitles = () => {
      const toolbar = container.querySelector('.ql-toolbar');
      if (!toolbar) return;

      const entries: Array<[string, string]> = [
        ['button.ql-bold', 'Bold (Ctrl+B)'],
        ['button.ql-italic', 'Italic (Ctrl+I)'],
        ['button.ql-underline', 'Underline (Ctrl+U)'],
        ['button.ql-strike', 'Strikethrough'],
        ['span.ql-picker.ql-header .ql-picker-label', 'Text type'],
        ['button.ql-list[value="ordered"]', 'Numbered list'],
        ['button.ql-list[value="bullet"]', 'Bulleted list'],
        ['button.ql-blockquote', 'Blockquote'],
        ['button.ql-code-block', 'Code block'],
        ['button.ql-link', 'Insert link'],
        ['button.ql-image', 'Insert image'],
        ['button.ql-clean', 'Clear formatting']
      ];

      entries.forEach(([selector, title]) => {
        toolbar.querySelectorAll(selector).forEach((el) => {
          (el as HTMLElement).setAttribute('title', title);
          (el as HTMLElement).setAttribute('aria-label', title);
        });
      });
    };

    setTitles();
    const timeoutId = window.setTimeout(setTitles, 500);
    const observer = new MutationObserver(setTitles);
    observer.observe(container, { childList: true, subtree: true });
    return () => {
      window.clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      toast.loading('Uploading image...', { id: 'upload' });

      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setValue('coverImage', data.data.url, { shouldValidate: true });
      toast.success('Image uploaded successfully!', { id: 'upload' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Image upload failed.', { id: 'upload' });
    }
  };

  const validateImageUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const pathname = urlObj.pathname.toLowerCase();
      return (
        validExtensions.some(ext => pathname.endsWith(ext)) ||
        pathname.includes('/image/') ||
        urlObj.hostname.includes('cloudinary.com') ||
        urlObj.hostname.includes('imgur.com') ||
        urlObj.hostname.includes('unsplash.com')
      );
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue('coverImage', url, { shouldValidate: true });

    if (url && !validateImageUrl(url)) {
      toast('Please ensure the URL points to a valid image.', { icon: '⚠️' });
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
    <BlogContainer>
      <AdminGlassCard title="Create New Post">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>Cover Image</Label>

              {/* Upload Mode Toggle */}
              <div className="flex gap-2 mt-2 mb-3">
                <Button
                  type="button"
                  variant={uploadMode === 'url' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => { setUploadMode('url'); setValue('coverImage', '', { shouldValidate: true }); }}
                  className="flex-1"
                >
                  📎 Paste URL
                </Button>
                <Button
                  type="button"
                  variant={uploadMode === 'upload' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => { setUploadMode('upload'); setValue('coverImage', '', { shouldValidate: true }); }}
                  className="flex-1"
                >
                  📁 Upload File
                </Button>
              </div>

              {/* Conditional Input Based on Mode */}
              {uploadMode === 'url' ? (
                <div>
                  <Input
                    {...register('coverImage')}
                    placeholder="https://example.com/image.jpg"
                    onChange={handleUrlChange}
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-500">
                    Paste a direct link to an image (JPG, PNG, GIF, WebP)
                  </p>
                </div>
              ) : (
                <div>
                  <Input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-500">
                    Upload an image file (Max 5MB, JPG/PNG/GIF/WebP)
                  </p>
                </div>
              )}

              {/* Error Display */}
              {errors.coverImage && (
                <p className="text-red-500 text-xs mt-1">{errors.coverImage.message}</p>
              )}

              {/* Image Preview */}
              {watchCoverImage && (
                <div className="mt-3">
                  <Label className="text-sm text-gray-400">Preview:</Label>
                  <div className="mt-1 relative">
                    <img
                      src={watchCoverImage}
                      alt="Cover preview"
                      className="w-full max-w-md h-32 object-cover rounded-lg border border-white/20"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        toast.error('Failed to load image preview. Please check the URL.');
                      }}
                      onLoad={(e) => {
                        e.currentTarget.style.display = 'block';
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setValue('coverImage', '', { shouldValidate: true })}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              )}

              {/* Current URL Display (for reference) */}
              {watchCoverImage && (
                <div className="mt-2">
                  <Label className="text-xs text-gray-500">Image URL:</Label>
                  <div className="text-xs text-gray-400 break-all bg-white/5 p-2 rounded border">
                    {watchCoverImage}
                  </div>
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
                  <div className="mt-2" ref={quillContainerRef}>
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
                        formats={[
                          'header',
                          'bold', 'italic', 'underline', 'strike',
                          'list', 'bullet',
                          'blockquote', 'code-block',
                          'link', 'image'
                        ]}
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
      </AdminGlassCard>
    </BlogContainer>
  );
} 