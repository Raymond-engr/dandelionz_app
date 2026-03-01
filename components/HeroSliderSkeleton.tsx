import React from 'react';
import Skeleton from './ui/Skeleton';

export default function HeroSliderSkeleton() {
  return (
    <div className="w-full overflow-hidden mb-6">
      <div className="relative w-full">
        <div className="flex gap-2">
           <div className="w-[85%] shrink-0 relative h-[100px] min-[300px]:h-[130px] min-[350px]:h-[145px] min-[400px]:h-40 sm:h-48">
              <Skeleton className="w-full h-full rounded-xl" />
           </div>
           <div className="w-[10%] shrink-0 relative h-[100px] min-[300px]:h-[130px] min-[350px]:h-[145px] min-[400px]:h-40 sm:h-48 overflow-hidden">
              <Skeleton className="w-full h-full rounded-xl" />
           </div>
        </div>
        
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
           <Skeleton className="h-1.5 w-6 rounded-full" />
           <Skeleton className="h-1.5 w-1.5 rounded-full" />
           <Skeleton className="h-1.5 w-1.5 rounded-full" />
        </div>
      </div>
    </div>
  );
}
