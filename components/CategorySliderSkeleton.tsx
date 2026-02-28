import React from 'react';
import Skeleton from './ui/Skeleton';

export default function CategorySliderSkeleton() {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Categories</h2>
      
      <div className="w-full overflow-x-auto scrollbar-hide pb-2">
        <div className="flex gap-3 px-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="shrink-0">
              <div className="w-28 h-32 rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                <div className="h-[70%] bg-white relative min-h-[80px]">
                  <Skeleton className="w-full h-full rounded-none" />
                </div>
                <div className="h-[30%] min-h-[35px] bg-gray-200 flex items-center justify-center px-1">
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
