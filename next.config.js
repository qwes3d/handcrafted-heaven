/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {},
      // Disable Turbopack completely
      enabled: false,
    },
  },
};

module.exports = nextConfig;
