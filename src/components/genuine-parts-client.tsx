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


export default function GenuinePartsClient() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Get router instance
  const initialBrandParam = searchParams.get('brand');
  const viewParam = searchParams.get('view');
  const allowedBrands = useMemo(() => ["Ford Parts", "Isuzu Parts", "Toyota Parts", "Mazda Parts", "Mitsubishi Parts", "Nissan Parts", "Honda Parts", "Suzuki Parts", "Aftermarket"], []);

  const initialBrand = useMemo(() => {
    if (initialBrandParam) {
      // If the URL already has the full brand name (e.g., "Isuzu Parts"), use it directly
      if (allowedBrands.includes(initialBrandParam)) {
        return initialBrandParam;
      }
      
      // If the URL has just the brand name (e.g., "Isuzu"), convert it to full name
      if (!initialBrandParam.endsWith(' Parts') && initialBrandParam !== 'Aftermarket') {
        const brandWithParts = `${initialBrandParam} Parts`;
        if (allowedBrands.includes(brandWithParts)) {
          return brandWithParts;
        }
      }
    }
    return initialBrandParam;
  }, [initialBrandParam, allowedBrands]);

  const filteredProductSource = useMemo(() => {
    return products.filter(product => allowedBrands.includes(product.brand));
  }, [allowedBrands]);

  const uniqueBrands = useMemo(() => {
    // Define the exact order you want the brands to appear
    return [
      "Ford Parts", 
      "Isuzu Parts", 
      "Toyota Parts", 
      "Mazda Parts", 
      "Mitsubishi Parts", 
      "Nissan Parts", 
      "Honda Parts", 
      "Suzuki Parts", 
      "Aftermarket"
    ];
  }, []);

  const [selectedBrand, setSelectedBrand] = useState<string | null>(initialBrand);
  const [loading, setLoading] = useState(true);
  

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
      // When showing all brands, sort by the specific brand order you want
      const brandOrder = [
        "Ford Parts",
        "Isuzu Parts", 
        "Toyota Parts",
        "Mazda Parts",
        "Mitsubishi Parts",
        "Nissan Parts",
        "Honda Parts",
        "Suzuki Parts",
        "Aftermarket"
      ];
      
      return filteredProductSource.sort((a, b) => {
        const aIndex = brandOrder.indexOf(a.brand);
        const bIndex = brandOrder.indexOf(b.brand);
        
        // If both brands are in the order list, sort by their position
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        
        // If only one brand is in the order list, prioritize it
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        
        // If neither brand is in the order list, sort alphabetically
        return a.brand.localeCompare(b.brand);
      });
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
    "Aftermarket": "data:image/svg+xml;charset=UTF-8,%3csvg width='150' height='150' viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='150' height='150' fill='%23ccc'/%3e%3ctext x='50%25' y='50%25' font-family='Arial' font-size='40' fill='%23333' text-anchor='middle' dominant-baseline='middle'%3eAM%3c/text%3e%3c/svg%3e", // Placeholder for Aftermarket
  };

  const handleBrandClick = (brand: string | null) => {
    if (brand) {
      // Use the full brand name in the URL for professional appearance
      router.push(`/genuine-parts?brand=${encodeURIComponent(brand)}`);
    } else {
      router.push(`/genuine-parts`);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8 mt-16 md:mt-0">{viewParam === 'aftermarket' ? "Aftermarket Accessories" : "Genuine Parts and Accessories"}</h1>

      {/* Brand Selection Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-8 py-4">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg p-2 mb-2" />
              <Skeleton className="w-16 sm:w-20 md:w-24 h-4" />
            </div>
          ))
        ) : (
          <>
            {/* All Brands Button */}
            <div className="flex flex-col items-center">
              <Button
                variant={selectedBrand === null ? 'default' : 'outline'}
                onClick={() => handleBrandClick(null)}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg p-2 mb-2"
              >
                <span className="text-sm font-medium">All</span>
              </Button>
              <span className="text-sm text-center font-medium">All Brands</span>
            </div>

            {/* Brand Buttons */}
            {uniqueBrands.map(brand => (
              <div key={brand} className="flex flex-col items-center">
                <Button
                  variant={selectedBrand === brand ? 'default' : 'outline'}
                  onClick={() => handleBrandClick(brand)}
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg p-2 mb-2 hover:scale-105 transition-transform"
                >
                  {brandLogos[brand] ? (
                    <Image
                      src={brandLogos[brand]}
                      alt={`${brand} Logo`}
                      width={152}
                      height={152}
                      className="object-contain max-w-full max-h-full"
                    />
                  ) : (
                    <span className="text-xs font-bold text-center">
                      {brand.replace(' Parts', '').substring(0, 4)}
                    </span>
                  )}
                </Button>
                <span className="text-sm text-center font-medium">
                  {brand.replace(' Parts', '')}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      <ProductList products={filteredProducts} showContainer={false} selectedBrand={selectedBrand} allowedBrands={allowedBrands} />
    </div>
  );
}