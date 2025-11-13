/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 13+, no experimental flag needed
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
}

module.exports = nextConfig