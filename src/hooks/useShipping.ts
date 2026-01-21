import { API_BASE_URL } from '@/utilities/constants';
import { useState, useEffect, useCallback } from 'react';
import { Shipping } from '@/types/shipping';
import { get, set } from '@/lib/cache';

const CACHE_KEY = 'shipping';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface UseShippingOptions {
  autoFetch?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseShippingState {
  shipping: Shipping[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export function useShipping(options: UseShippingOptions = {}): UseShippingState {
  const {
    autoFetch = true,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [shipping, setShipping] = useState<Shipping[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchShipping = useCallback(async (attempt = 1): Promise<void> => {
    const cachedData = get<Shipping[]>(CACHE_KEY);
    if (cachedData) {
        setShipping(cachedData);
        return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${API_BASE_URL}/shipping`;
      const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || res.statusText);
      }
      const responseData = await res.json();
      const data = responseData.data;
      set(CACHE_KEY, data, CACHE_TTL);
      setShipping(data);
    } catch (err: any) {
      const errorMessage = err instanceof Error
          ? err.message
          : 'An unknown error occurred';

      console.error('Failed to fetch shipping data:', err);

      // Retry logic
      if (attempt < retryAttempts) {
        console.log(`Retrying shipping fetch (attempt ${attempt + 1}/${retryAttempts})...`);
        setTimeout(() => {
          fetchShipping(attempt + 1);
        }, retryDelay * attempt);
        return;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    set(CACHE_KEY, null, 0); // Invalidate cache
    await fetchShipping();
  }, [fetchShipping]);

  useEffect(() => {
    if (autoFetch) {
      fetchShipping();
    }
  }, [autoFetch, fetchShipping]);

  return {
    shipping,
    loading,
    error,
    refetch,
    clearError,
  };
}

// Hook for getting a specific shipping by ID
export function useShippingById(id: number | null, autoFetch = true) {
  const [shipping, setShipping] = useState<Shipping | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchShipping = useCallback(async (): Promise<void> => {
    if (!id) return;

    const cacheKey = `${CACHE_KEY}-${id}`;
    const cachedData = get<Shipping>(cacheKey);
    if (cachedData) {
        setShipping(cachedData);
        return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${API_BASE_URL}/shipping/${id}`;
      const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || res.statusText);
      }
      const responseData = await res.json();
      const data = responseData.data;
      set(cacheKey, data, CACHE_TTL);
      setShipping(data);
    } catch (err: any) {
      const errorMessage = err instanceof Error
          ? err.message
          : 'An unknown error occurred';

      console.error('Failed to fetch shipping data:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const refetch = useCallback(async (): Promise<void> => {
    if (id) {
        set(`${CACHE_KEY}-${id}`, null, 0); // Invalidate cache
    }
    await fetchShipping();
  }, [fetchShipping, id]);

  useEffect(() => {
    if (autoFetch && id) {
      fetchShipping();
    }
  }, [autoFetch, id, fetchShipping]);

  return {
    shipping,
    loading,
    error,
    refetch,
    clearError,
  };
}
