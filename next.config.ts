/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  allowedDevOrigins: ['http://192.168.83.168:3000'],
};

export default nextConfig;
