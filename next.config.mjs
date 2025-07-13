/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.app;
              style-src 'self' 'unsafe-inline' *.vercel.app;
              img-src 'self' data: https: *.vercel.app;
              font-src 'self' *.vercel.app;
              connect-src 'self' *.vercel.app ${process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL).origin : 'https://sec-x-backend.onrender.com'};
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  },
  async rewrites() {
    return [
      // Proxy API requests to the backend in both development & production.
      // This works hand-in-hand with the relative baseURL (`/api`) we set in `lib/api.ts`.
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/:path*`,
      },
      // Existing rewrites for static files
      {
        source: '/robots.txt',
        destination: '/robots.txt',
      },
      {
        source: '/sitemap.xml',
        destination: '/sitemap.xml',
      }
    ]
  },
};

export default nextConfig;
