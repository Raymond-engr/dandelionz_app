You are an expert Next.js developer tasked with converting an existing e-commerce application into a full Progressive Web App (PWA).

**Project Context:**
- **Framework:** Next.js with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API:** Redux Toolkit Query, with a base URL of `https://api.dandelionz.com.ng/`

**Goal:**
Implement PWA features to provide offline access, installability, and improved performance. The final implementation must pass the Chrome Lighthouse PWA audit with a perfect score.

---

### **PWA Implementation Checklist & Instructions**

#### **Step 1: Install Dependencies**

First, add the PWA dependency to your project.

```bash
npm install @ducanh2912/next-pwa
```

---

#### **Step 2: Create PWA Icons** N.B: I'll implement this step by myself, just use it as context.

A PWA requires a set of icons for different devices and contexts. I was unable to create these for you automatically. Please create the following icon files and place them in the `public/icons/` directory. You can use a tool like [favicon.io](https://favicon.io/) to generate these from a source image. and https://maskable.app/editor for the maskable icons

- `icon-192x192.png` (192x192 pixels)
- `icon-512x512.png` (512x512 pixels)
- `icon-maskable-192x192.png` (192x192 pixels, with a safe zone)
- `icon-maskable-512x512.png` (512x512 pixels, with a safe zone)

---

#### **Step 3: Create the Web App Manifest**

Create a new file named `manifest.json` inside your `/public` directory. This file tells the browser about your PWA and how it should behave when 'installed'.

**File: `public/manifest.json`**
```json
{
  "name": "Dandelionz App",
  "short_name": "Dandelionz",
  "description": "A multivendor e-commerce application for Dandelionz",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#FFFFFF",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-maskable-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-maskable-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

---

#### **Step 4: Update the Root Layout**

Modify your root layout file to include the manifest link and necessary meta tags for a native-like mobile experience.

**File: `app/layout.tsx`**
```tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dandelionz E-commerce App",
  description: "This is a multivendor e-commerce application for Dandelionz",
  manifest: "/manifest.json", // <-- Add this
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        {/* Add these meta tags for PWA */}
        <meta name="application-name" content="Dandelionz App" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dandelionz App" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
        </Providers>
      </body>
    </html>
  );
}
```

---

#### **Step 5: Configure Next.js for PWA**

Update your `next.config.ts` to integrate the PWA plugin. This configuration includes our sophisticated, two-tiered runtime caching strategy.

**File: `next.config.ts`**
```ts
import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const isDev = process.env.NODE_ENV !== "production";

const withPWA = withPWAInit({
  dest: "public",
  disable: isDev,
  runtimeCaching: [
    {
      // Strategy: StaleWhileRevalidate
      // Apply to: Public content (products, categories, reviews)
      // Fetches from cache first for speed, then updates from network.
      urlPattern: /^https:\/\/api\.dandelionz\.com\.ng\/(store\/products|store\/categories|store\/products\/.+\/reviews)\/?.*$/i,
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
      urlPattern: /^https://api\.dandelionz\.com\.ng\/.*/i,
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
});

const nextConfig: NextConfig = {
  /* your existing config options here */
};

export default withPWA(nextConfig);
```

---

#### **Step 6: Validation**

1.  **Build for Production:** PWA features are enabled for production builds.
    ```bash
    npm run build
    ```
2.  **Start Production Server:**
    ```bash
    npm run start
    ```
3.  **Run Lighthouse Audit:**
    - Open your site in Chrome (`http://localhost:3000`).
    - Open Chrome DevTools (`F12` or `Ctrl+Shift+I`).
    - Go to the "Lighthouse" tab.
    - Check the "Progressive Web App" category.
    - Click "Analyze page load".

The audit should now show a perfect score for your PWA implementation. You can test the offline capabilities by using the "Service Workers" tab in DevTools to check the "Offline" box and then reloading the page. Previously visited product pages and categories should still be accessible.