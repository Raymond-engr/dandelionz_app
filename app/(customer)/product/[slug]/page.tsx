import type { Metadata } from 'next';
import ProductDetailClientPage from './ProductDetailClientPage';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  try {
    const res = await fetch(`https://api.dandelionz.com.ng/store/products/${slug}/`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const description = product.description?.slice(0, 160) || `Buy ${product.name} on Dandelionz.`;
  const image = product.image || (product.images?.[0]?.image_url) || '/icons/icon-512x512.png';

  return {
    title: product.name,
    description: description,
    openGraph: {
      title: `${product.name} | Dandelionz`,
      description: description,
      images: [image],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  // We can also pre-fetch here if we want to pass it as initialProduct
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const product = await getProduct(slug);

  return <ProductDetailClientPage initialProduct={product} />;
}
