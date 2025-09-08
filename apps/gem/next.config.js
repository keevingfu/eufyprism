/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@eufy-prism/shared'],
  experimental: {
    serverComponentsExternalPackages: ['@chakra-ui/react']
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:3020"
          }
        ],
      },
    ]
  }
}

module.exports = nextConfig