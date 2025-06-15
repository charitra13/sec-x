# Sec-X - Advanced Cybersecurity Solutions

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38bdf8.svg)

A modern, responsive cybersecurity company website built with Next.js, TypeScript, and Tailwind CSS. Showcasing advanced security services including red teaming, penetration testing, and AI security assessments.

## 🚀 Features

- **Modern Design**: Clean, professional interface with glassmorphism effects
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

## 📞 Contact

- **Website**: [https://sec-x.com](https://sec-x.com)
- **Email**: info@securityx.com
- **LinkedIn**: [https://www.linkedin.com/company/sec-x](https://www.linkedin.com/company/sec-x)

## 📝 License

This project is proprietary software owned by Sec-X. All rights reserved.

## 🔄 Version History

### Version 1.0 (January 2025)
- Initial release
- Complete website functionality
- Contact form integration
- Team and publications pages
- SEO optimization
- Responsive design implementation

---

**Built with ❤️ by the Sec-X Development Team**
