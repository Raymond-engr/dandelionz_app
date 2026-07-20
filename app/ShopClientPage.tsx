'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import ProductGrid from '@/components/ProductGrid';
import FilterModal from '@/components/FilterModal';
import HeroSlider from '@/components/HeroSlider';
import CategorySlider from '@/components/CategorySlider';
import { useGetProductsQuery } from '@/lib/api/publicApi';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import { CATEGORIES_FOR_NAV } from '@/lib/categories';


export default function ShopClientPage() {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [price, setPrice] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ordering, setOrdering] = useState('');

  const { data: productsData, isLoading: productsLoading, isFetching, error: productsError, refetch } = useGetProductsQuery({
    category: selectedCategory || undefined,
    min_price: minPrice > 0 ? minPrice : undefined,
    max_price: maxPrice < 500 ? maxPrice : undefined,
    price: price > 0 ? price : undefined,
    ordering: ordering || undefined,
  });

  const handleApplyFilter = (filters: { min_price?: number; max_price?: number; price?: number; ordering?: string; category?: string }) => {
    setMinPrice(filters.min_price || 0);
    setMaxPrice(filters.max_price || 500);
    setPrice(filters.price || 0);
    setOrdering(filters.ordering || '');
    setSelectedCategory(filters.category || '');
    setShowFilter(false);
  };

  const products = productsData?.data || [];

  return (
    <AppLayout showBottomNav={true}>
      <div className="bg-white p-4">
        {/* Header */}
        <div className="pb-4">
          <h1 className="text-lg font-semibold text-gray-900 mb-4">Home</h1>
          
          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              {/* Opens the dedicated search page; this bar never filters the
                  shop grid in place. */}
              <input
                type="text"
                placeholder="Search Products"
                value=""
                readOnly
                onChange={() => {}}
                onClick={() => router.push('/search')}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilter(true)}
              className="p-2.5"
            >
              <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M7 12h10M10 18h4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Hero Slider */}
        <div className="mb-6">
          <HeroSlider isLoading={productsLoading} />
        </div>

        {/* Categories Section */}
        <div className="mb-6">
          <CategorySlider categories={CATEGORIES_FOR_NAV.map(cat => ({id: cat.id, name: cat.name, image: cat.image}))} />
        </div>

        {/* Products Section */}
        <div className="pb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Products</h2>
          {isFetching ? (
            <ProductGridSkeleton hideAddToCart={true} />
          ) : productsError ? (
            <div className="text-center">
              <p className="text-red-600 mb-4">Failed to load products.</p>
              <button 
                onClick={() => refetch()}
                className="px-4 py-2 bg-system-blue-light text-white rounded-lg"
              >
                Retry
              </button>
            </div>
          ) : (
            <ProductGrid products={products} hideAddToCart={true} />
          )}
        </div>

        {/* Filter Modal */}
        <FilterModal
          isOpen={showFilter}
          onClose={() => setShowFilter(false)}
          onApply={handleApplyFilter}
          categories={CATEGORIES_FOR_NAV.map(cat => ({id: cat.id, name: cat.name, image: cat.image}))}
          initialFilters={{
            minPrice: minPrice,
            maxPrice: maxPrice,
            price: price,
            sortBy: ordering,
            category: selectedCategory,
          }}
        />
      </div>
    </AppLayout>
  );
}
