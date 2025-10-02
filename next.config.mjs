/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
      source: '/graphql',
      destination: process.env.GRAPHQL_ENDPOINT,
      },
    ]
  },
}

export default nextConfig
