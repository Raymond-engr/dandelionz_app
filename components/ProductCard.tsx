'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product, useAddToCartMutation, useAddToWishlistMutation } from '@/lib/api/publicApi';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToWishlist, { isLoading: isAddingToWishlist }] = useAddToWishlistMutation();

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToWishlist({ product: product.id }).unwrap();
      alert('Added to wishlist!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart({ product: product.id, quantity: 1 }).unwrap();
      alert('Added to cart!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Link href={`/product/${product.id}`}>
    <div className="flex flex-col bg-white rounded-lg overflow-hidden group border border-gray-100 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            fill
          />

        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        
        {/* Wishlist Icon */}
        <button 
            onClick={handleWishlist}
            disabled={isAddingToWishlist}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${isAddingToWishlist ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-bold text-system-blue-light">
                         ${product.price}
          </p>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="text-xs text-gray-600">{product.rating || '0.0'}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full py-2 bg-gray-50 text-system-blue-light text-xs font-semibold rounded-lg hover:bg-system-blue-light hover:text-white transition-colors disabled:opacity-50"
        >
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
    </Link>
  );
}