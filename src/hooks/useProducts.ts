import { API_BASE_URL } from '@/utilities/constants';
import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/products'; // Using the existing Product type
import { products as staticProducts } from '@/lib/products'; // Import static data
import { get, set } from '@/lib/cache';

const CACHE_KEY = 'products';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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
    brand: apiProduct.brand || 'Unknown Brand',
    code: apiProduct.part_number || '', // Use part_number for code
    tag: apiProduct.category || apiProduct.brand || 'Uncategorized', // Use category for tag, fallback to brand
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

  const fetchProducts = useCallback(async (): Promise<void> => {
    const cachedData = get<Product[]>(CACHE_KEY);
    if (cachedData) {
      setProducts(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
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
          set(CACHE_KEY, transformedProducts, CACHE_TTL);
          setProducts(transformedProducts);
        } else {
          console.log('API returned insufficient data, falling back to static products.');
          setProducts(staticProducts);
        }
        
        setLoading(false);
        return; // Exit the function on success
        
      } catch (err: any) {
        if (attempt === retryAttempts) {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
          console.error('Failed to fetch products, falling back to static data:', err);
          setError(errorMessage);
          setProducts(staticProducts); // Fallback on final error
          setLoading(false);
        } else {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }
  }, [retryAttempts, retryDelay]);

  const refetch = useCallback(async (): Promise<void> => {
    set(CACHE_KEY, null, 0); // Invalidate cache
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
export function useProductById(id: string | null, options: UseProductsOptions = {}) {
  const {
    autoFetch = true,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProduct = useCallback(async (): Promise<void> => {
    if (!id) return;

    const cacheKey = `${CACHE_KEY}-${id}`;
    const cachedData = get<Product>(cacheKey);
    if (cachedData) {
      setProduct(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
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
          set(cacheKey, transformedProduct, CACHE_TTL);
          setProduct(transformedProduct);
        } else {
          throw new Error('Product not found in API');
        }
        
        setLoading(false);
        return; // Exit on success

      } catch (err: any) {
        if (attempt === retryAttempts) {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
          console.error(`Failed to fetch product ${id} from API, falling back to static data:`, err);
          setError(errorMessage);
          const staticProduct = staticProducts.find(p => p.id === id);
          if (staticProduct) {
            setProduct(staticProduct);
          } else {
            setError(`Product with ID ${id} not found.`);
          }
          setLoading(false);
        } else {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }
  }, [id, retryAttempts, retryDelay]);

  const refetch = useCallback(async (): Promise<void> => {
    if (id) {
        set(`${CACHE_KEY}-${id}`, null, 0); // Invalidate cache
    }
    await fetchProduct();
  }, [fetchProduct, id]);

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
