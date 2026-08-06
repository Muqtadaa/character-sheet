/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@dnd/engine'],
  // ESLint config is added in a later phase; type-checking still runs on build.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
