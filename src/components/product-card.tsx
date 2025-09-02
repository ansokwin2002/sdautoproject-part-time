'use client';

import SafeImage from "./safe-image";
import Link from "next/link";
import { Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface ProductCardProps {
  product?: Product;
  className?: string;
  loading?: boolean;
}

const ProductCard = ({ product, className, loading }: ProductCardProps) => {
  if (loading || !product) {
    return <ProductCardSkeleton />;
  }

  return (
    <div className={cn("bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col", className)}>
      <div className="relative aspect-[4/3]">
        <Link href={`/product/${product.id}`}>
          <SafeImage
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-3 py-1 text-xs font-medium rounded">{product.tag}</span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 h-14">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 h-6">Code: {product.code}</p>
        <div className="flex-grow" />
        <div className="flex items-center justify-between mb-3 h-10">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm h-6">
          <Link href={`/product/${product.id}`} className="text-green-600 hover:text-green-700 font-medium flex items-center transition-colors">
            <span className="mr-1">👁</span> View detail
          </Link>
          <span className="text-gray-500">Brand: {product.brand}</span>
        </div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg group flex flex-col">
      <div className="relative aspect-[4/3]">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <Skeleton className="h-14 w-full mb-2" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <div className="flex-grow" />
        <div className="flex items-center justify-between mb-3 h-10">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm h-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;