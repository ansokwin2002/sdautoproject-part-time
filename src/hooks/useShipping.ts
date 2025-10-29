import { useState, useEffect, useCallback } from 'react';
import { apiService, ApiError } from '@/services/api';
import { Shipping } from '@/types/shipping';

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
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.getShipping();
      setShipping(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
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
  }, [retryAttempts, retryDelay]);

  const refetch = useCallback(async (): Promise<void> => {
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

    setLoading(true);
    setError(null);

    try {
      const data = await apiService.getShippingById(id);
      setShipping(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'An unknown error occurred';

      console.error('Failed to fetch shipping data:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchShipping();
  }, [fetchShipping]);

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
