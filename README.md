# SecurityX - Advanced Cybersecurity for Digital Business

Comprehensive security solutions designed to protect, detect, and respond to cyber threats. Enhanced security posture, compliance, and resilience for modern businesses.

## 📋 Version History

### v1.18.0 - CORS Implementation (Current)
- **Enhanced Error Handling**: Comprehensive CORS error handling in API client
- **CORS Error Page**: User-friendly error page for CORS issues
- **Environment Configuration**: Separate configs for development and production
- **Authentication CORS Handling**: CORS-aware authentication with proper error states
- **Custom CORSError Class**: Specialized error handling for CORS violations
- **Network Error Detection**: Improved handling of network and CORS-related errors
- **Session Management**: Enhanced session expiration and redirect handling
- **Toast Notifications**: User-friendly error messages for CORS issues

## 🚀 Features

- **Advanced Security Solutions**: Penetration testing, AI security, red teaming, and training
- **Professional Blog**: Industry insights and cybersecurity expertise
- **Team Showcase**: Meet our security experts and researchers
- **Publications**: Research papers and security publications
- **Contact System**: Get in touch for security assessments and consultations
- **Admin Panel**: Content management and user administration
- **Authentication**: Secure login and user management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT with secure cookie storage
- **UI Components**: Radix UI, Lucide Icons
- **Styling**: Glassmorphism effects, custom gradients
- **Deployment**: Vercel (Frontend), Render (Backend)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/security-x.git
   cd security-x
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the environment variables with your configuration.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_CORS_DEBUG=true
NEXT_PUBLIC_SHOW_API_ERRORS=true
```

For production, create a `.env.production` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_APP_URL=https://sec-x.netlify.app

# Feature Flags
NEXT_PUBLIC_ENABLE_CORS_DEBUG=false
NEXT_PUBLIC_SHOW_API_ERRORS=false
```

### Backend Setup

The backend API should be running and accessible. Update the API URL in `lib/api.ts` to match your backend configuration.

## 📁 Project Structure

