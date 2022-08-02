/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  experimental: { images: { allowFutureImage: true } },
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
