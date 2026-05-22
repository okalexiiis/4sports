import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@4sports/ui', '@4sports/types', '@4sports/utils'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
    ],
  },
}

export default nextConfig
