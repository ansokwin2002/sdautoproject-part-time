'use client';

import { products, Product } from "@/lib/products";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProductCard, { ProductCardSkeleton } from "@/components/product-card";
import ProductList from "@/components/product-list";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import ImageGalleryModal from '@/components/ImageGalleryModal';

interface ProductDetailClientProps {
  productId: string;
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundProduct = products.find((p) => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.images[0]);
      }
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [productId]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp values between 0 and 100
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setMagnifierPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    notFound();
  }

  const otherProducts = products.filter((p) => p.id !== product.id);

  const handleBuyNowClick = () => {
    router.push('/contact');
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto py-12 md:py-20">
        <div className="mb-8">
          <Link
            href="/"
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors mt-4 md:mt-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all products
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Product Image Gallery */}
          <div className="flex flex-col md:flex-row gap-4 h-full">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 overflow-auto scrollbar-hide h-full">
              {product.images.slice(0, 7).map((image, index) => (
                <div
                  key={index}
                  className={`relative w-20 h-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 ${selectedImage === image ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image}
                    alt={`Product thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              {product.images.length > 7 && (
                <div
                  className="relative w-20 h-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 border-gray-300 flex items-center justify-center group"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Image
                    src={product.images[7]}
                    alt="View all images"
                    fill
                    className="object-cover blur-sm group-hover:blur-none transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-center text-sm font-medium group-hover:bg-opacity-0 transition-all duration-300">
                    View All
                    <br />
                    ({product.images.length - 7} more)
                  </div>
                </div>
              )}
            </div>

            {/* Main Product Image */}
            <div className="flex-1 relative h-full">
              <div
                ref={imageRef}
                className="relative w-full h-full rounded-lg overflow-hidden shadow-lg cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />

                {/* Overlay indicator on main image */}
                {showMagnifier && (
                  <div
                    className="absolute w-16 h-16 border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
                    style={{
                      left: `calc(${magnifierPosition.x}% - 32px)`,
                      top: `calc(${magnifierPosition.y}% - 32px)`,
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Product Details with Magnifier Overlay */}
          <div className="relative flex flex-col h-full">
            {/* Magnifier Overlay - Full Coverage */}
            {showMagnifier && (
              <div className="absolute inset-0 z-50 rounded-lg overflow-hidden bg-white shadow-2xl border-2 border-blue-200">
                <div
                  className="w-full h-full bg-no-repeat"
                  style={{
                    backgroundImage: `url(${selectedImage})`,
                    backgroundSize: '300%', // 3x zoom
                    backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                  }}
                />
                <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium">
                  3x Zoom
                </div>
                <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm">
                  Move mouse to explore • Click to exit
                </div>
              </div>
            )}

            {/* Original Product Details */}
            <div>
              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                {product.brand}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold font-headline text-gray-900 mt-4 mb-4">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500 mb-6">
                Product Code: {product.code}
              </p>
              {product.partNumber && (
                <p className="text-sm text-gray-500 mb-6">
                  Part Number: {product.partNumber}
                </p>
              )}
              {product.condition && (
                <p className="text-sm text-gray-500 mb-6">
                  Condition: {product.condition}
                </p>
              )}
            </div>

            <div className="mt-auto">
              <Button
                size="lg"
                className="w-full hover:scale-105 transition-transform duration-200"
                onClick={handleBuyNowClick}
              >
                Buy now
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-16" />

        {/* Other Products */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Other Products
          </h2>
          <ProductList products={otherProducts} showContainer={false} />
        </div>
      </div>

      {product && (
        <ImageGalleryModal
          images={product.images}
          initialIndex={product.images.indexOf(selectedImage) !== -1 ? product.images.indexOf(selectedImage) : 0}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

const ProductDetailSkeleton = () => {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="mb-8">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnails Skeleton */}
          <div className="flex md:flex-col gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="w-20 h-20 rounded-lg" />
            ))}
          </div>
          {/* Main Image Skeleton */}
          <Skeleton className="flex-1 aspect-square rounded-lg" />
        </div>
        <div className="flex flex-col h-full">
          <div>
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-16 w-full mb-6" /> {/* Tip box skeleton */}
            <div className="flex items-center space-x-4 mb-6">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-6 w-32 mb-6" />
            <Skeleton className="h-6 w-40 mb-6" />
            <Skeleton className="h-6 w-28 mb-6" />
          </div>
          <div className="mt-auto">
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
      <Separator className="my-16" />
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Other Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};