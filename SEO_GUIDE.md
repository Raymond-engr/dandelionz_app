# Next.js SEO Implementation Guide

This guide outlines the SEO strategy and implementation used in the DRID Research Diploma LMS project. This approach can be replicated in other Next.js projects to ensure consistent, high-quality search engine optimization.

## 1. Next.js Metadata API

The core of the SEO strategy is the Next.js Metadata API, which provides a declarative way to manage the `<head>` of each page.

### Global Metadata (`src/app/layout.tsx`)

A root layout should define the global metadata that applies to all pages unless overridden.

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  // Title Template: Ensures consistent branding across all pages.
  // %s will be replaced by the page-specific title.
  title: {
    template: "%s | DRID Research Diploma, University of Benin",
    default: "DRID Research Diploma | University of Benin",
  },
  
  // Default Description: A concise summary of the site's purpose.
  description: "The official Learning Management System for the Research Diploma course by DRID, University of Benin.",
  
  // Global Keywords: Relevant terms for search engines.
  keywords: ["DRID", "LMS", "research course", "University of Benin"],
  
  // Robots Configuration: Instructions for search engine crawlers.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Global Open Graph (OG) Settings: For social sharing.
  openGraph: {
    title: "DRID Research Diploma | University of Benin",
    description: "Advance your research skills with the official diploma course from DRID.",
    url: "https://course.drid-uniben.org",
    siteName: "DRID Research Diploma LMS",
    images: [
      {
        url: "https://course.drid-uniben.org/about-hero.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};
```

### Page-Specific Metadata (`src/app/pricing/layout.tsx`)

Override or complement global metadata in route-specific layouts or pages.

```typescript
export const metadata: Metadata = {
  title: "Course Pricing and Plans", // Replaces %s in the template
  description: "Find the right plan for the DRID Research Diploma course. Compare our Basic and Premium plans.",
  keywords: ["research course pricing", "research diploma cost"],
  openGraph: {
    title: "DRID Research Diploma Course Pricing",
    // Custom URL and image for this specific section
    url: "https://course.drid-uniben.org/pricing",
    images: [{ url: "https://course.drid-uniben.org/pricing-image.jpg" }],
  },
};
```

## 2. Semantic HTML & Site Structure

Proper HTML structure helps search engines understand the hierarchy and importance of content.

* **Heading Hierarchy:** Use only one `<h1>` per page (usually the hero title). Use `<h2>` for main sections and `<h3>` for subsections.
* **Semantic Tags:** Use `<header>`, `<footer>`, `<section>`, `<nav>`, and `<main>` instead of generic `<div>` tags where appropriate.
* **Navigation:** Use standard `<nav>` elements for menus. Ensure links are crawlable using the Next.js `<Link>` component.
* **Screen Reader Content (`sr-only`):** Use utility classes to provide context to screen readers and search engines that may not be visually necessary (e.g., a hidden description of the brand name next to a logo).

## 3. Image Optimization

Images should be optimized for both performance and search engine discovery.

* **Next.js `<Image>` Component:** Always use the built-in component for automatic resizing, lazy loading, and modern format (WebP) support.
* **Alt Text:** Every image MUST have a descriptive `alt` attribute. This is crucial for accessibility and image SEO.
* **Priority Images:** Use the `priority` prop for hero images or above-the-fold content to improve LCP (Largest Contentful Paint).

```tsx
<Image
  src="/hero-illustration.png"
  width={820}
  height={620}
  alt="People collaborating at computers"
  priority
/>
```

## 4. Technical SEO Best Practices

* **Favicons:** Place `icon.png` in the `src/app` directory. Next.js will automatically handle generating the necessary tags.
* **Canonical URLs:** Explicitly set canonical URLs in metadata if multiple URLs might point to the same content (preventing duplicate content penalties).
* **Reduced Motion:** Support `prefers-reduced-motion` in CSS to improve accessibility and user experience, which indirectly affects search rankings.
* **Dynamic Metadata:** For dynamic routes (e.g., `[id]`), use `generateMetadata` to fetch data and create specific titles and descriptions.

## 5. Recommended Future Enhancements

* **Automated Sitemap:** Use `sitemap.ts` in the `app` directory to dynamically generate a `sitemap.xml`.
* **Robots.txt:** Use `robots.ts` to manage crawler access and point to the sitemap.
* **Structured Data (JSON-LD):** Inject JSON-LD scripts for specific entities (like Course, Organization, or FAQ) to gain rich snippets in search results.

```tsx
// Example JSON-LD for a Course
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Research Diploma",
      "description": "...",
      "provider": {
        "@type": "Organization",
        "name": "DRID, University of Benin"
      }
    }),
  }}
/>
```
