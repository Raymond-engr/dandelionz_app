'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import ProductGrid from '@/components/ProductGrid';
import FilterModal from '@/components/FilterModal';
import HeroSlider from '@/components/HeroSlider';
import CategorySlider from '@/components/CategorySlider';

const categories = [
  { id: '1', name: 'Electronics', image: '/category-electronics.png' },
  { id: '2', name: 'Apparel', image: '/category-apparel.png' },
  { id: '3', name: 'Groceries', image: '/category-groceries.png' },
  { id: '4', name: 'Furniture', image: '/category-furniture.png' },
  { id: '5', name: 'Books', image: '/category-books.png' },
  { id: '6', name: 'Toys', image: '/category-toys.png' },
];

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const handleApplyFilter = (filters: any) => {
    console.log('Applied filters:', filters);
    // Handle filter application logic here
  };

  return (
    <AppLayout showBottomNav={true}>
      <div className="bg-white p-4">
        {/* Header */}
        <div className="pb-4">
          <h1 className="text-lg font-semibold text-gray-900 mb-4">Home 1</h1>
          
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
              onClick={() => setShowFilter(!showFilter)}
              className="p-2.5"
            >
              <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth={2} 
    d="M3 6h18M7 12h10M10 18h4" 
  />
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
          <CategorySlider categories={categories} />
        </div>

        {/* Products Section */}
        <div className="pb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Products</h2>
          <ProductGrid />
        </div>

        {/* Filter Modal */}
        <FilterModal
          isOpen={showFilter}
          onClose={() => setShowFilter(false)}
          onApply={handleApplyFilter}
        />
      </div>
    </AppLayout>
  );
}
