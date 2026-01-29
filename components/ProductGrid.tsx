import ProductCard from './ProductCard';
import { Product } from '@/lib/api/publicApi';

interface ProductGridProps {
  products: Product[];
  hideAddToCart?: boolean;
}

export default function ProductGrid({ products, hideAddToCart = false }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 min-[250px]:grid-cols-2 min-[500px]:grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} hideAddToCart={hideAddToCart} />
      ))}
    </div>
  );
}