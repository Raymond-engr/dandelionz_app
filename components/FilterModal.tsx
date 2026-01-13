import React, { useState, useEffect } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  categories: { id: string; name: string; image?: string }[]; // New prop for dynamic categories
  initialFilters: {
    priceRange: [number, number];
    sortBy: string;
    category: string;
  };
}

interface FilterState {
  price_min?: number;
  price_max?: number;
  ordering?: string; // Corresponds to sortBy
  category?: string;
}

const ALL_CATEGORIES = [
    { value: '', label: 'All Categories' }, // Option to select all
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home_appliances', label: 'Home Appliances' },
    { value: 'beauty', label: 'Beauty & Personal Care' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'books', label: 'Books' },
    { value: 'toys', label: 'Toys & Games' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'computers', label: 'Computers & Accessories' },
    { value: 'phones', label: 'Phones & Tablets' },
    { value: 'jewelry', label: 'Jewelry & Watches' },
    { value: 'baby', label: 'Baby Products' },
    { value: 'pets', label: 'Pet Supplies' },
    { value: 'office', label: 'Office Products' },
    { value: 'gaming', label: 'Video Games & Consoles' },
];

export default function FilterModal({ isOpen, onClose, onApply, categories, initialFilters }: FilterModalProps) {
  const [maxPrice, setMaxPrice] = useState(initialFilters.priceRange[1]);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || '');
  const [searchCategory, setSearchCategory] = useState('');

  // Sync internal state with external initialFilters when modal opens
  useEffect(() => {
    setMaxPrice(initialFilters.priceRange[1]);
    setSortBy(initialFilters.sortBy);
    setSelectedCategory(initialFilters.category);
  }, [initialFilters]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      price: maxPrice,
      ordering: sortBy,
      category: selectedCategory === 'All Categories' ? undefined : selectedCategory,
    });
    onClose();
  };

  const filteredCategories = ALL_CATEGORIES.filter(cat =>
    cat.label.toLowerCase().includes(searchCategory.toLowerCase())
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
              <span className="text-base font-semibold text-gray-900">₦0</span>
              <span className="text-base font-semibold text-gray-900">₦{maxPrice}</span>
            </div>
            
            <div className="relative h-1 bg-gray-100 rounded-full mt-2">
              <div
                className={`absolute h-1 ${activeColorClass} rounded-full`}
                style={{
                  left: '0%',
                  width: `${(maxPrice / 500) * 100}%`,
                }}
              />
              <div
                className={`absolute w-5 h-5 ${activeColorClass} border-2 border-white rounded-full -top-2 cursor-pointer shadow-md`}
                style={{ left: `calc(${(maxPrice / 500) * 100}% - 10px)` }}
              />
              <input
                type="range"
                min="0"
                max="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
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
                <option value="">Newly Updated</option>
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
              {filteredCategories.map((cat) => {
                const isSelected = selectedCategory === cat.value;
                return (
                  <label
                    key={cat.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name="category_selection"
                        value={cat.value}
                        checked={isSelected}
                        onChange={() => setSelectedCategory(cat.value)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border transition-all duration-200 flex items-center justify-center
                        ${isSelected ? `${activeColorClass} border-transparent` : 'bg-white border-blue-900'}`
                      }>
                         {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {cat.label}
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