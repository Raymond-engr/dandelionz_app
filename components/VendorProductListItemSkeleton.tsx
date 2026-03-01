import React from 'react';
import Skeleton from './ui/Skeleton';

export default function VendorProductListItemSkeleton() {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <Skeleton className="h-3 w-24 mb-1" />
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-6 w-28" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-9 h-9 rounded-lg" />
          <Skeleton className="w-9 h-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
