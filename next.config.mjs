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
  rewrites: async () => [
    {
      source: '/api/:path*',
        destination: `${process.env.SERVER_URL}/api/:path*`,
    },
  ],
}

export default nextConfig
