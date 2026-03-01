import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/vendor/',
        '/account/',
        '/checkout/',
        '/api/',
      ],
    },
    sitemap: 'https://dandelionz.com.ng/sitemap.xml',
  };
}
