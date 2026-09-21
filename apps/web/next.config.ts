import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'awxtgxpzflpubuehmwso.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/avatars/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'scoutripper-asset.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'images.scoutripper.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
    qualities: [50, 75, 90],
  },
};

export default nextConfig;
