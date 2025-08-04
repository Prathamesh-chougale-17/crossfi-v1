import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // ✅ Disable type checking during build
  },eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
