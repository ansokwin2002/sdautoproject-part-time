'use client';

import { products, Product } from "@/lib/products";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProductCard, { ProductCardSkeleton } from "@/components/product-card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductDetailClientProps {
  productId: string;
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundProduct = products.find((p) => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
      }
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [productId]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    notFound();
  }

  const otherProducts = products.filter((p) => p.id !== product.id);

  return (
    <div className="bg-white">
      <div className="container mx-auto py-12 md:py-20">
        <div className="mb-8">
            <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to all products
            </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
            <Image 
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col h-full">
            <div>
              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{product.brand}</span>
              <h1 className="text-3xl md:text-4xl font-bold font-headline text-gray-900 mt-4 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">{product.description}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>

              <p className="text-sm text-gray-500 mb-6">Product Code: {product.code}</p>
            </div>

            <div className="mt-auto">
                <Button size="lg" className="w-full hover:scale-105 transition-transform duration-200">
                    Add to Cart
                </Button>
            </div>
          </div>
        </div>

        <Separator className="my-16" />

        {/* Other Products */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Other Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherProducts.map((otherProduct) => (
              <ProductCard key={otherProduct.id} product={otherProduct} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const ProductDetailSkeleton = () => {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="mb-8">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Skeleton className="relative aspect-square rounded-lg" />
        <div className="flex flex-col h-full">
          <div>
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-24 w-full mb-6" />
            <div className="flex items-center space-x-4 mb-6">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-6 w-32 mb-6" />
          </div>
          <div className="mt-auto">
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
      <Separator className="my-16" />
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Other Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
