import React from 'react';
import Skeleton from './ui/Skeleton';

interface ProductCardSkeletonProps {
  hideAddToCart?: boolean;
}

export default function ProductCardSkeleton({ hideAddToCart = false }: ProductCardSkeletonProps) {
  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden border border-gray-100 h-full">
      {/* Product Image Skeleton */}
      <div className="relative aspect-square">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      {/* Product Info Skeleton */}
      <div className="p-3">
        {/* Name */}
        <Skeleton className="h-4 w-3/4 mb-2" />
        
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex flex-col gap-1 w-1/2">
            {/* Price */}
            <Skeleton className="h-5 w-full" />
            {/* Discounted price placeholder */}
            <Skeleton className="h-3 w-1/2" />
          </div>
          
          {/* Rating placeholder */}
          <Skeleton className="h-5 w-10 shrink-0" />
        </div>

        {/* Add/Remove Cart Button Skeleton */}
        {!hideAddToCart && (
          <Skeleton className="w-full h-8 rounded-lg" />
        )}
      </div>
    </div>
  );
}
