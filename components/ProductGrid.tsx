import ProductCard from './ProductCard';

export interface Product {
  id: number; // Changed from string to number based on flow.md response
  name: string;
  price: string; // Changed from number to string based on flow.md response
  rating?: number; // Optional as not always present in flow.md
  image?: string | null; // Can be null
  slug?: string; // Added based on flow.md
  store?: number; // Added based on flow.md
  store_name?: string; // Added based on flow.md
  description?: string; // Added based on flow.md
  category?: string; // Added based on flow.md
  stock?: number; // Added based on flow.md
  in_stock?: boolean; // Added based on flow.md
  created_at?: string; // Added based on flow.md
  updated_at?: string; // Added based on flow.md
  reviews?: any[]; // Added based on flow.md
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
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
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}