import React, { useState } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

interface FilterState {
  priceRange: [number, number];
  sortBy: string;
  category: string; // Changed from string[] to string
}

export default function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState('Newly Updated');
  
  // State is now a single string, not an array
  const [selectedCategory, setSelectedCategory] = useState<string>('Electronics');
  const [searchCategory, setSearchCategory] = useState('');

  const categories = [
    { id: '1', name: 'Electronics', image: '/category-electronics.png' },
    { id: '2', name: 'Apparel', image: '/category-apparel.png' },
    { id: '3', name: 'Groceries', image: '/category-groceries.png' },
    { id: '4', name: 'Furniture', image: '/category-furniture.png' },
    { id: '5', name: 'Books', image: '/category-books.png' },
    { id: '6', name: 'Toys', image: '/category-toys.png' },
  ];

  if (!isOpen) return null;

  // Simplified handler: Just set the clicked category as the active one
  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleApply = () => {
    onApply({
      priceRange,
      sortBy,
      category: selectedCategory, // Passing single string
    });
    onClose();
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const activeColorClass = "bg-[#1a1a80]";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl overflow-hidden ">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Filter</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {/* Price Range */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-900 mb-6">Price</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-semibold text-gray-900">${priceRange[0]}</span>
              <span className="text-base font-semibold text-gray-900">${priceRange[1]}</span>
            </div>
            
            <div className="relative h-1 bg-gray-100 rounded-full mt-2">
              <div
                className={`absolute h-1 ${activeColorClass} rounded-full`}
                style={{
                  left: `${(priceRange[0] / 500) * 100}%`,
                  right: `${100 - (priceRange[1] / 500) * 100}%`,
                }}
              />
              <div
                className={`absolute w-5 h-5 ${activeColorClass} border-2 border-white rounded-full -top-2 cursor-pointer shadow-md`}
                style={{ left: `calc(${(priceRange[0] / 500) * 100}% - 10px)` }}
              />
              <div
                className={`absolute w-5 h-5 ${activeColorClass} border-2 border-white rounded-full -top-2 cursor-pointer shadow-md`}
                style={{ left: `calc(${(priceRange[1] / 500) * 100}% - 10px)` }}
              />
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value), priceRange[1] - 10), priceRange[1]])}
                className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
              />
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value), priceRange[0] + 10)])}
                className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Sort by</h3>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-900 appearance-none cursor-pointer"
              >
                <option>Newly Updated</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
                <option>Best Rating</option>
              </select>
              <svg 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Category</h3>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search Categories"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-900 placeholder-gray-400"
              />
            </div>

            <div className="space-y-4">
              {filteredCategories.map((category) => {
                // Check exact match instead of includes
                const isSelected = selectedCategory === category.name;
                return (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio" // Changed to radio semantic
                        name="category_selection"
                        checked={isSelected}
                        onChange={() => handleCategorySelect(category.name)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border transition-all duration-200 flex items-center justify-center
                        ${isSelected ? `${activeColorClass} border-transparent` : 'bg-white border-blue-900'}`
                      }>
                         {/* Optional: Add a small white dot in center if you want a traditional radio look */}
                         {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {category.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleApply}
            className={`w-full py-4 ${activeColorClass} text-white rounded-xl font-semibold hover:bg-[#020360] transition-colors shadow-lg shadow-blue-900/20`}
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
}