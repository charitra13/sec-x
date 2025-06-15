import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Contact Us - SecurityX',
    description: 'Get in touch with our cybersecurity experts. We provide comprehensive security solutions, assessments, and consulting services for businesses of all sizes.',
    keywords: 'cybersecurity contact, security assessment, penetration testing, security consulting',
    openGraph: {
      title: 'Contact Us - SecurityX',
      description: 'Get in touch with our cybersecurity experts for comprehensive security solutions.',
      type: 'website',
    },
  }
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 