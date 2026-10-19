import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "thecapcity.com" },
      { protocol: "https", hostname: "cdn.shopify.com" }
    ]
  }
};

export default nextConfig;