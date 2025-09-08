/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@eufy/shared', '@eufy/ui-kit', '@eufy/api-client', 'antd', '@ant-design', 'rc-util'],
  images: {
    domains: ['localhost', '*.s3.amazonaws.com', '*.cloudfront.net'],
  },
  async rewrites() {
    return [
      {
        source: '/api/storage/:path*',
        destination: 'http://localhost:9000/:path*', // MinIO endpoint
      },
    ];
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    return config;
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
};

module.exports = nextConfig;