```
security-x/
├── app/                    # Next.js app directory
│   ├── components/        # Reusable UI components
│   ├── admin/            # Admin panel pages
│   ├── blog/             # Blog pages and components
│   ├── contact/          # Contact form and layout
│   └── globals.css       # Global styles
├── components/           # Shared UI components
├── context/             # React context providers
├── lib/                 # Utility functions and API
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

## 🚀 Deployment

### Frontend (Vercel)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Backend (Render)

1. **Create a new Web Service** on Render
2. **Connect your backend repository**
3. **Set environment variables** for database and secrets
4. **Deploy** the backend service

## 📝 Changelog

### Version 1.18.0
- **Logo Branding Update**: Replaced lock icons with sec-x-logo.png in navigation and footer
  - **Navigation Component**: Replaced lock SVG icon with sec-x-logo.png image in the navigation bar
    - Removed orange gradient background container for cleaner appearance
    - Added Next.js Image component for optimized logo display
    - Set logo size to 32x32px (w-8 h-8) for proper visibility
    - Maintained aspect ratio with object-contain class
  - **Footer Component**: Replaced lock SVG icon with sec-x-logo.png image in the footer
    - Removed orange gradient background container for consistent branding
    - Added Next.js Image component for optimized logo display
    - Set logo size to 24x24px (w-6 h-6) for footer scaling
    - Maintained aspect ratio with object-contain class
  - **Brand Consistency**: Unified logo usage across the entire website
    - Consistent sec-x-logo.png display in both navigation and footer
    - Professional shield and circuit board design prominently featured
    - Enhanced brand recognition and visual identity
  - **Technical Implementation**: Added Image import from next/image in both components
    - Proper alt text for accessibility
    - Optimized image loading with Next.js Image component
    - Clean, direct logo display without background containers

### Version 1.17.6
- **Contact Page Wave Background Removal**: Removed animated wave visualizer background for cleaner design
  - **Canvas Elements Removed**: Eliminated all canvas elements from contact page, success state, and loading component
  - **Animation Code Cleanup**: Removed ContactFormWithCanvas function and entire wave animation useEffect
  - **React Import Cleanup**: Removed React import that was only used for wave animation
  - **Simplified Architecture**: Updated main export to use ContactForm directly instead of wrapper component
  - **Performance Improvement**: Reduced JavaScript bundle size and eliminated canvas rendering overhead
  - **Visual Impact**: Clean black background without animated waves for better focus on contact form content

### Version 1.17.5
- **Contact Page S Logo Box Dark Enhancement**: Changed background from white to black opacity for better contrast
  - **Background Opacity**: Updated background to `rgba(0, 0, 0, 0.20)` for 20% black opacity
  - **Enhanced Contrast**: Dark background provides better contrast with white S text and glow effect
  - **Backdrop Filter**: Maintained `backdropFilter: 'blur(10px)'` for glassmorphism effect
  - **Visual Impact**: S logo box now has a more sophisticated dark glass appearance
  - **Design Improvement**: Better readability and more prominent central focal point

### Version 1.17.4
- **Contact Page S Logo Box Opacity Enhancement**: Increased opacity of translucent glass box around S icon
  - **Background Opacity**: Enhanced background to `rgba(255, 255, 255, 0.15)` for 15% white opacity
  - **Backdrop Filter**: Maintained `backdropFilter: 'blur(10px)'` for glassmorphism effect
  - **Direct Styling**: Replaced `glass` class with inline styles for precise opacity control
  - **Visual Impact**: S logo box now appears more prominent and visible while preserving elegant glass aesthetic
  - **Design Balance**: Perfect balance between visibility and translucent glassmorphism design

### Version 1.17.3
- **Contact Page Connector Lines Enhancement**: Extended connection lines by 25% for more elegant UI design
  - **Line Extension**: Increased connector line length from center to corner icons by 25%
  - **Coordinate Updates**: Updated SVG path coordinates and circle positions for perfect alignment
    - Top left: (120,80) → (100,68) - closer to lock icon
    - Top right: (280,80) → (300,68) - closer to checkmark icon
    - Bottom left: (120,170) → (100,182) - closer to key icon
    - Bottom right: (280,170) → (300,182) - closer to chart icon
  - **Visual Impact**: More connected and elegant appearance with enhanced visual flow
  - **Design Consistency**: Maintains perfect alignment with central S logo while improving overall aesthetics

### Version 1.17.2
- **Contact Page S Logo Opacity Enhancement**: Increased S logo visibility for better prominence
  - **Full Opacity**: Added `opacity-100` class to ensure maximum visibility
  - **Text Glow Effect**: Added white text shadow `textShadow: '0 0 10px rgba(255,255,255,0.8)'` for enhanced prominence
  - **Visual Impact**: S logo now appears brighter and more prominent as the central focal point
  - **User Experience**: Improved readability and visual hierarchy in the contact page design

### Version 1.17.1
- **Contact Page S Logo Alignment Fix**: Fixed misalignment of central "S" logo with SVG connection lines
  - **Perfect Positioning**: Replaced Tailwind positioning classes with inline styles using `style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}`
  - **Enhanced Visibility**: Added `inner-glow` class and updated border to `border-blue-400/50` for better prominence
  - **Animation Optimization**: Moved `animate-schema-pulse` class to inner div for proper animation flow
  - **SVG Alignment**: Logo now perfectly aligns with connection lines convergence point at coordinates (200,125) in 400x250 viewBox
  - **Visual Impact**: S logo appears more alive and prominent with full opacity and enhanced glow effects
  - **Technical Accuracy**: Inline styles ensure exact positioning at 50% horizontal and vertical alignment

### Version 1.17.0
- **Contact Page Color Theme Fix**: Updated contact page to match the website's main black/white/glass aesthetic
  - **CSS Classes Updated**: Modified `.card-border`, `.gradient-border`, and `.inner-glow` classes in globals.css
    - Replaced indigo-heavy theme with clean white/glass effects using `rgba(255, 255, 255, 0.05)` backgrounds
    - Updated borders to use `rgba(255, 255, 255, 0.2)` instead of indigo colors  
    - Simplified box-shadow effects with white glow instead of multi-color indigo/purple shadows
  - **Component Color Updates**: Replaced all indigo color references with blue-400 accents
    - Updated all form input focus states from `focus:border-indigo-400` to `focus:border-blue-400`
    - Changed visual icon borders from colored borders to consistent `border-white/20`
    - Updated badge styling from `text-indigo-300` and `border-indigo-400/30` to `text-blue-300` and `border-white/20`
    - Modified CTA buttons from `from-indigo-500 to-purple-600` to `from-blue-500 to-purple-600`
    - Updated "Call us" link from `text-indigo-400` to `text-blue-400`
  - **Wave Visualizer Colors**: Updated canvas animation colors to match blue theme
    - Changed wave base colors from indigo RGB(79,70,229) to blue RGB(59,130,246)
    - Maintained smooth animations while using consistent color palette
  - **Visual Consistency**: Contact page now seamlessly blends with the rest of the website
    - Same black background with subtle glass effects as other pages
    - Consistent blue accent color usage throughout the site
    - Professional glassmorphism styling with white borders and transparent backgrounds

### Version 1.16.0
- **Navigation UX Improvement**: Removed conditional button logic for consistent navigation experience.
  - **Eliminated Conditional Logic**: Removed the `isBlogPage` check that changed "Contact" to "Log In" on blog pages
  - **Permanent Button Display**: Both "Contact" and "Log In" buttons are now always visible in the navigation
  - **Consistent User Experience**: Users can access both contact and login functionality from any page
  - **Desktop Navigation**: Added both buttons side by side with proper spacing
  - **Mobile Navigation**: Both buttons are available in the mobile menu with vertical layout
  - **Improved Accessibility**: Clear, predictable navigation without confusing button changes
  - **Technical Implementation**: Updated Navigation component to remove conditional rendering and add permanent button layout

### Version 1.15.6
- **Bug Fix**: Resolved Content Security Policy (CSP) blocking API calls to backend.
  - Fixed CSP directive in `middleware.ts` to allow connections to `https://sec-x-backend.onrender.com`
  - Resolved "Network Error" caused by CSP blocking axios requests to the backend API
  - This fixes blog loading, authentication, user management, and all backend API functionality

