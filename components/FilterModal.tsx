'use client';

import React, { useState } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

interface FilterState {
  priceRange: [number, number];
  sortBy: string;
  categories: string[];
}

const categories = [
  'Category 1',
  'Category 2',
  'Category 3',
  'Category 4',
  'Category 5',
  'Category 6',
];

export default function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState('Newly Updated');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Category 1']);
  const [searchCategory, setSearchCategory] = useState('');

  if (!isOpen) return null;

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleApply = () => {
    onApply({
      priceRange,
      sortBy,
      categories: selectedCategories,
    });
    onClose();
  };

  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(searchCategory.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[600px] bg-white rounded-t-2xl shadow-xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
          <button onClick={onClose} className="p-1">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Price</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">${priceRange[0]}</span>
              <span className="text-sm font-medium text-gray-700">${priceRange[1]}</span>
            </div>
            
            {/* Price Range Slider */}
            <div className="relative h-2 bg-gray-200 rounded-full">
              <div
                className="absolute h-2 bg-system-blue-light rounded-full"
                style={{
                  left: `${(priceRange[0] / 500) * 100}%`,
                  right: `${100 - (priceRange[1] / 500) * 100}%`,
                }}
              />
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="absolute w-full h-2 opacity-0 cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="absolute w-full h-2 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Sort by</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
            >
              <option>Newly Updated</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Most Popular</option>
              <option>Best Rating</option>
            </select>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
            
            {/* Search Categories */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search Categories"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              />
            </div>

            {/* Category List */}
            <div className="space-y-2">
              {filteredCategories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-system-blue-light peer-checked:border-system-blue-light flex items-center justify-center">
                      {selectedCategories.includes(category) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleApply}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
}