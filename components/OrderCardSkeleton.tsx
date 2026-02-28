import React from 'react';
import Skeleton from './ui/Skeleton';

export default function OrderCardSkeleton() {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/4 mb-1" />
          <div className="flex gap-2">
             <Skeleton className="h-4 w-24 rounded-full mt-1" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-md shrink-0" />
      </div>
    </div>
  );
}
