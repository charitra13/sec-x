# Sec-X - Advanced Cybersecurity Solutions

![Version](https://img.shields.io/badge/version-1.14.3-blue.svg)
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
- **Blog Section**: Comprehensive blog layout with cybersecurity articles and insights
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
│   ├── blog/
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

### Blog Page (`/blog`)
- Comprehensive blog layout with cybersecurity articles
- Featured categories: AI Security, Red Teaming, Penetration Testing, Security Architecture
- Newsletter subscription functionality
- Clickable article cards with navigation to individual posts
- Dynamic routing for individual blog posts using slug-based URLs

### Individual Blog Posts (`/blog/[slug]`)
- Professional blog post template with rich content formatting
- Complete SEO metadata including OpenGraph and Twitter cards
- Social sharing buttons for Twitter and LinkedIn
- Author information and publication date
- Tag system for content categorization
- Related articles section and back navigation

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

- [ ] Case studies page
- [ ] Client testimonials
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] Advanced animations

## 📝 Changelog

### Version 1.14.3 (Latest)
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