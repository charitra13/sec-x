# Sec-X - Advanced Cybersecurity Solutions

![Version](https://img.shields.io/badge/version-1.12.1-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38bdf8.svg)

A modern, responsive cybersecurity company website built with Next.js, TypeScript, and Tailwind CSS. Showcasing advanced security services including red teaming, penetration testing, and AI security assessments.

## 🚀 Features

- **Modern Design**: Clean, professional interface with glassmorphism effects
- **Dual-Font Typography**: Manrope for headings, Inter for body text with optimized weights
- **Responsive Layout**: Fully responsive across all devices
- **Contact Forms**: Dynamic contact and security assessment forms
- **Team Showcase**: Interactive team member profiles with achievements
- **Publications**: Security research and whitepapers section
- **SEO Optimized**: Proper meta tags, sitemap, and robots.txt
- **Performance**: Optimized for speed and Core Web Vitals

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **State Management**: React Context API
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
sec-x/
├── app/
│   ├── components/
│   │   ├── ContactForm.tsx
│   │   ├── ContactFormProvider.tsx
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── ClientLayout.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── team/
│   │   └── page.tsx
│   ├── publications/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── favicon.ico
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/charitra13/sec-x.git
cd sec-x
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏢 About Sec-X

Sec-X is a cybersecurity firm founded in 2023 in Indore, Madhya Pradesh, specializing in:

- **Red Team Operations**: Advanced penetration testing and security assessments
- **AI Security**: Cutting-edge AI system security validation
- **Penetration Testing**: Comprehensive vulnerability assessments
- **Security Training**: Free cybersecurity education programs
- **Incident Response**: Rapid security incident handling

### Team Recognition

- Hall of Fame recognition from Google and Mastercard
- Industry certifications: OSCP, eWPTXv2, CRTP, Security+
- Expertise in ethical hacking and responsible disclosure

## 📄 Pages Overview

### Home Page (`/`)
- Hero section with service overview
- Company introduction with animated elements
- Call-to-action buttons for contact and assessments

### About Page (`/about`)
- Company story and mission
- Vision and innovation focus
- Service offerings and team expertise

### Team Page (`/team`)
- Interactive team member profiles
- Detailed achievements and certifications
- Expandable member information cards

### Publications Page (`/publications`)
- Security research papers and whitepapers
- Categorized by expertise areas
- Regular updates on cybersecurity trends

## 🎨 Key Components

### ContactForm
Dynamic modal form component with:
- Contact form for general inquiries
- Security assessment form with service selection
- Form validation and success messaging

### Navigation
Responsive navigation with:
- Desktop and mobile layouts
- Contact form integration
- Smooth transitions and hover effects

### ContactFormProvider
Context-based state management for:
- Global contact form state
- Modal management across pages
- Type-specific form rendering

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Build & Deployment

The project is optimized for deployment on Vercel:

```bash
npm run build
```

## 📈 SEO & Performance

- **Sitemap**: Auto-generated for all pages
- **Robots.txt**: Search engine optimization
- **Meta Tags**: Comprehensive SEO metadata
- **Performance**: Optimized images and code splitting
- **Accessibility**: WCAG compliance considerations

## 🔒 Security Features

- Input validation on all forms
- XSS protection
- CSRF protection through Next.js
- Secure headers configuration

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interactions
- Cross-browser compatibility

## 🌟 Future Enhancements

- [ ] Blog/News section
- [ ] Case studies page
- [ ] Client testimonials
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] Advanced animations

## 📝 Changelog

### Version 1.12.1 (Latest)
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
    - Right arrow: Changed from `right-2 sm:right-4` to `right-1 sm:right-2`
    - Mobile: Now 4px from edges (reduced from 8px)
    - Desktop: Now 8px from edges (reduced from 16px)
  - **Enhanced User Experience**: More intuitive navigation controls with clearer visual connection
    - Better accessibility and easier interaction
    - Arrows feel more connected to the cards they control
    - Improved visual hierarchy and navigation clarity

### Version 1.11.1
- **UI Polish**: Improved navigation dots spacing for cleaner visual hierarchy
  - Added 10px additional spacing below rotating cards before navigation dots
  - Enhanced visual separation between card stack and navigation controls
  - Refined overall layout balance and professional appearance

