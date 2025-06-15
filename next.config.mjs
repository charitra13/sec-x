/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
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
