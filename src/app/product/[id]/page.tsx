
import { products } from "@/lib/products";
import ProductDetailClient from "@/components/product-detail-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

function ProductDetailSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6 md:py-12 lg:py-20">
        <div className="mb-6 mt-16 md:mt-0">
          <Skeleton className="h-10 w-48 rounded-lg" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Image Skeletons */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm p-6">
            <div className="block md:hidden mb-4">
              <Skeleton className="w-full aspect-square rounded-xl" />
            </div>
            <div className="block md:hidden">
              <div className="flex gap-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="w-16 h-16 rounded-lg flex-shrink-0" />
                ))}
              </div>
            </div>
            
            <div className="hidden md:flex gap-4">
              <div className="flex flex-col gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="w-20 h-20 rounded-lg" />
                ))}
              </div>
              <Skeleton className="flex-1 h-[400px] rounded-xl" />
            </div>
          </div>
          
          {/* Details Skeleton */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm p-6">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 md:h-10 w-full mb-4" />
            <Skeleton className="h-24 w-full mb-6" />
            <div className="space-y-3 mb-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="h-8 md:h-10 w-28" />
              </div>
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailClient productId={params.id} />
    </Suspense>
  );
}
