import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const isDev = process.env.NODE_ENV !== "production";

const withPWA = withPWAInit({
  dest: "public",
  disable: isDev,
  workboxOptions: {
    runtimeCaching: [
      {
        // Strategy: StaleWhileRevalidate
        // Apply to: Public content (products, categories, reviews)
        // Fetches from cache first for speed, then updates from network.
        urlPattern:
          /^https:\/\/api\.dandelionz\.com\.ng\/(store\/products|store\/categories|store\/products\/.+\/reviews)\/?.*$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "public-content-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // Strategy: NetworkFirst (Default Fallback)
        // Apply to: All other API GET requests (user data, admin/vendor data)
        // Prioritizes network for freshness, falls back to cache when offline.
        urlPattern: /^https:\/\/api\.dandelionz\.com\.ng\/.*/i,
        handler: "NetworkFirst",
        method: "GET",
        options: {
          cacheName: "api-cache",
          networkTimeoutSeconds: 3,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24, // 1 day
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dandelionz.com.ng",
      },
      {
        protocol: "https",
        hostname: "**.figma.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  turbopack: {},
};

export default withPWA(nextConfig);
