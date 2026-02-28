import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

interface ProductGridSkeletonProps {
  count?: number;
  hideAddToCart?: boolean;
}

export default function ProductGridSkeleton({ count = 6, hideAddToCart = false }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 min-[250px]:grid-cols-2 min-[500px]:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} hideAddToCart={hideAddToCart} />
      ))}
    </div>
  );
}
