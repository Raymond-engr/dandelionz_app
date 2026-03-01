import { MetadataRoute } from 'next';

const BASE_URL = 'https://dandelionz.com.ng';
const API_URL = 'https://api.dandelionz.com.ng';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Routes
  const staticRoutes = [
    '',
    '/login',
    '/register',
    '/contact',
    '/cart',
    '/wishlist',
    '/faqs',
    '/terms',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Fetch Categories
  let categoryRoutes: any[] = [];
  try {
    const catRes = await fetch(`${API_URL}/store/categories/`);
    if (catRes.ok) {
      const categories = await catRes.json();
      categoryRoutes = categories.map((cat: any) => ({
        url: `${BASE_URL}/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (e) {
    console.error('Sitemap: Error fetching categories', e);
  }

  // 3. Fetch Products (limiting to first page/batch for sitemap)
  let productRoutes: any[] = [];
  try {
    const prodRes = await fetch(`${API_URL}/store/products/`);
    if (prodRes.ok) {
      const prodData = await prodRes.json();
      const products = prodData.data || [];
      productRoutes = products.map((prod: any) => ({
        url: `${BASE_URL}/product/${prod.slug}`,
        lastModified: new Date(prod.updated_at || new Date()),
        changeFrequency: 'daily' as const,
        priority: 0.6,
      }));
    }
  } catch (e) {
    console.error('Sitemap: Error fetching products', e);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
