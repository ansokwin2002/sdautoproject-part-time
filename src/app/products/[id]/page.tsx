'use client';

import { useParams } from 'next/navigation';
import ProductDetailClient from '@/components/product-detail-client';
import { useProductById, useProducts } from '@/hooks/useProducts';
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ProductCardSkeleton } from "@/components/product-card";


// Re-creating a simplified skeleton here for the page level
const ProductDetailPageSkeleton = () => (
    <div className="bg-gray-50 min-h-screen">
    <div className="container mx-auto px-4 py-6 md:py-12 lg:py-20">
      <div className="mb-6 mt-16 md:mt-0">
        <Skeleton className="h-10 w-48 rounded-lg" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Image Skeletons */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm p-6">
          <div className="hidden md:flex gap-4 h-[400px]">
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="w-20 h-[75px] rounded-lg" />
              ))}
            </div>
            <Skeleton className="flex-1 h-full rounded-xl" />
          </div>
           <div className="block md:hidden">
              <Skeleton className="w-full aspect-square rounded-xl" />
           </div>
        </div>
        
        {/* Details Skeleton */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm p-6 flex flex-col">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-8 md:h-10 w-full mb-4" />
          <Skeleton className="h-24 w-full mb-6" />
          <div className="space-y-3 mb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
          <div className="flex-grow" />
          <div className="border-t border-gray-100 pt-6 mt-auto">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-10 w-1/3" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
      
      <Separator className="my-8 md:my-12 lg:my-16" />
      
      <div>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  </div>
);


export default function ProductDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id ?? null);

  const { product, loading, error } = useProductById(id);
  const { products: allProducts } = useProducts();

  const otherProducts = allProducts.filter((p) => p.id !== id);

  if (loading) {
    return <ProductDetailPageSkeleton />;
  }

  if (error || !product) {
    return (
        <div className="container mx-auto py-16 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Product not found</h2>
            <p className="text-gray-600">{error || "The product you are looking for does not exist."}</p>
        </div>
    );
  }

  // We will pass the fetched product object and the list of other products to the client component.
  return <ProductDetailClient product={product} otherProducts={otherProducts} />;
}
