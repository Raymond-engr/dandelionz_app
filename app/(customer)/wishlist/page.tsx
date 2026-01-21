'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/api/publicApi';
import Link from 'next/link';

const wishlistItems: Product[] = [
  // Uncomment these to show products
   { id: 1, name: 'Product Name', price: '29.99', rating: 4.7 },
  { id: 2, name: 'Product Name', price: '39.99', rating: 4.2 },
  // { id: 3, name: 'Product Name', price: '19.99', rating: 3.1 },
  // { id: 4, name: 'Product Name', price: '49.99', rating: 4.6 },
];

export default function WishlistPage() {
  return (
    <AppLayout showBottomNav={true} userRole="customer">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900 text-center">Wishlist</h1>
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist */
          <div className="flex flex-col items-center justify-center py-32 px-6">
            <p className="text-lg text-gray-900 mb-6">Nothing to see here</p>
            <Link
              href="/"
              className="px-8 py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 min-[250px]:grid-cols-2 min-[500px]:grid-cols-3 gap-4 p-4">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}