import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fc-ural.ru',
        port: '',
        pathname: '/uploads/main/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
}

export default nextConfig
