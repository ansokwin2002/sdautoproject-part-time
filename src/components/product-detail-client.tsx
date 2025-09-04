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

    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setMagnifierPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseEnter = () => {
    // Only enable magnifier on desktop
    if (window.innerWidth >= 1024) {
      setShowMagnifier(true);
    }
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
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-6 md:py-12 lg:py-20">
        {/* Back Button */}
        <div className="mb-6 mt-16 md:mt-0">
          <Link
            href="/genuine-parts"
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm md:text-base">Back to Genuine Parts</span>
          </Link>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Images */}
          <div className="order-1">
            {/* Mobile: Main Image First */}
            <div className="block md:hidden mb-4">
              <div
                ref={imageRef}
                className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg"
                onClick={() => setIsModalOpen(true)}
              >
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Mobile: Horizontal Scrolling Thumbnails */}
            <div className="block md:hidden">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.slice(0, 6).map((image, index) => (
                  <div
                    key={index}
                    className={`relative w-16 h-16 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 ${selectedImage === image ? 'border-blue-500' : 'border-gray-200'}`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {product.images.length > 6 && (
                  <div
                    className="relative w-16 h-16 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-100"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <span className="text-xs font-medium text-gray-600 text-center leading-tight">
                      +{product.images.length - 6}<br/>more
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop: Side-by-side layout */}
            <div className="hidden md:flex gap-4 h-[400px]">
              {/* Thumbnails */}
              <div className="flex flex-col w-20 h-full">
                {product.images.length > 5 ? (
                  <>
                    {product.images.slice(0, 4).map((image, index) => (
                      <div
                        key={index}
                        className={`relative w-20 h-[75px] cursor-pointer rounded-lg overflow-hidden border-2 ${selectedImage === image ? 'border-blue-500' : 'border-transparent'} mb-2`}
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
                    <div
                      className="relative w-20 h-[75px] cursor-pointer rounded-lg overflow-hidden border-2 border-gray-300 flex items-center justify-center group bg-gray-100"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <span className="text-xs font-medium text-gray-600 text-center">
                        +{product.images.length - 4}
                      </span>
                    </div>
                  </>
                ) : (
                  product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative w-20 flex-1 cursor-pointer rounded-lg overflow-hidden border-2 ${selectedImage === image ? 'border-blue-500' : 'border-transparent'} ${index < product.images.length - 1 ? 'mb-2' : ''}`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <Image
                        src={image}
                        alt={`Product thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                )}
              </div>

              {/* Main Image */}
              <div className="flex-1 h-full">
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

                  {/* Magnifier indicator */}
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
          </div>

          {/* Product Details */}
          <div className="order-2 relative">
            {/* Desktop Magnifier Overlay */}
            {showMagnifier && (
              <div className="hidden lg:block absolute inset-0 z-50 rounded-lg overflow-hidden bg-white shadow-2xl border-2 border-blue-200">
                <div
                  className="w-full h-full bg-no-repeat"
                  style={{
                    backgroundImage: `url(${selectedImage})`,
                    backgroundSize: '300%',
                    backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                  }}
                />
                <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium">
                  3x Zoom
                </div>
                <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm">
                  Move mouse to explore
                </div>
              </div>
            )}

            {/* Product Information */}
            <div className="space-y-4">
              <span className="inline-block text-xs md:text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                {product.brand}
              </span>
              
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-2xl md:text-3xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg md:text-xl text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-2 text-sm text-gray-500">
                <p>Product Code: {product.code}</p>
                {product.partNumber && (
                  <p>Part Number: {product.partNumber}</p>
                )}
                {product.condition && (
                  <p>Condition: {product.condition}</p>
                )}
              </div>
              
              <br /><br />

              {/* Buy Button */}
              <div className="pt-19">
                <Button
                  size="lg"
                  className="w-full text-base md:text-lg py-3 md:py-4 hover:scale-105 transition-transform duration-200"
                  onClick={handleBuyNowClick}
                >
                  Buy now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator className="my-8 md:my-12 lg:my-16" />

        {/* Other Products */}
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
            Other Products
          </h2>
          <ProductList products={otherProducts} showContainer={false} />
        </div>
      </div>

      {/* Image Gallery Modal */}
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
    <div className="container mx-auto px-4 py-6 md:py-12 lg:py-20">
      <div className="mb-6">
        <Skeleton className="h-6 w-40" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Image Skeletons */}
        <div>
          {/* Mobile Image Skeleton */}
          <div className="block md:hidden mb-4">
            <Skeleton className="w-full aspect-square rounded-lg" />
          </div>
          <div className="block md:hidden">
            <div className="flex gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="w-16 h-16 rounded-lg flex-shrink-0" />
              ))}
            </div>
          </div>
          
          {/* Desktop Image Skeleton */}
          <div className="hidden md:flex gap-4">
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="w-20 h-20 rounded-lg" />
              ))}
            </div>
            <Skeleton className="flex-1 aspect-square rounded-lg" />
          </div>
        </div>
        
        {/* Details Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 md:h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 md:h-10 w-28" />
            <Skeleton className="h-6 md:h-8 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-28" />
          </div>
          <Skeleton className="h-12 md:h-14 w-full" />
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
  );
};