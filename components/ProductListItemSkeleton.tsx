import React from 'react';
import Skeleton from './ui/Skeleton';

export default function ProductListItemSkeleton() {
  return (
    <div className="w-full p-4 bg-gray-50 rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-3 w-1/3 mb-1" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-10 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
