/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@eufy/shared', '@eufy/ui-kit', '@eufy/api-client'],
  experimental: {
    serverComponentsExternalPackages: ['puppeteer', 'playwright', '@elastic/elasticsearch']
  },
  webpack: (config) => {
    config.externals = [...config.externals, 'puppeteer', 'playwright'];
    return config;
  },
  env: {
    ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    ELASTICSEARCH_USERNAME: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    ELASTICSEARCH_PASSWORD: process.env.ELASTICSEARCH_PASSWORD || 'changeme',
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