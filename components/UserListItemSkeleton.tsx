import React from 'react';
import Skeleton from './ui/Skeleton';

export default function UserListItemSkeleton() {
  return (
    <div className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <Skeleton className="w-12 h-12 rounded-full shrink-0" />
      <div className="flex-1 text-left min-w-0">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}
