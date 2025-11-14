'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/components/ProductGrid';
import Link from 'next/link';

const wishlistItems: Product[] = [
  { id: '1', name: 'Product Name', price: 29.99, rating: 4.7 },
  { id: '2', name: 'Product Name', price: 39.99, rating: 4.2 },
  { id: '3', name: 'Product Name', price: 19.99, rating: 3.1 },
  { id: '4', name: 'Product Name', price: 49.99, rating: 4.6 },
];

export default function WishlistPage() {
  return (
    <AppLayout showBottomNav={true}>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">Wishlist</h1>
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist */
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Save your favorite items here for later
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Browse Products
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