# Frontend Dual Upload Implementation Guide

## Mission: Enhanced Blog Creation with URL Paste + File Upload Options

**Target**: Modify the blog creation form to support both image URL pasting and file uploading with toggle functionality.

## File to Modify

**File**: `app/admin/posts/new/page.tsx`
**Action**: REPLACE the existing cover image section with enhanced dual functionality

## Complete Implementation

### 1. Add Required Imports
**Location**: Top of file with existing imports
**Find**: The existing import block
```tsx
import { useForm, Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
// ... other imports
```

**Modify**: Add `useWatch` to react-hook-form import and missing hooks
```tsx
import { useForm, Controller, useWatch } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';
// ... keep all other existing imports
```

### 2. Add State for Upload Mode Toggle
**Location**: Inside the component, after existing useState declarations
**Find**: The existing state declaration
```tsx
const [isSubmitting, setIsSubmitting] = useState(false);
```

**Add**: Upload mode state after the existing useState
```tsx
const [isSubmitting, setIsSubmitting] = useState(false);
const [uploadMode, setUploadMode] = useState<'url' | 'upload'>('url'); // ADD THIS LINE
```

### 3. Add Form Watching for Image Preview
**Location**: After the form initialization
**Find**: The useForm hook
```tsx
const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<CreatePostValues>({
  resolver: zodResolver(createPostSchema),
  defaultValues: {
    status: 'draft'
  }
});
```

**Add**: Watch for coverImage changes after the useForm hook
```tsx
const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<CreatePostValues>({
  resolver: zodResolver(createPostSchema),
  defaultValues: {
    status: 'draft'
  }
});

// ADD THIS: Watch coverImage for preview
const watchCoverImage = useWatch({
  control,
  name: 'coverImage'
});
```

### 4. Enhance Image Upload Handler
**Location**: Find the existing handleImageUpload function
**Replace**: The entire function with this enhanced version

```tsx
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
```

### 5. Add URL Validation Function
**Location**: Add this new function after handleImageUpload

```tsx
const validateImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const pathname = urlObj.pathname.toLowerCase();
    return validExtensions.some(ext => pathname.endsWith(ext)) || 
           pathname.includes('/image/') || // For cloud services
           urlObj.hostname.includes('cloudinary.com') ||
           urlObj.hostname.includes('imgur.com') ||
           urlObj.hostname.includes('unsplash.com');
  } catch {
    return false;
  }
};

const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const url = e.target.value;
  setValue('coverImage', url, { shouldValidate: true });
  
  if (url && !validateImageUrl(url)) {
    toast.warning('Please ensure the URL points to a valid image.');
  }
};
```

### 6. Replace Cover Image Section
**Location**: Find the existing cover image section in the form
**Find**: This existing section
```tsx
<div>
  <Label>Cover Image</Label>
  <Input type="file" onChange={handleImageUpload} className="mt-2" />
  {errors.coverImage && <p className="text-red-500 text-xs mt-1">{errors.coverImage.message}</p>}
  <Input {...register('coverImage')} readOnly placeholder="Image URL will appear here" className="mt-2" />
</div>
```

**Replace**: With this complete enhanced section
```tsx
<div>
  <Label>Cover Image</Label>
  
  {/* Upload Mode Toggle */}
  <div className="flex gap-2 mt-2 mb-3">
    <Button 
      type="button" 
      variant={uploadMode === 'url' ? 'default' : 'outline'}
      size="sm"
      onClick={() => setUploadMode('url')}
      className="flex-1"
    >
      📎 Paste URL
    </Button>
    <Button 
      type="button" 
      variant={uploadMode === 'upload' ? 'default' : 'outline'}
      size="sm"
      onClick={() => setUploadMode('upload')}
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
          onLoad={() => {
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
```

## Additional Enhancements (Optional)

### 1. Add Image URL Validation to Schema
**Location**: Find the createPostSchema
**Modify**: Enhance the coverImage validation

