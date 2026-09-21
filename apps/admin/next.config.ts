import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  /* config options here */
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
