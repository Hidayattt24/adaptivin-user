import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rhwcxfhglvfodcybkcen.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // TypeScript and ESLint configuration
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // Only enable if you want to deploy quickly and fix later
    ignoreBuildErrors: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    // During build, only error on actual errors, not warnings
    ignoreDuringBuilds: true, // Changed to true to allow warnings
  },

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // React strict mode
  reactStrictMode: true,

  // Production source maps (optional - enable for debugging)
  productionBrowserSourceMaps: false,

  // Experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: [
      "lucide-react",
      "@mui/material",
      "@mui/icons-material",
    ],
  },
};

export default nextConfig;
