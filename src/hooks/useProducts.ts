import { API_BASE_URL } from '@/utilities/constants';
import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/products'; // Using the existing Product type
import { products as staticProducts } from '@/lib/products'; // Import static data

interface UseProductsOptions {
  autoFetch?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

// Transformation function to ensure API data matches the static data structure
const transformApiProduct = (apiProduct: any): Product => {
  return {
    id: String(apiProduct.id), // Convert id to string to match static data
    name: apiProduct.name,
    description: apiProduct.description || '',
    price: `$${Number(apiProduct.price).toFixed(2)}`, // Format price as string
    originalPrice: apiProduct.original_price ? Number(apiProduct.original_price) : undefined,
    images: apiProduct.images || [],
    videos: apiProduct.videos || [],
    brand: apiProduct.brand ? apiProduct.brand.brand_name : 'Unknown Brand', // Extract brand name
    code: apiProduct.part_number || '', // Use part_number for code
    tag: apiProduct.category || 'Uncategorized', // Use category for tag
    partNumber: apiProduct.part_number || '',
    condition: apiProduct.condition || 'New',
    quantity: apiProduct.quantity || 0,
  };
};


export function useProducts(options: UseProductsOptions = {}): UseProductsState {
  const {
    autoFetch = true,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProducts = useCallback(async (attempt = 1): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${API_BASE_URL}/products`;
      const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || res.statusText);
      }
      const responseData = await res.json();
      
      if (responseData.data && responseData.data.length > 0) {
        const transformedProducts = responseData.data.map(transformApiProduct);
        setProducts(transformedProducts);
      } else {
        // Fallback to static data if API returns 0 records
        console.log('API returned insufficient data, falling back to static products.');
        setProducts(staticProducts);
      }
    } catch (err: any) {
        const errorMessage = err instanceof Error
            ? err.message
            : 'An unknown error occurred';
      console.error('Failed to fetch products, falling back to static data:', err);
      setError(errorMessage);
      setProducts(staticProducts); // Fallback on error
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [autoFetch, fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch,
    clearError,
  };
}

// Hook for getting a specific product by ID
export function useProductById(id: string | null, autoFetch = true) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProduct = useCallback(async (): Promise<void> => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${API_BASE_URL}/products/${id}`;
      const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || res.statusText);
      }
      const responseData = await res.json();
      if (responseData.data) {
        const transformedProduct = transformApiProduct(responseData.data);
        setProduct(transformedProduct);
      } else {
        throw new Error('Product not found in API');
      }
    } catch (err: any) {
        const errorMessage = err instanceof Error
            ? err.message
            : 'An unknown error occurred';
      console.error(`Failed to fetch product ${id} from API, falling back to static data:`, err);
      setError(errorMessage);
      const staticProduct = staticProducts.find(p => p.id === id);
      if (staticProduct) {
        setProduct(staticProduct);
      } else {
        setError(`Product with ID ${id} not found.`);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (autoFetch && id) {
      fetchProduct();
    }
  }, [autoFetch, id, fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch,
    clearError,
  };
}