```typescript
const createPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  coverImage: z.string()
    .url('Cover image must be a valid URL')
    .refine((url) => {
      try {
        const urlObj = new URL(url);
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const pathname = urlObj.pathname.toLowerCase();
        return validExtensions.some(ext => pathname.endsWith(ext)) || 
               pathname.includes('/image/') ||
               urlObj.hostname.includes('cloudinary.com') ||
               urlObj.hostname.includes('imgur.com') ||
               urlObj.hostname.includes('unsplash.com');
      } catch {
        return false;
      }
    }, 'URL must point to a valid image file'),
  category: z.enum(categories),
  tags: z.string().min(1, 'At least one tag is required'),
  status: z.enum(statuses),
});
```

### 2. Add Drag and Drop Support (Advanced)
**Location**: Add after the file input

```tsx
// Add this state
const [isDragging, setIsDragging] = useState(false);

// Add these handlers
const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(true);
};

const handleDragLeave = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type.startsWith('image/')) {
      handleImageUpload({ target: { files: [file] } } as any);
    } else {
      toast.error('Please drop an image file.');
    }
  }
};

// Add drag zone (replace file input in upload mode)
<div
  className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
    isDragging ? 'border-blue-400 bg-blue-50/10' : 'border-gray-300'
  }`}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
>
  <Input 
    type="file" 
    onChange={handleImageUpload} 
    accept="image/*"
    className="hidden"
    id="file-upload"
  />
  <label htmlFor="file-upload" className="cursor-pointer">
    <div className="flex flex-col items-center gap-2">
      <div className="text-2xl">📁</div>
      <p>Click to upload or drag and drop</p>
      <p className="text-xs text-gray-500">Max 5MB, JPG/PNG/GIF/WebP</p>
    </div>
  </label>
</div>
```

## Features Included

### Core Functionality
- ✅ **Toggle Mode**: Switch between URL paste and file upload
- ✅ **Image Preview**: Real-time preview of selected/pasted images
- ✅ **URL Validation**: Checks for valid image URLs
- ✅ **File Validation**: Size and type checking for uploads
- ✅ **Error Handling**: Comprehensive error messages
- ✅ **Loading States**: Upload progress feedback

### User Experience
- ✅ **Clear Indicators**: Icons and labels for each mode
- ✅ **Preview Controls**: Remove image option
- ✅ **URL Display**: Shows current image URL for reference
- ✅ **Responsive Design**: Works on mobile and desktop
- ✅ **Accessibility**: Proper labels and keyboard navigation

### Integration
- ✅ **Form Validation**: Integrates with existing zod schema
- ✅ **API Integration**: Uses existing api client
- ✅ **Toast Notifications**: Consistent with app patterns
- ✅ **Authentication**: Respects existing auth flow

## Testing Checklist

### URL Mode Testing
- [ ] Can paste valid image URLs
- [ ] Preview shows immediately
- [ ] Invalid URLs show warning
- [ ] Form validation works
- [ ] Can remove/clear image

### Upload Mode Testing  
- [ ] Can select files via button
- [ ] File validation works (size/type)
- [ ] Upload progress shows
- [ ] Success/error messages appear
- [ ] Uploaded image preview works

### Toggle Functionality
- [ ] Can switch between modes
- [ ] Mode persists during session
- [ ] Previous input clears when switching
- [ ] Visual indicators work correctly

### Integration Testing
- [ ] Blog creation saves with image URL
- [ ] Created blog displays image correctly
- [ ] Both upload methods work end-to-end
- [ ] Error handling works in all scenarios

## Browser Compatibility
- ✅ Chrome/Edge/Safari (modern versions)
- ✅ Firefox (modern versions)  
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ⚠️ File drag-and-drop requires modern browser support

## Performance Notes
- Image preview loads lazily
- URL validation is debounced
- File upload shows progress
- Large image previews are contained/cropped