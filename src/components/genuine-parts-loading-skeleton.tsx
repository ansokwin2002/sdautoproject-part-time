'use client';

import { Skeleton } from "@/components/ui/skeleton";
import ProductCard, { ProductCardSkeleton } from "@/components/product-card";

export default function GenuinePartsLoadingSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="h-12 w-1/3 mx-auto mb-8 mt-16 md:mt-0" /> {/* Title Skeleton */}

      {/* Brand Selection Grid Skeleton */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-8 py-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg p-2 mb-2" />
            <Skeleton className="w-16 sm:w-20 md:w-24 h-4" />
          </div>
        ))}
      </div>

      {/* Product List Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4 px-6">
        <Skeleton className="h-6 w-48" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}
