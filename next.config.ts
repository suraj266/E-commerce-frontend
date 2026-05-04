import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from our own backend (dev + prod) and any S3/CDN host.
    // For production, replace localhost with the real backend domain.
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "7000", pathname: "/media/**" },
      { protocol: "https", hostname: "**.s3.amazonaws.com", pathname: "/**" },
      { protocol: "https", hostname: "**.cloudfront.net", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
