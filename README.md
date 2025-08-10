# SecurityX - Advanced Cybersecurity for Digital Business

Comprehensive security solutions designed to protect, detect, and respond to cyber threats. Enhanced security posture, compliance, and resilience for modern businesses.

## Version History

### v1.30.1 - Blog Administration & Security Enhancement PATCH
- Fixed admin dashboard loading issue where manually inserted MongoDB blogs weren't appearing due to incorrect `status=all` query handling in `getAllBlogs` controller.
- Updated admin edit URLs from ID-based (`/admin/posts/edit/${post._id}`) to slug-based (`/admin/posts/edit/${post.slug}`) to eliminate MongoDB ObjectId exposure.
- Modified edit page API calls from `/blogs/id/${id}` to `/blogs/slug/${slug}` while maintaining PUT requests using internal IDs from fetched data.
- Enhanced edit page error handling with 404-specific messages, loading states, and data validation checks to prevent form submission when blog data isn't loaded.

### v1.30.0 - Registration API Payload Fix PATCH
- Fixed registration API payload mapping to resolve "username is required" error.
- Updated `context/AuthContext.tsx` to map `name` field to `username` in the registration request.
- Changed payload from `{ name, email, password }` to `{ username: name, email, password }`.
- Resolves backend validation error while maintaining frontend form field as "name" for better UX.

### v1.29.0 - Performance & Accessibility (Phase 5) MINOR
- Implemented blog pagination: added `components/blog/BlogPagination.tsx` and integrated into `/app/blog/page.tsx` with URL param support.
- Enhanced accessibility in `BlogCard` (descriptive alt text, ARIA, lazy-loaded images, focus states).
- Added `lib/performance.ts` with helpers (`getOptimizedImageUrl`, `lazyWithPreload`, `useDebounce`).
- Improved admin editor performance: lazy loading `ReactQuill` with styled loading fallbacks.

For the complete release history (including older versions and detailed changelog), see [Version.md](Version.md).
