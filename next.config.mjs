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
      destination: 'https://amir-master-server.onrender.com/api/:path*',
    },
  ],
}

export default nextConfig