### Version 1.11
- **Feature Cards Design**: Transformed bullet point features into modern rectangular cards
  - **Glass-style Cards**: Converted simple bullet points into elegant glassmorphism feature cards
    - Each feature now displayed in its own rounded rectangular card with glass effect
    - Consistent styling with existing design system and rotating service cards
    - Enhanced visual hierarchy and improved readability
  - **Color-coded Icon System**: Maintained brand color scheme with enhanced visual presentation
    - Blue card: Expert penetration testing and red team services
    - Purple card: Cutting-edge AI security assessments
    - Pink card: Free cybersecurity training programs  
    - Green card: Hall of Fame recognition from Google & Mastercard
  - **Responsive Grid Layout**: Optimized for all device sizes
    - Single column layout on mobile devices for easy reading
    - Two-column grid on larger screens for efficient space usage
    - Proper spacing and padding for clean visual presentation
  - **Interactive Elements**: Added hover effects for enhanced user engagement
    - Subtle background color transitions on card hover
    - Smooth animations maintaining modern user experience
    - Consistent with overall site interaction patterns

### Version 1.10
- **Header Section Repositioning**: Moved main header content below rotating cards for enhanced visual flow
  - **Layout Restructure**: Repositioned SecurityX branding, main title, and description section
    - Rotating cards now appear first as the primary visual element
    - Header section (SecurityX branding + "Advanced Cybersecurity for Digital Business" title) moved below cards
    - Features section remains at the bottom for complete information hierarchy
  - **Improved Animation Sequence**: Adjusted animation delays for smooth visual progression
    - Cards animate first (0.2s delay) as the primary focus
    - Arrow buttons and navigation dots follow (0.3s-0.4s delays)
    - Header section appears after cards (0.5s-0.6s delays)
    - Features and CTA sections complete the sequence (0.7s-0.8s delays)
    - **Enhanced User Experience**: Cards-first approach creates immediate visual impact
    - Services showcase takes precedence over introductory text
    - Maintains all existing functionality and responsive design
    - Preserves manual navigation controls and auto-rotation features

### Version 1.9
- **Manual Navigation Controls**: Added left/right arrow buttons for manual card navigation with seamless auto-rotation integration
  - **Arrow Button Implementation**: Glass-styled left and right navigation arrows positioned on card stack sides
    - Responsive design with smaller sizing on mobile devices (40x40px) and larger on desktop (48x48px)
    - Glass-morphism styling with backdrop blur, white/10 background, and subtle borders
    - Smooth hover effects with enhanced opacity and border visibility
  - **Seamless Auto-Rotation Integration**: Manual controls work harmoniously with automatic rotation
    - Timer reset functionality when user manually navigates to prevent abrupt behavior
    - Auto-rotation continues after manual interaction with fresh 5-second intervals
    - Animation state respect - buttons disabled during card transitions for smooth UX
  - **Enhanced Navigation Dots**: Updated dot navigation to also reset auto-rotation timer
    - Consistent behavior across all manual navigation methods
    - Prevents conflicts between different navigation approaches
  - **Accessibility & UX Improvements**: 
    - Proper ARIA labels for screen reader compatibility
    - Disabled state styling with reduced opacity during animations
    - Touch-friendly button sizing optimized for mobile interaction
    - Keyboard navigation support with proper focus management

### Version 1.8
- **Hero Section Layout Restructure**: Complete redesign of homepage hero section for improved user experience
  - **Centered Layout Design**: Transformed from horizontal left/right layout to vertical centered layout
    - Moved SecurityX branding, main title, and description to centered header section
    - Enhanced readability with `max-w-3xl mx-auto` constraint for description text
  - **Rotating Cards as Centerpiece**: Repositioned service cards to be the main focal point
    - All 4 rotating cards (Penetration Testing, AI Security, Red Teaming, Free Training) now prominently centered
    - Preserved all auto-rotation functionality and navigation dots below cards
    - Maintained card animations and interactive features
  - **Features Section Reorganization**: Relocated "quick about" features below rotating cards
    - Transformed bullet-point features into responsive 2x2 grid layout
    - Mobile-first responsive design (stacked on mobile, side-by-side on desktop)
    - Enhanced visual balance with larger feature indicators (3x3 colored dots)
  - **Improved Visual Hierarchy**: Created natural user flow from brand → services → features → CTA
    - Adjusted animation timing sequences for smooth visual progression
    - Maintained all responsive design principles and mobile optimization
    - Preserved navigation bar and footer positioning and design integrity

### Version 1.7
- **Mesh Background Removal**: Disabled mesh background animations from all pages while preserving component
  - Removed `MeshBackground` import and usage from root layout (`app/layout.tsx`)
  - Maintained `MeshBackground.tsx` component file for future use
  - Simplified layout structure with clean background design
  - Improved page load performance by removing complex CSS animations

