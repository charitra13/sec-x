import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Navigation from './components/Navigation';
import ClientLayout from './components/ClientLayout';
import Footer from './components/Footer';


const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: '--font-inter',
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  variable: '--font-manrope',
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} antialiased`} suppressHydrationWarning>
        <ClientLayout>
          <div className="min-h-screen bg-black">
            <div className="relative w-full min-h-screen max-w-[1400px] mx-auto rounded-[32px] overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50" />
              
              {/* Navigation */}
              <Navigation />
              
              {/* Page Content */}
              {children}
              
              {/* Footer */}
              <Footer />
            </div>
          </div>
        </ClientLayout>
      </body>
    </html>
  );
}
