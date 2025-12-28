'use client';

import { useState, useMemo, useEffect, useCallback } from 'react'; // Added useCallback
import { useProducts } from '@/hooks/useProducts';
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
  const viewParam = searchParams.get('view'); // Keep viewParam

  const initialBrandParam = searchParams.get('brand');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(initialBrandParam);

  // Keep selectedBrand in sync with the URL
  useEffect(() => {
    setSelectedBrand(initialBrandParam);
  }, [initialBrandParam]);

  const { products: allProducts, loading, error } = useProducts();

  const filteredProductSource = useMemo(() => {
    return allProducts;
  }, [allProducts]);

  const uniqueBrands = useMemo(() => {
    return [
      "Ford",
      "Isuzu",
      "Toyota",
      "Mazda",
      "Mitsubishi",
      "Nissan",
      "Honda",
      "Suzuki",
      "Aftermarket"
    ];
  }, []);

  const brandLogos = {
    "Ford": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/1200px-Ford_logo_flat.svg.png",
    "Isuzu": "https://1000logos.net/wp-content/uploads/2021/04/Isuzu-logo-500x281.png",
    "Toyota": "https://logos-world.net/wp-content/uploads/2020/04/Toyota-Logo.png",
    "Mazda": "https://logos-world.net/wp-content/uploads/2021/03/Mazda-Logo.png",
    "Mitsubishi": "https://logos-world.net/wp-content/uploads/2021/03/Mitsubishi-Logo.png",
    "Nissan": "https://logos-world.net/wp-content/uploads/2021/03/Nissan-Logo.png",
    "Honda": "https://logos-world.net/wp-content/uploads/2021/03/Honda-Logo.png",
    "Suzuki": "https://logos-world.net/wp-content/uploads/2021/03/Suzuki-Logo.png",
    "Aftermarket": "data:image/svg+xml;charset=UTF-8,%3csvg width='150' height='150' viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='150' height='150' fill='%23ccc'/%3e%3ctext x='50%25' y='50%25' font-family='Arial' font-size='40' fill='%23333' text-anchor='middle' dominant-baseline='middle'%3eAM%3c/text%3e%3c/svg%3e", // Placeholder for Aftermarket
  };

  const filteredProducts = useMemo(() => {
    if (!selectedBrand) {
      // When showing all brands, sort by the specific brand order you want
      const brandOrder = [
        "Ford",
        "Isuzu", 
        "Toyota",
        "Mazda",
        "Mitsubishi",
        "Nissan",
        "Honda",
        "Suzuki",
        "Aftermarket"
      ];
      
      return [...filteredProductSource].sort((a, b) => {
        const aIndex = brandOrder.findIndex(name => a.brand.includes(name));
        const bIndex = brandOrder.findIndex(name => b.brand.includes(name));
        
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
    
    // selectedBrand is already the keyword
    return filteredProductSource.filter(product => product.brand.includes(selectedBrand));
  }, [selectedBrand, filteredProductSource]);

  const handleBrandClick = (brand: string | null) => {
    if (brand) {
      router.push(`/genuine-parts?brand=${encodeURIComponent(brand)}`);
    } else {
      router.push(`/genuine-parts`);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8 mt-16 md:mt-0">{viewParam === 'aftermarket' ? "Aftermarket Accessories" : "Genuine Parts and Accessories"}</h1>

      {/* Brand Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8 py-4">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <Skeleton className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-lg p-2 mb-2" />
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
                className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-lg p-2 mb-2"
              >
                <span className="text-2xl md:text-3xl lg:text-4xl font-bold">All</span>
              </Button>
              <span className="text-sm text-center font-medium">All Brands</span>
            </div>

            {/* Brand Buttons */}
            {uniqueBrands.map(brand => (
              <div key={brand} className="flex flex-col items-center">
                <Button
                  variant={selectedBrand === brand ? 'default' : 'outline'}
                  onClick={() => handleBrandClick(brand)}
                  className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-lg p-2 mb-2 hover:scale-105 transition-transform"
                >
                  {brandLogos[brand] ? (
                    <Image
                      src={brandLogos[brand]}
                      alt={`${brand} Logo`}
                      width={200}
                      height={200}
                      className="object-contain w-full h-full p-1"
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

      <ProductList products={filteredProducts} showContainer={false} selectedBrand={selectedBrand} isLoading={loading} />
    </div>
  );
}