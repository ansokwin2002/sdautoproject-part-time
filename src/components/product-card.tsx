'use client';

import SafeImage from "./safe-image";
import Link from "next/link";
import { Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Eye, Package, Hash, Award, Archive } from "lucide-react";

interface ProductCardProps {
  product?: Product;
  className?: string;
  loading?: boolean;
}

const ProductCard = ({ product, className, loading }: ProductCardProps) => {
  if (loading || !product) {
    return <ProductCardSkeleton />;
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full",
      "hover:-translate-y-1 hover:border-gray-200",
      className
    )}>
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <Link href={`/product/${product.id}`} className="block h-full">
          <SafeImage
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Tag */}
        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
            {product.tag}
          </span>
        </div>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 right-4">
            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-1 text-xs font-bold rounded-full shadow-lg">
              -{discountPercentage}%
            </span>
          </div>
        )}

        {/* Quick View Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Link 
            href={`/product/${product.id}`}
            className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:bg-white transition-colors flex items-center gap-2"
          >
            <Eye size={16} />
            Quick View
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Product Name */}
        <Link href={`/product/${product.id}`} className="block mb-4">
          <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Product Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Package size={16} className="mr-2 text-gray-400" />
            <span className="font-medium text-gray-800">Brand:</span>
            <span className="ml-2">{product.brand}</span>
          </div>

          {product.partNumber && (
            <div className="flex items-center text-sm text-gray-600">
              <Hash size={16} className="mr-2 text-gray-400" />
              <span className="font-medium text-gray-800">Part#:</span>
              <span className="ml-2 font-mono text-xs bg-gray-50 px-2 py-1 rounded">
                {product.partNumber}
              </span>
            </div>
          )}

          {product.condition && (
            <div className="flex items-center text-sm text-gray-600">
              <Award size={16} className="mr-2 text-gray-400" />
              <span className="font-medium text-gray-800">Condition:</span>
              <span className={cn(
                "ml-2 px-2 py-1 rounded-full text-xs font-medium",
                product.condition.toLowerCase() === 'new' 
                  ? "bg-green-100 text-green-700"
                  : product.condition.toLowerCase() === 'used'
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              )}>
                {product.condition}
              </span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600">
            <Archive size={16} className="mr-2 text-gray-400" />
            <span className="font-medium text-gray-800">Stock:</span>
            <span className={cn(
              "ml-2 px-2 py-1 rounded-full text-xs font-medium",
              product.quantity > 10 
                ? "bg-green-100 text-green-700"
                : product.quantity > 0
                ? "bg-orange-100 text-orange-700"
                : "bg-red-100 text-red-700"
            )}>
              {product.quantity > 0 ? `${product.quantity} units` : 'Out of stock'}
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Price Section */}
        <div className="border-t border-gray-100 pt-4 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <Link 
              href={`/product/${product.id}`}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Eye size={16} />
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3]">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute top-4 left-4">
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <Skeleton className="h-6 w-4/5 mb-2" />
        <Skeleton className="h-6 w-3/5 mb-4" />
        
        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2 rounded" />
            <Skeleton className="h-4 w-12 mr-2" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2 rounded" />
            <Skeleton className="h-4 w-12 mr-2" />
            <Skeleton className="h-6 w-24 rounded" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2 rounded" />
            <Skeleton className="h-4 w-16 mr-2" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2 rounded" />
            <Skeleton className="h-4 w-12 mr-2" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        
        {/* Spacer */}
        <div className="flex-grow" />
        
        {/* Price Section */}
        <div className="border-t border-gray-100 pt-4">
          <div className="block w-full mb-4">
            <Skeleton className="h-8 w-20 inline-block mr-3" />
            <Skeleton className="h-6 w-16 inline-block mr-2" />
            <Skeleton className="h-6 w-16 inline-block rounded-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg block" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;