/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
    ],
  },
  async rewrites() {
    return [{
      source: '/api/:path*',
      destination: 'https://m1.apifoxmock.com/m1/7302200-7031035-default/api/:path*',
    }]
  }
};

export default nextConfig;
