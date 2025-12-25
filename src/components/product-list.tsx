'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import ProductCard from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 24;

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsIntersecting(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasAnimated, options]);

  return [ref, isIntersecting];
};

const AnimatedCard = ({ children, className = "", delay = 0 }) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-300 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-4 scale-98'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function ProductList({ products, showContainer = true, selectedBrand: propSelectedBrand, allowedBrands: propAllowedBrands, isLoading = false }: { products: import("@/lib/products").Product[], showContainer?: boolean, selectedBrand?: string | null, allowedBrands?: string[], isLoading?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [selectedBrand, setSelectedBrand] = useState<string>(propSelectedBrand || 'all');
  const [currentPage, setCurrentPage] = useState(1);

  // Update internal selectedBrand when propSelectedBrand changes
  useEffect(() => {
    setSelectedBrand(propSelectedBrand || 'all');
  }, [propSelectedBrand]);

    const uniqueBrands = useMemo(() => {
    // Define the complete brand order including brands without products
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
    
    // Get brands that actually have products
    const brandsWithProducts = Array.from(new Set(products.map((p) => p.brand))).filter(brand => propAllowedBrands ? propAllowedBrands.includes(brand) : true);
    
    // If propAllowedBrands is provided, use the complete brand order (including brands without products)
    // Otherwise, only show brands that have products
    if (propAllowedBrands) {
      return brandOrder.filter(brand => propAllowedBrands.includes(brand));
    }
    
    // For regular product list (not genuine-parts page), only show brands with products
    return brandsWithProducts.sort((a, b) => {
      const aIndex = brandOrder.indexOf(a);
      const bIndex = brandOrder.indexOf(b);
      
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      return (a ?? '').localeCompare(b ?? '');
    });
  }, [products, propAllowedBrands]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product =>
      (selectedBrand === 'all' || product.brand.toLowerCase() === selectedBrand.toLowerCase()) &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (product.partNumber && product.partNumber.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    if (sortOrder !== 'default') {
      const [sortBy, order] = sortOrder.split('-');

      filtered.sort((a, b) => {
        if (sortBy === 'name') {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA < nameB) return order === 'asc' ? -1 : 1;
          if (nameA > nameB) return order === 'asc' ? 1 : -1;
          return 0;
        } else if (sortBy === 'price') {
          const priceA = parseFloat(a.price.replace(/[^\d.-]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^\d.-]/g, ''));
          return order === 'asc' ? priceA - priceB : priceB - priceA;
        }
        return 0;
      });
    } else if (selectedBrand === 'all') {
      // When showing all brands with default sorting, sort by brand order
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
      
      filtered.sort((a, b) => {
        const aIndex = brandOrder.indexOf(a.brand);
        const bIndex = brandOrder.indexOf(b.brand);
        
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        
        return (a.brand ?? '').localeCompare(b.brand ?? '');
      });
    }

    return filtered;
  }, [searchTerm, sortOrder, selectedBrand, products]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle brand selection change and update URL
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    
    if (pathname === '/genuine-parts' && propAllowedBrands) {
      if (brand === 'all') {
        router.push('/genuine-parts');
      } else {
        router.push(`/genuine-parts?brand=${encodeURIComponent(brand)}`);
      }
    }
  };

  // Reset currentPage and searchTerm when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm('');
  }, [selectedBrand, sortOrder]);

  return (
    <section className={showContainer ? "py-16 md:py-20 bg-gray-50" : ""}>
      <div className={showContainer ? "container mx-auto" : ""}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="w-full md:w-1/3">
            <Input
              placeholder={`Search from ${products.length} products...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Order</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={handleBrandChange} value={selectedBrand}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {uniqueBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <AnimatedCard key={`skeleton-${index}`} delay={index * 30}>
                  <ProductCard loading />
                </AnimatedCard>
              ))
            : paginatedProducts.map((product, index) => (
                <AnimatedCard key={product.id} delay={index * 30}>
                  <ProductCard product={product} />
                </AnimatedCard>
              ))}
        </div>

        {!isLoading && paginatedProducts.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No products found</h2>
            <p className="text-gray-600">Try adjusting your filters or search term.</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4 px-6">
          <div>
            <p className="text-sm text-gray-600">
              Showing {paginatedProducts.length} of {filteredAndSortedProducts.length} products
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-xs px-2 py-0.5"
            >
              Previous
            </Button>
            {totalPages > 0 && (
              <div className="flex items-center space-x-1">
                {(() => {
                  const pageNumbers = [];
                  const maxPagesToShow = 5;
                  
                  if (totalPages <= maxPagesToShow) {
                    for (let i = 1; i <= totalPages; i++) {
                      pageNumbers.push(i);
                    }
                  } else {
                    pageNumbers.push(1);
                    let startPage = Math.max(2, currentPage - 1);
                    let endPage = Math.min(totalPages - 1, currentPage + 1);

                    if (currentPage <= 3) {
                        endPage = 3;
                    } else if (currentPage >= totalPages - 2) {
                        startPage = totalPages - 3;
                    }

                    if (startPage > 2) {
                      pageNumbers.push('ellipsis-start'); // Use a distinct identifier
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pageNumbers.push(i);
                    }

                    if (endPage < totalPages - 1) {
                      pageNumbers.push('ellipsis-end'); // Use a distinct identifier
                    }
                    
                    if (totalPages > 1) { // Only push totalPages if there's more than one page
                        pageNumbers.push(totalPages);
                    }
                  }
                  return pageNumbers.map((page, index) => {
                    if (page === 'ellipsis-start') {
                      return <span key="ellipsis-start-unique" className="text-xs text-gray-600 px-2">...</span>;
                    }
                    if (page === 'ellipsis-end') {
                        return <span key="ellipsis-end-unique" className="text-xs text-gray-600 px-2">...</span>;
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page as number)}
                        className="text-xs px-2 py-0.5"
                      >
                        {page}
                      </Button>
                    );
                  });
                })()}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="text-xs px-2 py-0.5"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}