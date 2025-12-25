'use client';

import ProductList from '@/components/product-list';
import { useProducts } from '@/hooks/useProducts';

export default function ProductsPage() {
  const { products, loading, error } = useProducts();

  if (error && products.length === 0) {
    return <div className="container mx-auto py-16 text-center">
      <h2 className="text-2xl font-bold text-red-600">Failed to load products</h2>
      <p className="text-gray-600">{error}</p>
    </div>;
  }

  // Pass the fetched products to the existing ProductList component.
  // The ProductList component will handle filtering, sorting, and pagination.
  // A loading skeleton is shown by ProductList internally.
  return <ProductList products={products} isLoading={loading} />;
}
