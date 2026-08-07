'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useGetCategoriesQuery, useGetProductsQuery } from '@/lib/api/publicApi';
import ProductGrid from '@/components/ProductGrid';
import LoadingSpinner from '@/components/LoadingSpinner';

// This is the new Client Component. It receives categoryName as the URL slug.
export default function CategoryClientPage({ categoryName: categorySlug }: { categoryName: string }) {
  const router = useRouter();

  const { data: productsData, isFetching, error, refetch } = useGetProductsQuery({
    category: categorySlug,
  }, {
    skip: !categorySlug, // Skip query if categorySlug is not yet defined
  });

  // The slug isn't fit for display (it may lose characters like "&" that don't
  // survive slugification) - look up the real category name by slug instead of
  // reformatting the slug itself. Falls back to a formatted slug only until the
  // category list loads, or if this slug doesn't match a known category.
  const { data: categoriesData } = useGetCategoriesQuery();
  const matchedCategory = (categoriesData || []).find(
    (c: any) => c.slug === categorySlug,
  );
  const displayName =
    matchedCategory?.name || (categorySlug || '').replace(/-/g, ' ');

  const products = productsData?.data || [];

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
          <h1 className="text-lg font-semibold text-gray-900 ml-8 capitalize">{displayName}</h1>
        </div>

        {/* Products Grid for Category */}
        <div className="pb-4 pt-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Products in {displayName}</h2>
          {isFetching ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600 mb-4">Failed to load products for category: {displayName}</p>
              <button 
                onClick={() => refetch()}
                className="px-4 py-2 bg-system-blue-light text-white rounded-lg"
              >
                Retry
              </button>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
