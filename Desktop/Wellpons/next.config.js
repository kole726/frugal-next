/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['wellpons.com'], // Replace with your WordPress domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wellpons.com', // Replace with your WordPress domain
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig 