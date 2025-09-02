'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { products } from "@/lib/products";
import ProductCard from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 8;

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
      className={`transition-all duration-800 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function ProductList({ products: initialProducts, showContainer = true }: { products?: import("@/lib/products").Product[], showContainer?: boolean }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const productSource = initialProducts || products;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = productSource.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [sortBy, order] = sortOrder.split('-');

    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return order === 'asc' ? -1 : 1;
        if (nameA > nameB) return order === 'asc' ? 1 : -1;
        return 0;
      } else if (sortBy === 'price') {
        return order === 'asc' ? a.price - b.price : b.price - a.price;
      }
      return 0;
    });

    return filtered;
  }, [searchTerm, sortOrder, productSource]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
          <div className="w-full md:w-auto">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
          {loading
            ? Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <AnimatedCard key={index} delay={(index + 1) * 100}>
                  <ProductCard loading />
                </AnimatedCard>
              ))
            : paginatedProducts.map((product, index) => (
                <AnimatedCard key={product.id} delay={(index + 1) * 100}>
                  <ProductCard product={product} />
                </AnimatedCard>
              ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
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
            >
              Previous
            </Button>
            {totalPages > 0 && (
              <div className="flex items-center space-x-1">
                {/* Generate page numbers */}
                {(() => {
                  const pageNumbers = [];
                  const maxPagesToShow = 5; // Max number of page buttons to show (excluding ellipses)
                  const ellipsis = "...";

                  if (totalPages <= maxPagesToShow) {
                    // Show all pages if total pages are few
                    for (let i = 1; i <= totalPages; i++) {
                      pageNumbers.push(i);
                    }
                  } else {
                    // Always show first page
                    pageNumbers.push(1);

                    // Determine start and end for middle pages
                    let startPage = Math.max(2, currentPage - Math.floor((maxPagesToShow - 3) / 2));
                    let endPage = Math.min(totalPages - 1, currentPage + Math.ceil((maxPagesToShow - 3) / 2));

                    if (currentPage <= Math.floor(maxPagesToShow / 2) + 1) {
                      endPage = maxPagesToShow - 1;
                    } else if (currentPage >= totalPages - Math.floor(maxPagesToShow / 2)) {
                      startPage = totalPages - maxPagesToShow + 2;
                    }

                    // Add first ellipsis if needed
                    if (startPage > 2) {
                      pageNumbers.push(ellipsis);
                    }

                    // Add middle pages
                    for (let i = startPage; i <= endPage; i++) {
                      pageNumbers.push(i);
                    }

                    // Add second ellipsis if needed
                    if (endPage < totalPages - 1) {
                      pageNumbers.push(ellipsis);
                    }

                    // Always show last page (if not already included)
                    if (!pageNumbers.includes(totalPages)) {
                      pageNumbers.push(totalPages);
                    }
                  }

                  return pageNumbers.map((page, index) => (
                    page === ellipsis ? (
                      <span key={index} className="text-sm text-gray-600 px-2">{ellipsis}</span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page as number)}
                      >
                        {page}
                      </Button>
                    )
                  ));
                })()}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}