### Version 1.15.5
- **Security Enhancement**: Added a strict Content Security Policy (CSP).
  - Defined CSP headers in `vercel.json` to enforce security policies on Vercel deployments.
  - Mirrored the CSP headers in `next.config.mjs` for consistent security during local development.
  - The policy restricts sources for scripts and connections, enhancing protection against XSS and other injection attacks.

### Version 1.15.4
- **Conditional Navigation**: Implemented conditional logic in the navigation bar.
  - On the blog page (`/blog`), the "Contact" button is now hidden.
  - A "Log In" button is displayed in its place, directing users to the `/login` page.
  - This change applies to both desktop and mobile navigation menus for a consistent user experience.

### Version 1.15.3
- **Hero Animation Fix**: Resolved a visual glitch in the hero section's card animation that occurred on page reload.
  - Replaced the CSS `animation` with a more stable CSS `transition` to prevent flickering during hydration.
  - Used `isMounted` state to reliably trigger the fade-in effect only on the client-side, ensuring a smooth and professional entry animation on all loads.
  - Removed redundant animation-delay styles and classes in favor of streamlined Tailwind CSS transition and opacity utilities.
  
### Version 1.15.2
- **Missing Dependencies Resolution**: Comprehensive audit and installation of missing packages
  - **react-share**: Installed `react-share` package for social media sharing functionality
  - **@types/react-share**: Added TypeScript definitions for proper type support
  - **@radix-ui/react-avatar**: Installed missing Radix UI Avatar component
  - **Security Updates**: Fixed security vulnerabilities through `npm audit fix`
    - Resolved brace-expansion Regular Expression Denial of Service vulnerability
    - Fixed Next.js Authorization Bypass and Information exposure vulnerabilities
    - Updated to Next.js 15.3.5 with security patches
  - **TypeScript Fixes**: Corrected FacebookShareButton prop from `quote` to `title`
  - **Build Verification**: Successful production build with all dependencies resolved
  - **Performance Optimization**: Updated 36 packages and added 3 new security patches

### Version 1.15.1
- **Dependency Update**: Fixed React 19 compatibility issue
  - **react-quill Migration**: Replaced `react-quill@^2.0.0` with `react-quill-new@^3.4.6`
  - **React 19 Support**: Resolved Vercel deployment error caused by dependency conflict
  - **Build Optimization**: Ensured compatibility with React 19 and Quill 2.0+
  - **Admin Panel**: Updated rich text editor imports in post creation and editing pages
  - **TypeScript Support**: Maintained full type safety with built-in declarations
  - **Production Ready**: Successful build verification without dependency conflicts

