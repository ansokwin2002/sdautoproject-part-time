'use client';

import { useState, useMemo, useEffect } from 'react';
import { products } from '@/lib/products';
import ProductList from '@/components/product-list';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

export default function GenuinePartsPage() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get('brand');

  const uniqueBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach(product => brands.add(product.brand));
    return Array.from(brands).sort();
  }, []);

  const [selectedBrand, setSelectedBrand] = useState<string | null>(initialBrand);

  useEffect(() => {
    setSelectedBrand(initialBrand);
  }, [initialBrand]);

  const filteredProducts = useMemo(() => {
    if (!selectedBrand) {
      return products;
    }
    return products.filter(product => product.brand === selectedBrand);
  }, [selectedBrand]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Genuine Parts</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Button
          variant={selectedBrand === null ? 'default' : 'outline'}
          onClick={() => setSelectedBrand(null)}
        >
          All Brands
        </Button>
        {uniqueBrands.map(brand => (
          <Button
            key={brand}
            variant={selectedBrand === brand ? 'default' : 'outline'}
            onClick={() => setSelectedBrand(brand)}
          >
            {brand}
          </Button>
        ))}
      </div>

      <ProductList products={filteredProducts} showContainer={false} />
    </div>
  );
}
