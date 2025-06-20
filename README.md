# Sec-X - Advanced Cybersecurity Solutions

![Version](https://img.shields.io/badge/version-1.5-blue.svg)
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

### Version 1.5 (Latest)
- **Organic Mesh Animations**: Refactored mesh background animations to be more randomized and organic
  - **Enhanced Transform Values**: Increased translation range to ±85% for more dramatic movement patterns
  - **Non-linear Motion**: Implemented asymmetric translation offsets and irregular keyframe percentages (18%, 41%, 67%, 89%)
  - **Dynamic Rotation**: Added complex rotation patterns (12° → 35° → 4° → 28° → 41°) for natural, unpredictable movement
  - **Varied Scaling**: Introduced diverse scale values (0.58 to 1.47) across keyframes for organic size fluctuations
  - **Staggered Animation Timing**: 
    - mesh1: 5.3s with cubic-bezier(0.4, 0.0, 0.6, 1.0) - no delay
    - mesh2: 6.7s with cubic-bezier(0.25, 0.46, 0.45, 0.94) - 0.8s delay
    - mesh3: 7.1s with cubic-bezier(0.17, 0.67, 0.83, 0.67) - 1.6s delay  
    - mesh4: 6.4s with cubic-bezier(0.55, 0.06, 0.68, 0.19) - 2.3s delay
  - **Improved User Experience**: Eliminated predictable looping patterns for more immersive, natural-feeling animations
  - **Performance Optimized**: Maintained smooth 60fps performance while enhancing visual complexity

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
