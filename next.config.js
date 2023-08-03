/** @type {import('next').NextConfig} */

/* eslint @typescript-eslint/no-var-requires: "off" */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'cloudflare-ipfs.com'],
  },
  reactStrictMode: true,
};

module.exports = () => {
  return withBundleAnalyzer(nextConfig);
};
