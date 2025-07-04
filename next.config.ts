/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {}, // ✅ Correct type is an object
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Prevent ESLint from breaking production builds
  },
};

export default nextConfig;
