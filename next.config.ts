import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["sanity", "next-sanity"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL:
      process.env.NODE_ENV === "development" ? 0 : 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  webpack: (config) => {
    // Avoid WasmHash crash on Vercel's Node 22 build image
    config.output.hashFunction = "xxhash64";
    return config;
  },
};

export default nextConfig;
