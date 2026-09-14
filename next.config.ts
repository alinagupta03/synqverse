import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,
  // Helps prevent Out of Memory (OOM) crashes on 512MB free tier containers
  experimental: {
    webpackBuildWorker: true,
  }
};

export default nextConfig;