### Version 1.15.0
- **Blog UI Redesign**: Complete transformation of blog page to match Publications page design
  - **Publications-Style Layout**: Implemented dual-view system with list and detail views
    - **List View**: Professional blog cards with cover images, category badges, author info, and statistics
    - **Detail View**: Full blog post display with enhanced formatting, comments, and social sharing
  - **New BlogCard Component**: Created comprehensive blog preview cards with:
    - Cover image with hover animations and scale effects
    - Category color-coding system (12 different categories)
    - Author information with avatars and publication dates
    - Tag system with truncation for space efficiency
    - View counts, comment counts, and reading time statistics
    - Professional glassmorphism styling with backdrop blur effects
  - **Enhanced Content Formatting**: Implemented advanced content formatter utility
    - **Markdown Support**: Automatic parsing of headings (H1, H2, H3), bullet points, and paragraphs
    - **Professional Typography**: Consistent styling with `text-white/80`, `leading-relaxed`, and proper spacing
    - **Code Block Support**: Formatted code snippets with syntax highlighting
    - **Quote Formatting**: Styled blockquotes with border and background effects
    - **List Formatting**: Custom bullet points with matching Publications page styling
  - **Improved Blog Features**: Enhanced existing blog functionality
    - **Comments Integration**: Professional comments section with glassmorphism styling
    - **Social Sharing**: Enhanced sharing buttons with consistent design
    - **Navigation**: Smooth transitions between list and detail views
    - **Search Integration**: Maintained search functionality with improved layout
  - **Visual Consistency**: Matched Publications page aesthetic throughout
    - **Glass Morphism**: Consistent backdrop blur and border effects
    - **Color Scheme**: Proper category color mapping and typography
    - **Responsive Design**: Mobile-first approach with proper spacing
    - **Animations**: Staggered loading animations and hover effects
  - **Technical Improvements**: Enhanced performance and maintainability
    - **Content Formatter Utility**: Reusable formatting system for blog content
    - **TypeScript Support**: Full type safety for blog components
    - **Next.js 15 Compatibility**: Updated params handling for dynamic routes
    - **Build Optimization**: Maintained performance with new components

### Version 1.14.3
- **Bug Fix**: Resolved React hydration mismatch caused by browser extension altering DOM attributes.
  - Added `suppressHydrationWarning` to the shared `Input` component so unexpected attributes injected by extensions (e.g., `data-sharkid`) no longer break hydration.

### Version 1.14.2
- **Bug Fix**: Corrected the backend API port in the frontend configuration.
  - **API URL Fix**: Updated the `baseURL` in `lib/api.ts` to use port `8080` instead of `3000`, aligning the frontend's API requests with the running backend server. This resolves the 404 error when fetching blog posts.

### Version 1.14.1
- **Bug Fix**: Corrected the API endpoint for fetching blog posts.
  - **API URL Fix**: Removed the `/api/v1` prefix from the `baseURL` in `lib/api.ts` to align with the Express server's routing structure. This resolves the "Failed to load blog posts" error.

### **Version 1.14**
- **Blog Template System**: Implemented comprehensive blog post template with dynamic routing
  - **Dynamic Routes**: Added `/blog/[slug]` routing for individual blog posts
  - **Blog Post Template**: Created reusable BlogPostTemplate component with rich content formatting
  - **Content Management**: Comprehensive blog data structure with full articles, metadata, and SEO information
  - **Interactive Navigation**: Clickable blog cards that navigate to individual posts
  - **SEO Optimization**: Complete metadata generation including OpenGraph and Twitter cards
  - **Social Features**: Social sharing buttons for Twitter and LinkedIn
  - **Rich Content**: Markdown-style content rendering with proper typography
  - **Tagging System**: Tag-based content categorization and display
  - **Professional Layout**: Article header with author info, date, category, and read time

### Version 1.13
- **Blog Feature Implementation**: Added comprehensive blog section with modern layout
  - **Navigation Update**: Added Blog button to both desktop and mobile navigation menus
  - **Blog Page Layout**: Created `/blog` page with hero section, featured categories, and article grid
  - **Content Management**: Sample blog posts with metadata including author, date, category, and read time
  - **Interactive Elements**: Newsletter subscription form and hover effects on articles
  - **Responsive Design**: Full mobile and desktop compatibility with smooth animations
  - **Category System**: Organized content by AI Security, Red Teaming, Penetration Testing, and Security Architecture

