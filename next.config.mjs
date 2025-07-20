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
};

export default nextConfig;
