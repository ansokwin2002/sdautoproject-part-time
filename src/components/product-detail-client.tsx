'use client';

import { Product } from "@/lib/products";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProductCard, { ProductCardSkeleton } from "@/components/product-card";
import ProductList from "@/components/product-list";
import { ArrowLeft, Package, Hash, Award, Archive, Eye, Star, Shield, Truck, Heart, Share2, ShoppingCart, Expand, ZoomIn, Play } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import ImageGalleryModal from '@/components/ImageGalleryModal';
import { cn, getYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/utils";
import { useProductById, useProducts } from "@/hooks/useProducts";

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  originalUrl?: string;
}

interface ProductDetailClientProps {
  productId: string;
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const router = useRouter();

  const { product, loading, error } = useProductById(productId);
  const { products: otherProducts, loading: otherProductsLoading } = useProducts();
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    if (product) {
      const images: MediaItem[] = product.images ? product.images.map(url => ({ type: 'image', url })) : [];
      const youtubeVideosRaw = (product.brand && (product.brand ?? '').toLowerCase().includes('ford') && product.videos)
        ? product.videos.map(videoId => `https://www.youtube.com/watch?v=${videoId}`)
        : [];
      
      const videosForInitialDisplay: MediaItem[] = youtubeVideosRaw.map(url => ({
        type: 'image',
        url: getYouTubeThumbnail(url) || url,
        originalUrl: url
      }));

      const allInitialMedia: MediaItem[] = [...images, ...videosForInitialDisplay];
      
      if (allInitialMedia.length > 0) {
        setSelectedMedia(allInitialMedia[0]);
      } else {
        // Set a default placeholder image if no images or videos are available
        setSelectedMedia({ type: 'image', url: '/assets/placeholder.png' });
      }
    }
  }, [product]);

  if (loading || !product) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading product.</h2>
        <p className="text-gray-700 mb-6">{error || "Product not found or could not be loaded."}</p>
        <Link href="/products" className="text-blue-600 hover:underline">
          Go back to products
        </Link>
      </div>
    );
  }

  if (!selectedMedia) {
    return <ProductDetailSkeleton />; 
  }


  const images: MediaItem[] = product.images ? product.images.map(url => ({ type: 'image', url })) : [];
  const youtubeVideosFullUrls: string[] = (product.brand && (product.brand ?? '').toLowerCase().includes('ford') && product.videos)
    ? product.videos.map(videoId => `https://www.youtube.com/watch?v=${videoId}`)
    : [];

  const videosForDisplay: MediaItem[] = youtubeVideosFullUrls.map(url => ({
    type: 'image',
    url: getYouTubeThumbnail(url) || url,
    originalUrl: url
  }));

  const videosForModal: MediaItem[] = youtubeVideosFullUrls.map(url => ({
    type: 'video',
    url: url
  }));

  const displayMedia: MediaItem[] = [...images, ...videosForDisplay];
  const modalMedia: MediaItem[] = [...images, ...videosForModal];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setMousePosition({ x: clampedX, y: clampedY });
  };

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024 && selectedMedia && selectedMedia.type === 'image') {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleBuyNowClick = () => {
    router.push('/contact');
  };

  const handleMediaClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6 md:py-12 lg:py-20 flex flex-col h-full">
        {/* Back Button */}
        <div className="mb-6 mt-16 md:mt-0">
          <Link
            href="/products"
            className="inline-flex items-center bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm md:text-base font-medium">Back to Genuine Parts and Accessories</span>
          </Link>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-stretch flex-grow">
          {/* Product Images Card */}
          <div className="order-1 h-full">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full p-6">
              {/* Mobile: Main Media First */}
              <div className="block md:hidden mb-4">
                <div
                  ref={imageRef}
                  className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                  onClick={handleMediaClick}
                >
                  {selectedMedia.type === 'image' && !selectedMedia.originalUrl ? (
                    <Image
                      src={selectedMedia.url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center bg-black">
                      <Image
                        src={selectedMedia.url}
                        alt={product.name}
                        fill
                        className="object-cover opacity-60"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play size={60} className="text-white opacity-90 drop-shadow-lg" />
                      </div>
                    </div>
                  )}
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Product Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
                      {(product.tag ?? '').replace(' Parts', '')}
                    </span>
                  </div>

                  {product.condition?.toLowerCase() === 'new' && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500 text-white px-2.5 py-1 text-xs font-bold rounded-full shadow-lg">
                        NEW
                      </span>
                    </div>
                  )}

                  {/* Gallery Button */}
                  <div className="absolute bottom-4 right-4">
                    <button
                      onClick={handleMediaClick}
                      className="bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 group/btn"
                      aria-label="Open gallery"
                    >
                      <Expand size={20} className="group-hover/btn:scale-110 transition-transform duration-200" />
                    </button>
                  </div>

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg">
                      <Eye size={16} className="inline mr-2" />
                      {selectedMedia.originalUrl ? 'Click to Play Video' : 'Click to Expand'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile: Horizontal Scrolling Thumbnails */}
              <div className="block md:hidden">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {displayMedia.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "relative w-16 h-16 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105",
                        selectedMedia?.originalUrl === item.originalUrl || selectedMedia?.url === item.url ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                      )}
                      onClick={() => setSelectedMedia(item)}
                    >
                      <Image
                        src={item.url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {item.originalUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
                          <Play size={20} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop: Side-by-side layout */}
              <div className="hidden md:flex gap-4 h-[400px]">
                {/* Thumbnails */}
                <div className="flex flex-col w-20 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-1">
                  {displayMedia.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "relative w-20 h-[75px] cursor-pointer rounded-lg overflow-hidden border-2 mb-2 transition-all duration-200 hover:scale-105 group flex-shrink-0",
                        selectedMedia?.originalUrl === item.originalUrl || selectedMedia?.url === item.url ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-300'
                      )}
                      onClick={() => setSelectedMedia(item)}
                    >
                      <Image
                        src={item.url}
                        alt={`Product thumbnail ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {item.originalUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
                          <Play size={20} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Main Media */}
                <div className="flex-1 h-full">
                  <div
                    ref={imageRef}
                    className="relative w-full h-full rounded-xl overflow-hidden shadow-lg group"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={selectedMedia.originalUrl ? handleMediaClick : undefined}
                    style={{
                      cursor: selectedMedia.originalUrl ? 'pointer' : (selectedMedia.type === 'image' ? 'crosshair' : 'default')
                    }}
                  >
                    {selectedMedia.type === 'image' && !selectedMedia.originalUrl ? (
                      <Image
                        src={selectedMedia.url}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-300 ease-out"
                        style={{
                          transform: isHovering 
                            ? `scale(2) translate(${(50 - mousePosition.x) * 0.5}%, ${(50 - mousePosition.y) * 0.5}%)` 
                            : 'scale(1)',
                          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                        }}
                      />
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center bg-black">
                        <Image
                          src={selectedMedia.url}
                          alt={product.name}
                          fill
                          className="object-cover opacity-60"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play size={60} className="text-white opacity-90 drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                      </div>
                    )}
                    
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Product Tag */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
                        {product.tag ? product.tag.replace(' Parts', '') : ''}
                      </span>
                    </div>

                    {product.condition?.toLowerCase() === 'new' && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-green-500 text-white px-2.5 py-1 text-xs font-bold rounded-full shadow-lg">
                          NEW
                        </span>
                      </div>
                    )}

                    {/* Gallery Button */}
                    <div className="absolute bottom-4 right-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMediaClick();
                        }}
                        className="bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 group/btn"
                        aria-label="Open gallery"
                      >
                        <Expand size={20} className="group-hover/btn:scale-110 transition-transform duration-200" />
                      </button>
                    </div>

                    {/* Zoom indicator */}
                    {isHovering && selectedMedia.type === 'image' && !selectedMedia.originalUrl && (
                      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
                        2x Zoom
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Card */}
          <div className="order-2 relative h-full">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div className="p-6 flex flex-col flex-grow">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg">
                      {(product.brand ?? '').replace(' Parts', '')}
                    </span>
                  </div>
                </div>
                
                {/* Product Title */}
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-4">
                  {product.name}
                </h1>
                
                {/* Description */}
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Product Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Package size={16} className="mr-2 text-gray-400" />
                    <span className="font-medium text-gray-800">Brand:</span>
                    <span className="ml-2">{(product.brand ?? '').replace(' Parts', '')}</span>
                  </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Hash size={16} className="mr-2 text-gray-400" />
                      <span className="font-medium text-gray-800">Part Number:</span>
                      <span className="ml-2 font-mono text-xs bg-gray-50 px-2 py-1 rounded">
                        {product.partNumber || 'N/A'}
                      </span>
                    </div>

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
                    <span className="font-medium text-gray-800">Quantity:</span>
                    <span className={cn(
                      "ml-2 px-2 py-1 rounded-full text-xs font-medium",
                      product.quantity > 10 
                        ? "bg-green-100 text-green-700"
                        : product.quantity > 0
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    )}>
                      {product.quantity > 0 ? `${product.quantity}` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-grow" />

                {/* Price Section */}
                <div className="border-t border-gray-100 pt-6 mt-auto">
                  <div className="flex items-center justify-between mb-6">
                                      <div className="flex items-center gap-3">
                                        <span className="text-4xl font-bold text-gray-900">
                                          {product.formatted_price ? `AU ${product.formatted_price.replace('$', '')}` : `AU $${parseFloat(product.price.replace(/[^\d.-]/g, '')).toFixed(2)}`}
                                        </span>
                                        {/* Calculate and display discount only if original price is valid and greater than current price */}
                                        {product.originalPrice && parseFloat(product.originalPrice) > 0 && parseFloat(product.originalPrice) > parseFloat(product.price.replace(/[^\d.-]/g, '')) && (
                                          <>
                                            <span className="text-lg md:text-xl text-gray-400 line-through">
                                              {product.formatted_original_price ? `AU ${product.formatted_original_price.replace('$', '')}` : `AU $${parseFloat(product.originalPrice).toFixed(2)}`}
                                            </span>
                                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                              {Math.round(((parseFloat(product.original_price) - parseFloat(product.price.replace(/[^\d.-]/g, ''))) / parseFloat(product.original_price)) * 100)}% OFF
                                            </span>
                                          </>
                                        )}
                                      </div>                  </div>

                  {/* Buy Button */}
                  <Button
                    size="lg"
                    className="w-full text-base md:text-lg py-3 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                    onClick={handleBuyNowClick}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator className="my-8 md:my-12 lg:my-16" />

        {/* Other Products */}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 md:mb-8 flex items-center">
          <Package size={24} className="mr-3 text-blue-600" />
          Other Products
        </h2>
        <ProductList products={otherProducts} showContainer={false} />
      </div>

      {/* Image Gallery Modal */}
      {product && selectedMedia && (
        <ImageGalleryModal
          media={modalMedia}
          initialIndex={modalMedia.findIndex(item => item.originalUrl === selectedMedia.originalUrl || item.url === item.url)}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export const ProductDetailSkeleton = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6 md:py-12 lg:py-20">
        <div className="mb-6">
          <Skeleton className="h-10 w-48 rounded-lg" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm p-6">
            <div className="block md:hidden mb-4">
              <Skeleton className="w-full aspect-square rounded-xl" />
            </div>
            <div className="block md:hidden">
              <div className="flex gap-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={`mobile-image-skeleton-${index}`} className="w-16 h-16 rounded-lg flex-shrink-0" />
                ))}
              </div>
            </div>
            
            <div className="hidden md:flex gap-4">
              <div className="flex flex-col gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={`desktop-image-skeleton-${index}`} className="w-20 h-20 rounded-lg" />
                ))}
              </div>
              <Skeleton className="flex-1 h-[400px] rounded-xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm p-6">
            <div className="flex justify-between mb-4">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-8 md:h-10 w-full mb-4" />
            <Skeleton className="h-24 w-full mb-6" />
            <div className="space-y-3 mb-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`detail-skeleton-${index}`} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="h-8 md:h-10 w-28" />
                <Skeleton className="h-6 md:h-8 w-20" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
        
        <Separator className="my-8 md:my-12 lg:my-16" />
        
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={`product-card-skeleton-${index}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};