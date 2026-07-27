import ProductGrid from './ProductGrid';
import { Product } from '@/lib/api/publicApi';

interface RecommendationSectionProps {
  title: string;
  /** Undefined while the request is in flight. */
  products?: Product[];
  className?: string;
}

/**
 * A titled row of recommended products that renders nothing when there is
 * nothing to recommend.
 *
 * Recommendations are supplementary, so they must leave no trace when empty:
 * ProductGrid's own "No products found" state and a bare heading both read as
 * breakage here, and a heading rendered during loading would pop in and then
 * vanish for every shopper the backend has no picks for.
 */
export default function RecommendationSection({
  title,
  products,
  className = '',
}: RecommendationSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className={className}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      {/* Discovery surface: the tap target is the product, not the cart. */}
      <ProductGrid products={products} hideAddToCart={true} />
    </section>
  );
}
