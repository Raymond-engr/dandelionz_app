'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProductCard from '@/components/ProductCard';
import { Product, useGetWishlistQuery } from '@/lib/api/publicApi';
import Link from 'next/link';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';

export default function WishlistPage() {
  const { data: wishlistResponse, isLoading } = useGetWishlistQuery();
  const wishlistItems = wishlistResponse || [];

  return (
    <AppLayout showBottomNav={true} userRole="customer">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900 text-center">Wishlist</h1>
        </div>

        {isLoading ? (
          <div className="p-4">
            <ProductGridSkeleton />
          </div>
        ) : wishlistItems.length === 0 ? (
          /* Empty Wishlist */
          <div className="flex flex-col items-center justify-center py-32 px-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-lg text-gray-900 mb-2">Your wishlist is empty</p>
            <p className="text-sm text-gray-500 mb-6">Tap the heart icon on any product to save it here</p>
            <Link
              href="/"
              className="px-8 py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 min-[500px]:grid-cols-3 gap-4 p-4">
            {wishlistItems.map((item: any) => {
              // Construct a Product object from the nested product_details
              // ensure we pass the correct slug for interactions
              const productData: Product = {
                ...item.product_details,
                id: item.product, // or item.product_details.id if available
                // Ensure slug is present for ProductCard interactions
                slug: item.product_details?.slug 
              };
              
              return (
                <ProductCard key={item.id} product={productData} />
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}