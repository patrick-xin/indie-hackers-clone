/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  experimental: { images: { allowFutureImage: true } },
  images: {
    domains: ['avatars.githubusercontent.com', 'cloudflare-ipfs.com'],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
