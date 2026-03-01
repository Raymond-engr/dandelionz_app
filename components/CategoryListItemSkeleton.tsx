import React from 'react';
import Skeleton from './ui/Skeleton';

export default function CategoryListItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="w-9 h-9 rounded-lg" />
      </div>
    </div>
  );
}
