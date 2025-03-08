/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Add redirects configuration
  async redirects() {
    return [
      {
        source: '/test-api',
        destination: '/api-test',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; 