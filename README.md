# SecurityX - Advanced Cybersecurity for Digital Business

Comprehensive security solutions designed to protect, detect, and respond to cyber threats. Enhanced security posture, compliance, and resilience for modern businesses.

## Version History

### v1.35.0 - Contact Form Integration & Management System MINOR
- Implemented complete contact form API integration replacing simulated submissions with real backend calls
- Added comprehensive contact management system at `/admin/contacts` with filtering, searching, pagination, and status/priority management
- Created contact analytics dashboard at `/admin/contacts/analytics` with submission trends and insights
- Enhanced admin navigation with dedicated contacts section and comprehensive sidebar navigation
- Added contact statistics integration to admin dashboard with recent submissions overview
- Implemented contact detail modal with internal notes functionality for better customer relationship management
- Updated toast notifications styling for better visual consistency across the platform
- Added proper error handling for different API response scenarios (rate limiting, validation errors, server errors)

### v1.34.0 - Dashboard Navigation Enhancement MINOR
- Added dashboard button to user profile menu in navigation bar for quick access
- Implemented role-based dashboard routing: admins go to /admin/dashboard, readers go to /dashboard
- Enhanced both desktop dropdown and mobile menu with dashboard navigation
- Improved user experience with instant access to personalized dashboard based on user role

### v1.33.0 - Image Position Adjustment Feature MINOR
- Added image position controls to blog post creation and editing interfaces with 9-point grid positioning system
- Users can now select focal points for cover images (top/center/bottom + left/center/right combinations)
- Enhanced image preview with real-time position adjustment feedback in admin panels
- Updated BlogCard and BlogPostTemplate components to respect image positioning for better thumbnail control
- Improved visual control over how cover images are displayed across the platform

### v1.32.0 - Blog Post Image URL Editing Feature MINOR
- Enhanced blog post edit page to support both file upload and manual URL entry for cover images
- Added toggle buttons to switch between "Upload File" and "Enter URL" modes in the admin edit interface
- Improved user flexibility by allowing direct image URL editing alongside existing file upload functionality
- Maintained existing validation and error handling for both input methods

### v1.31.0 - Blog Card Clickable Overlay Fix MINOR
- Fixed blog card clickable overlay issue where focus outline artifacts appeared on cards of varying sizes
- Replaced button wrapper with semantic anchor tag for better accessibility and SEO
- Improved focus styles using focus-visible for keyboard navigation without mouse click artifacts
- Enhanced clickable area to always match card boundaries perfectly across all screen sizes
- Added comprehensive test plan for e2e and visual regression testing

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
