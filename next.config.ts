import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for production
  reactStrictMode: true,

  // Remove X-Powered-By header for security
  poweredByHeader: false,

  // Enable compression
  compress: true,

  // Configure logging for production
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

  // Optimize images if needed in the future
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Experimental features for better build performance
  experimental: {
    optimizePackageImports: ['@radix-ui/react-toast', '@radix-ui/react-alert-dialog', '@radix-ui/react-dropdown-menu', 'lucide-react'],
  },

  // Transpile external packages that need it
  transpilePackages: ['next-themes'],

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
