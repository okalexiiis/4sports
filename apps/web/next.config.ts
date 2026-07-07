import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@4sports/ui', '@4sports/types', '@4sports/utils'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      new URL("https://res.cloudinary.com/dl7kp4avt/image/upload/v1728312797/fotos_perfil/**")
    ],
    qualities: [70, 75],
  },
}

export default nextConfig