### Version 1.12.1
- **Contact Page Layout Fix**: Resolved overlay issue where navigation and footer appeared behind contact form
  - **Proper Page Integration**: Converted from fixed overlay positioning to normal page flow with `min-h-screen`
  - **Navigation Visibility**: Contact page now properly integrates with site navigation instead of covering it
  - **Canvas Background**: Updated wave visualizer to use `-z-10` positioning behind content while maintaining animations
  - **Responsive Padding**: Added proper top padding (`pt-20`) to account for fixed navigation bar
  - **Animation Cleanup**: Improved canvas animation cleanup with proper `cancelAnimationFrame` for better performance
  - **Layout Structure**: Maintained exact visual design while fixing underlying layout architecture
  - **User Experience**: Navigation remains fully functional and footer appears below contact form as intended

### Version 1.12
- **Contact Page Modern Glass Design**: Complete transformation of contact page with cutting-edge glassmorphism design
  - **Split-Screen Layout**: Implemented 50/50 split design with animated visual section and contact form
    - Left side: Branding section with animated connection diagram, floating feature icons, and central logo
    - Right side: Enhanced contact form with modern glass-morphism styling and improved user experience
    - Responsive vertical stacking on mobile devices with optimized spacing and sizing
  - **Animated Wave Canvas Background**: Added dynamic 8-layer wave visualizer with real-time frequency updates
    - Blue-purple gradient color scheme with customizable intensity and speed
    - Responsive canvas sizing that adapts to all screen dimensions
    - Smooth 60fps animations with optimized performance
  - **Enhanced Form Features**: Upgraded contact form with advanced functionality
    - **Country Code Dropdown**: Comprehensive phone input with searchable country selection
      - Flag icons for 10+ major countries (US, UK, CA, AU, DE, FR, JP, CN, IN, BR)
      - Search functionality within dropdown for quick country finding
      - Mobile-responsive dropdown sizing and positioning
    - **Preserved Functionality**: All existing form validation, submission handling, and success states maintained
    - **Glass-Morphism Styling**: Form inputs with backdrop blur, gradient borders, and inner glow effects
  - **Advanced Visual Effects**: Premium glassmorphism design system implementation
    - **Gradient Borders**: Multi-color animated borders with mask composite techniques
    - **Inner Glow Effects**: Multi-layer box-shadow system for depth and premium feel
    - **Floating Animations**: Service icons with staggered animation delays for organic movement
    - **Connection Diagram**: SVG-based animated connection lines with gradient colors and pulse effects
  - **Typography & Branding**: Integrated Geist font family for modern, clean typography
    - Updated layout.tsx to include Geist font loading for optimal performance
    - Consistent font-weight hierarchy throughout the contact experience
  - **Mobile-First Responsive Design**: Comprehensive responsive implementation
    - Vertical layout stacking on mobile with appropriate spacing adjustments
    - Touch-friendly form controls and dropdown interactions
    - Optimized visual hierarchy for smaller screen sizes
    - Horizontal to vertical divider transitions for clean mobile presentation
  - **Accessibility Enhancements**: Improved form accessibility and user experience
    - Proper ARIA labels for all form fields and interactive elements
    - Keyboard navigation support throughout the interface
    - Screen reader compatibility with semantic HTML structure
    - Focus indicators that work seamlessly with glass design aesthetic

### Version 1.11.3
- **Card Buttons Functionality**: Updated all rotating card buttons to navigate to contact page
  - **Contact Page Integration**: All 4 service card buttons now link to `/contact` for user inquiries
    - Card 1 (Penetration Testing): "Learn More" button → Links to contact page
    - Card 2 (AI Security): Changed "Coming Soon" to "Get In Touch" → Links to contact page
    - Card 3 (Red Teaming): "Get Started" button → Links to contact page
    - Card 4 (Training): "Join Training" button → Links to contact page
  - **Technical Implementation**: Converted button elements to Next.js Link components
    - Maintained all existing glassmorphism styling and hover effects
    - Added proper `text-center block` classes for Link behavior
    - Preserved responsive design and visual consistency
  - **Improved User Journey**: Enhanced call-to-action functionality for better conversion
    - Direct path from service showcase to contact/inquiry form
    - Consistent user experience across all service cards
    - Better lead generation and customer engagement flow

### Version 1.11.2
- **Navigation UX Enhancement**: Moved left and right navigation arrows closer to rotating cards
  - **Improved Positioning**: Reduced distance between arrows and card edges for better UX
    - Left arrow: Changed from `left-2 sm:left-4` to `left-1 sm:left-2`
    - Right arrow: Changed from `right-2 sm:right-4` to `