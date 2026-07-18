import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// In development, Next.js image proxy tries to fetch localhost:7000 from
// the server side — but localhost resolves to a private IP (127.0.0.1),
// which Next.js 15+ blocks as an SSRF protection.
// Setting unoptimized:true in dev makes the browser fetch the image URL
// directly, bypassing the proxy entirely.
const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  // `standalone` emits a self-contained server at .next/standalone with only
  // the node_modules each route traces — keeps the production Docker image
  // small (no full node_modules copy).
  output: "standalone",
  images: {
    unoptimized: isDev,
    // Allow images from our own backend (dev + prod) and any S3/CDN host.
    // For production, replace localhost with the real backend domain.
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "7000", pathname: "/**" },
      { protocol: "https", hostname: "multi-api.surajojha.com", pathname: "/**" },
      { protocol: "https", hostname: "**.s3.amazonaws.com", pathname: "/**" },
      { protocol: "https", hostname: "**.cloudfront.net", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },
};

// withSentryConfig is inert without a DSN/auth token: source-map upload only
// runs when SENTRY_AUTH_TOKEN + org/project are set, so this is a safe no-op
// in dev and in DSN-less builds.
export default withSentryConfig(nextConfig, {
  silent: true,
  disableLogger: true,
});
