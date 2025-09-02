'use client';

import { useState, useMemo, useEffect } from 'react';
import { products } from '@/lib/products';
import ProductList from '@/components/product-list';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export default function GenuinePartsPage() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get('brand');

  const uniqueBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach(product => brands.add(product.brand));
    const brandsToRemove = ["Mitsubishi Parts", "Nissan Parts", "Porsche Parts", "Ram Parts", "Subaru Parts", "GMC Parts", "Isuzu Parts"];
    return Array.from(brands).filter(brand => !brandsToRemove.includes(brand)).sort();
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
      return products;
    }
    return products.filter(product => product.brand === selectedBrand);
  }, [selectedBrand]);

  const brandLogos = {
    "Mitsubishi Parts": "https://logos-world.net/wp-content/uploads/2021/03/Mitsubishi-Logo.png",
    "Toyota Parts": "https://logos-world.net/wp-content/uploads/2020/04/Toyota-Logo.png",
    "Ford Parts": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/1200px-Ford_logo_flat.svg.png",
    "Honda Parts": "https://logos-world.net/wp-content/uploads/2021/03/Honda-Logo.png",
    "Mazda Parts": "https://logos-world.net/wp-content/uploads/2021/03/Mazda-Logo.png",
    "Nissan Parts": "https://logos-world.net/wp-content/uploads/2021/03/Nissan-Logo.png",
    "Subaru Parts": "https://logos-world.net/wp-content/uploads/2021/03/Subaru-Logo.png",
    "Volkswagen Parts": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/1200px-Volkswagen_logo_2019.svg.png",
    "Audi Parts": "https://logos-world.net/wp-content/uploads/2021/03/Audi-Logo.png",
    "BMW Parts": "https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png",
    "Chevrolet Parts": "https://logos-world.net/wp-content/uploads/2021/03/Chevrolet-Logo.png",
    "Jeep Parts": "https://logos-world.net/wp-content/uploads/2021/03/Jeep-Logo.png",
    "Kia Parts": "https://logos-world.net/wp-content/uploads/2021/03/Kia-Logo.png",
    "Lexus Parts": "https://logos-world.net/wp-content/uploads/2021/03/Lexus-Logo.png",
    "Porsche Parts": "https://logos-world.net/wp-content/uploads/2021/03/Porsche-Logo.png",
    "Ram Parts": "https://logos-world.net/wp-content/uploads/2021/03/Ram-Logo.png",
    "GMC Parts": "https://1000logos.net/wp-content/uploads/2018/02/GMC-Logo.png",
    "Isuzu Parts": "https://1000logos.net/wp-content/uploads/2018/02/Isuzu-Logo.png",
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Genuine Parts</h1>

      {/* Brand Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 mb-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <Skeleton className="w-20 h-20 rounded-full mb-2" />
              <Skeleton className="w-24 h-4" />
            </div>
          ))
        ) : (
          <>
            {/* All Brands Button */}
            <div className="flex flex-col items-center">
              <Button
                variant={selectedBrand === null ? 'default' : 'outline'}
                onClick={() => setSelectedBrand(null)}
                className="w-20 h-20 rounded-full p-2 mb-2"
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
                  onClick={() => setSelectedBrand(brand)}
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
                  {brand.replace(' Parts', '')}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      <ProductList products={filteredProducts} showContainer={false} />
    </div>
  );
}