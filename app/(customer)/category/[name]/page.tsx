'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetProductsQuery } from '@/lib/api/publicApi';
import ProductGrid from '@/components/ProductGrid';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CategoryPage({ params }: { params: { name: string } }) {
  const router = useRouter();
  const categoryName = params.name;

  const { data: productsData, isLoading, error } = useGetProductsQuery({
    category: categoryName,
  });

  const products = productsData?.data || [];

  if (isLoading) {
    return (
      <AppLayout showBottomNav={true}>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout showBottomNav={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load products for category: {categoryName}</p>
            <button 
              onClick={() => router.back()}
              className="px-4 py-2 bg-system-blue-light text-white rounded-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={true}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-start p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900 ml-8 capitalize">{categoryName.replace(/-/g, ' ')}</h1>
        </div>

        {/* Products Grid for Category */}
        <div className="pb-4 pt-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Products in {categoryName.replace(/-/g, ' ')}</h2>
          <ProductGrid products={products} />
        </div>
      </div>
    </AppLayout>
  );
}
