'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect, useMemo } from 'react';
import { useGetCategoriesQuery } from '@/lib/api/publicApi';

type Category = {
  id: string | number;
  name: string;
  image?: string;
};

const CategorySlider: React.FC<{ categories: Category[] }> = ({ categories: hardcodedCategories }) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  // Fetch dynamic categories from the API
  const { data: apiResponse } = useGetCategoriesQuery();
  const apiCategories = apiResponse || [];

  // Merge categories: Source of truth is the API
  const allCategories = useMemo(() => {
    // Create a map of hardcoded categories for fast lookup
    const hardcodedMap = new Map(
      hardcodedCategories.map(c => [c.name.toLowerCase(), c])
    );

    // Only display what's in the API, but swap in hardcoded images where available
    return apiCategories.map((apiCat: any) => {
      const hardcodedMatch = hardcodedMap.get(apiCat.name.toLowerCase());
      
      return {
        id: apiCat.id,
        name: apiCat.name,
        // Use hardcoded image if available, otherwise use API image
        image: hardcodedMatch?.image || apiCat.image
      };
    });
  }, [hardcodedCategories, apiCategories]);

  const handleImageError = (id: string | number) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Categories</h2>
      
      {/* Scrollable Container */}
      <div className="w-full overflow-x-auto scrollbar-hide pb-2">
        <div className="flex gap-3 px-1">
          {allCategories.map((category) => (
            <div key={category.id} className="shrink-0">
              <Link 
                href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="block group"
              >
                {/* Card Container */}
                <div className="w-28 h-32 rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                  
                  {/* Image Area (Top 70%) */}
                  <div className="h-[70%] bg-white relative min-h-[80px]">
                    {imageErrors[category.id] || !category.image ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                         <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                         </svg>
                      </div>
                    ) : (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="112px"
                        onError={() => handleImageError(category.id)}
                        unoptimized={category.image.startsWith('http') || category.image.startsWith('blob:')}
                      />
                    )}
                  </div>

                  {/* Text Area (Bottom 30%) */}
                  <div className="h-[30%] min-h-[35px] bg-system-blue-light flex items-center justify-center px-1">
                    <span className="text-xs font-medium text-white text-center line-clamp-2 leading-tight">
                      {category.name}
                    </span>
                  </div>
                  
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategorySlider;