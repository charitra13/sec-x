import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from './components/Navigation';
import ClientLayout from './components/ClientLayout';
import Footer from './components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "SecurityX - Advanced Cybersecurity for Digital Business",
  description: "Comprehensive security solutions designed to protect, detect, and respond to cyber threats. Enhanced security posture, compliance, and resilience for modern businesses.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Instrument+Serif:wght@400;500;600;700&family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" async></script>
      </head>
      <body className={`${inter.variable} h-full bg-black text-white font-[Inter] selection:bg-white/10 overflow-x-hidden antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <ClientLayout>
            <div className="relative z-10 flex min-h-screen flex-col">
              {/* Navigation */}
              <Navigation />
              
              {/* Page Content */}
              <main className="relative z-10 flex-grow pt-16">
                {children}
              </main>
              
              {/* Footer */}
              <Footer />
            </div>
            <Toaster position="bottom-right" />
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
