'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import ProductGrid from '@/components/ProductGrid';
import FilterModal from '@/components/FilterModal';
import HeroSlider from '@/components/HeroSlider';
import CategorySlider from '@/components/CategorySlider';
import { useGetProductsQuery } from '@/lib/api/publicApi';
import LoadingSpinner from '@/components/LoadingSpinner';

const CATEGORIES_FOR_NAV = [
  { id: 'electronics', name: 'Electronics', image: '/category-electronics.png' },
  { id: 'fashion', name: 'Fashion', image: '/category-fashion.png' },
  { id: 'home_appliances', name: 'Home Appliances', image: '/category-home_appliances.png' },
  { id: 'beauty', name: 'Beauty & Personal Care', image: '/category-beauty.png' },
  { id: 'sports', name: 'Sports & Outdoors', image: '/category-sports.png' },
  { id: 'automotive', name: 'Automotive', image: '/category-automotive.png' },
  { id: 'books', name: 'Books', image: '/category-books.png' },
  { id: 'toys', name: 'Toys & Games', image: '/category-toys.png' },
  { id: 'groceries', name: 'Groceries', image: '/category-groceries.png' },
  { id: 'computers', name: 'Computers & Accessories', image: '/category-computers.png' },
  { id: 'phones', name: 'Phones & Tablets', image: '/category-phones.png' },
  { id: 'jewelry', name: 'Jewelry & Watches', image: '/category-jewelry.png' },
  { id: 'baby', name: 'Baby Products', image: '/category-baby.png' },
  { id: 'pets', name: 'Pet Supplies', image: '/category-pets.png' },
  { id: 'office', name: 'Office Products', image: '/category-office.png' },
  { id: 'gaming', name: 'Video Games & Consoles', image: '/category-gaming.png' },
];


export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500); // Default max price, assuming range from FilterModal
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ordering, setOrdering] = useState('');

  const { data: productsData, isLoading: productsLoading, isFetching, error: productsError, refetch } = useGetProductsQuery({
    search: searchQuery || undefined,
    category: selectedCategory || undefined,
    price: maxPrice < 500 ? maxPrice : undefined, // Only send if changed from default
    ordering: ordering || undefined,
  });

  const handleApplyFilter = (filters: { price?: number; ordering?: string; category?: string }) => {
    setMaxPrice(filters.price || 500);
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
              <input
                type="text"
                placeholder="Search Products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
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
          <HeroSlider />
        </div>

        {/* Categories Section */}
        <div className="mb-6">
          <CategorySlider categories={CATEGORIES_FOR_NAV.map(cat => ({id: cat.id, name: cat.name, image: cat.image}))} />
        </div>

        {/* Products Section */}
        <div className="pb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Products</h2>
          {isFetching ? (
            <LoadingSpinner />
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
            <ProductGrid products={products} />
          )}
        </div>

        {/* Filter Modal */}
        <FilterModal
          isOpen={showFilter}
          onClose={() => setShowFilter(false)}
          onApply={handleApplyFilter}
          categories={CATEGORIES_FOR_NAV.map(cat => ({id: cat.id, name: cat.name, image: cat.image}))}
          initialFilters={{
            priceRange: [0, maxPrice],
            sortBy: ordering,
            category: selectedCategory,
          }}
        />
      </div>
    </AppLayout>
  );
}
