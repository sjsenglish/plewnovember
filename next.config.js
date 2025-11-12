/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 13+, no experimental flag needed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/plewcsat1.firebasestorage.app/**',
      },
    ],
  },
}

module.exports = nextConfig