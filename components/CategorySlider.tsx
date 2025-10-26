'use client';

import React from 'react';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CategorySliderProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryClick?: (categoryId: string) => void;
}

export default function CategorySlider({ 
  categories, 
  activeCategory,
  onCategoryClick 
}: CategorySliderProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
      <div className="grid grid-cols-3 gap-3">
        {categories.slice(0, 6).map((category) => (
          <div key={category.id} className="text-center">
            <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
            <button
              onClick={() => onCategoryClick?.(category.id)}
              className="w-full py-2.5 bg-[#030482] text-white rounded-lg text-sm font-semibold"
            >
              {category.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
