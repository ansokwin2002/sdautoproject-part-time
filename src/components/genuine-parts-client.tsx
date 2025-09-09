'use client';

import { useState, useMemo, useEffect, useCallback } from 'react'; // Added useCallback
import { products } from '@/lib/products';
import ProductList from '@/components/product-list';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation'; // Import useRouter
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Added ChevronLeft, ChevronRight

export default function GenuinePartsClient() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Get router instance
  const initialBrandParam = searchParams.get('brand');
  const viewParam = searchParams.get('view');
  const allowedBrands = useMemo(() => ["Ford Parts", "Isuzu Parts", "Toyota Parts", "Mazda Parts", "Mitsubishi Parts", "Nissan Parts", "Honda Parts", "Suzuki Parts"], []);

  const initialBrand = useMemo(() => {
    if (initialBrandParam && !initialBrandParam.endsWith(' Parts')) {
      const brandWithParts = `${initialBrandParam} Parts`;
      if (allowedBrands.includes(brandWithParts)) {
        return brandWithParts;
      }
    }
    return initialBrandParam;
  }, [initialBrandParam, allowedBrands]);

  const filteredProductSource = useMemo(() => {
    return products.filter(product => allowedBrands.includes(product.brand));
  }, [allowedBrands]);

  const uniqueBrands = useMemo(() => {
    return ["Ford Parts", "Isuzu Parts", "Toyota Parts", "Mazda Parts", "Mitsubishi Parts", "Nissan Parts", "Honda Parts", "Suzuki Parts", "Aftermarket"];
  }, []);

  const [selectedBrand, setSelectedBrand] = useState<string | null>(initialBrand);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(7); // New state for responsive cards per view

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // sm breakpoint
        setVisibleCards(2);
      } else if (window.innerWidth < 768) { // md breakpoint
        setVisibleCards(3);
      } else if (window.innerWidth < 1024) { // lg breakpoint
        setVisibleCards(4);
      } else if (window.innerWidth < 1280) { // xl breakpoint
        setVisibleCards(5);
      } else {
        setVisibleCards(7);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(prevIndex => Math.min(prevIndex + 1, uniqueBrands.length - visibleCards)); // Use visibleCards
  }, [uniqueBrands, visibleCards]);

  useEffect(() => {
    setSelectedBrand(initialBrand);
  }, [initialBrand]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!selectedBrand) {
      return filteredProductSource;
    }
    // Compare product.brand with selectedBrand
    return filteredProductSource.filter(product => product.brand === selectedBrand);
  }, [selectedBrand, filteredProductSource]);

  const brandLogos = {
    "Ford Parts": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/1200px-Ford_logo_flat.svg.png",
    "Isuzu Parts": "https://1000logos.net/wp-content/uploads/2021/04/Isuzu-logo-500x281.png",
    "Toyota Parts": "https://logos-world.net/wp-content/uploads/2020/04/Toyota-Logo.png",
    "Mazda Parts": "https://logos-world.net/wp-content/uploads/2021/03/Mazda-Logo.png",
    "Mitsubishi Parts": "https://logos-world.net/wp-content/uploads/2021/03/Mitsubishi-Logo.png",
    "Nissan Parts": "https://logos-world.net/wp-content/uploads/2021/03/Nissan-Logo.png",
    "Honda Parts": "https://logos-world.net/wp-content/uploads/2021/03/Honda-Logo.png",
    "Suzuki Parts": "https://logos-world.net/wp-content/uploads/2021/03/Suzuki-Logo.png",
    "Aftermarket": "https://via.placeholder.com/48?text=AM", // Placeholder for Aftermarket
  };

  const handleBrandClick = (brand: string | null) => {
    if (brand) {
      router.push(`/genuine-parts?brand=${encodeURIComponent(brand)}`);
    } else {
      router.push(`/genuine-parts`);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8 mt-16 md:mt-0">{viewParam === 'aftermarket' ? "Aftermarket Parts and Accessories" : "Genuine Parts and Accessories"}</h1>

      {/* Brand Selection Slider */}
      <div className="relative w-full overflow-hidden mb-8 py-4 pr-24"> {/* Increased pr-12 to pr-24 */}
        <div
          className="flex transition-transform duration-500 ease-in-out gap-2"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }} // Use visibleCards
        >
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex-none flex flex-col items-center ml-6" style={{ width: `calc(100% / ${visibleCards})` }}> {/* Use visibleCards */}
                <Skeleton className="w-20 h-20 rounded-full mb-2" />
                <Skeleton className="w-24 h-4" />
              </div>
            ))
          ) : (
            <>
              {/* All Brands Button */}
              <div className="flex-none flex flex-col items-center ml-6" style={{ width: `calc(100% / ${visibleCards})` }}> {/* Use visibleCards */}
                <Button
                  variant={selectedBrand === null ? 'default' : 'outline'}
                  onClick={() => handleBrandClick(null)}
                  className="w-20 h-20 rounded-full p-2 mb-2"
                >
                  <span className="text-sm font-medium">All</span>
                </Button>
                <span className="text-sm text-center font-medium">All Brands</span>
              </div>

              {/* Brand Buttons */}
              {uniqueBrands.map(brand => (
                <div key={brand} className="flex-none flex flex-col items-center" style={{ width: `calc(100% / ${visibleCards})` }}> {/* Use visibleCards */}
                  <Button
                    variant={selectedBrand === brand ? 'default' : 'outline'}
                    onClick={() => handleBrandClick(brand)}
                    className="w-20 h-20 rounded-full p-2 mb-2 hover:scale-105 transition-transform"
                  >
                    {brandLogos[brand] ? (
                      <Image
                        src={brandLogos[brand]}
                        alt={`${brand} Logo`}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xs font-bold text-center">
                        {brand.replace(' Parts', '').substring(0, 4)}
                      </span>
                    )}
                  </Button>
                  <span className="text-sm text-center font-medium">
                    {visibleCards <= 3 ? brand.replace(' Parts', '').split(' ')[0] : brand.replace(' Parts', '')}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2"
          onClick={handleNext}
          disabled={currentIndex >= uniqueBrands.length - visibleCards}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <ProductList products={filteredProducts} showContainer={false} selectedBrand={selectedBrand} allowedBrands={allowedBrands} />
    </div>
  );
}