### Version 1.6
- **Advanced Mesh Background System**: Complete refactoring of mesh background animations with production-ready enhancements
  - **Organic, Non-Linear Blob Movement**: Replaced predictable keyframes with randomized, multi-step transforms
    - Natural drifting patterns across the viewport with varying translate, rotate, and scale values
    - Eliminated centralized movement for more dynamic visual flow
  - **Individual Animation Speeds**: Unique timing for each blob to ensure desynchronized movement
    - Mesh1: 7.4s duration with no delay
    - Mesh2: 9.1s duration with 1.1s delay  
    - Mesh3: 6.3s duration with 2.3s delay
    - Mesh4: 10.2s duration with 0.8s delay
  - **Responsive Design Optimization**: Mobile-specific enhancements for better performance
    - Reduced blob sizes (22vmin) for mobile devices
    - Lowered opacity (0.35) and adjusted blur (2.5vmin) to prevent visual overload
    - Proper transform-origin centering for consistent behavior
  - **Accessibility Support**: Full compliance with user motion preferences
    - Added `@media (prefers-reduced-motion: reduce)` rule to disable all animations
    - Respects user accessibility settings with `!important` declarations

### Version 1.5
- **Organic Mesh Animations**: Enhanced mesh background blob animations for more natural, randomized movement
  - Refined `@keyframes` animations with subtle variations in translate, rotate, and scale values
  - Introduced staggered animation delays (0s, 0.7s, 1.2s, 2.1s) to prevent synchronized looping
  - Adjusted animation durations (6.3s, 7.7s, 5.8s, 8s) to create non-repetitive cycles
  - Implemented unique cubic-bezier timing functions for each blob for organic motion feel
  - Added additional keyframe points (20%, 30%, 40%, etc.) for smoother intermediate transitions
  - Enhanced mesh4 with subtle rotation variations for more dynamic movement
  - Maintained smooth performance while eliminating predictable animation patterns

### Version 1.4
- **Mesh Background**: Implemented animated mesh triangle background component
  - Created reusable `MeshBackground` React component with CSS animations  
  - Extracted mesh animations from HTML and integrated into Next.js app
  - Added site-wide animated background positioned behind all content
  - Preserved all original animations (rotation, scaling, blur effects)
  - Replaced aurora canvas with mesh background in root layout
  - Added responsive design support with mobile scaling
  - Removed central triangle shape while maintaining vibrant animated mesh blobs
  - Enhanced mesh blob sizes by 30-50% for more immersive viewport coverage

### Version 1.3
- **Deployment Fix**: Resolved Next.js 15 useSearchParams Suspense boundary error
  - Refactored contact page to use proper Suspense boundaries for client-side hooks
  - Created separate ContactForm component wrapped in Suspense for better error handling
  - Added elegant loading fallback with skeleton UI for contact page
  - Fixed Vercel deployment issue that was preventing static site generation
  - Improved user experience with smooth loading states

### Version 1.2
- **Typography System Overhaul**: Implemented dual-font system
  - **Manrope** for all headings (h1-h6) with specific weights:
    - h1: Extra Bold (800)
    - h2: Bold (700) 
    - h3, h4: Semi Bold (600)
    - h5, h6: Medium (500)
  - **Inter** for body text with specific weights:
    - Body/paragraphs: Regular (400)
    - Navigation: Medium (500)
    - Buttons: Medium (500)
    - Light text: Light (300)
    - Emphasis: Semi Bold (600)
  - Enhanced letter spacing for headings (-0.02em) for better readability
  - Improved visual hierarchy and modern typography styling

### Version 1.1
- Enhanced UI/UX with glassmorphism effects
- Improved responsive design
- Added interactive team member profiles
- Performance optimizations

### Version 1.0
- Initial release with Next.js 14
- Basic company website structure
- Contact forms and navigation

## 📞 Contact

- **Website**: [https://sec-x.com](https://sec-x.com)
- **Email**: info@securityx.com
- **LinkedIn**: [https://www.linkedin.com/company/sec-x](https://www.linkedin.com/company/sec-x)

## 📝 License

This project is proprietary software owned by Sec-X. All rights reserved.

## 🔄 Version History

### Version 1.1 (Latest)
- **Enhancement**: Added escape key functionality to all modal/card components
  - ContactForm modal can now be closed with Escape key
  - Team member expanded cards can be closed with Escape key  
  - Mobile navigation menu can be closed with Escape key
  - Improved user experience and accessibility

### Version 1.0
- Initial release with core functionality
- Modern responsive design with glassmorphism effects
- Contact forms and team showcase
- Publications section and SEO optimization

---

**Built with ❤️ by the Sec-X Development Team**
