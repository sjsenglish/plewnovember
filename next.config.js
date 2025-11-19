/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 13+, no experimental flag needed
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig