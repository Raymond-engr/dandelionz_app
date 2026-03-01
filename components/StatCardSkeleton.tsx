import React from 'react';
import Skeleton from './ui/Skeleton';

export default function StatCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-3/4 mb-1" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  );
}
