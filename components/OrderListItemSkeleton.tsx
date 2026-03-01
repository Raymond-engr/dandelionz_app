import React from 'react';
import Skeleton from './ui/Skeleton';

export default function OrderListItemSkeleton() {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <Skeleton className="h-3 w-12 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="text-right flex flex-col items-end">
              <Skeleton className="h-5 w-16 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
