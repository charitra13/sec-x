/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; connect-src 'self' https://sec-x-backend.onrender.com; script-src 'self';"
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
