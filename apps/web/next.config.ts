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
  async headers() {
    return [
      {
        // Google Sign-In communicates back to the page via postMessage from
        // a cross-origin popup/iframe. The default Cross-Origin-Opener-Policy
        // isolates that and silently blocks the message in some browsers;
        // "same-origin-allow-popups" keeps isolation while permitting it.
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
