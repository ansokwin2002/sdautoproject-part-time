import { API_BASE_URL } from '@/utilities/constants';
import { useState, useEffect, useCallback } from 'react';
import { Slider } from '@/types/slider';

interface UseSlidersOptions {
  autoFetch?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseSlidersState {
  sliders: Slider[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export function useSliders(options: UseSlidersOptions = {}): UseSlidersState {
  const {
    autoFetch = true,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchSliders = useCallback(async (attempt = 1): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${API_BASE_URL}/sliders`;
      const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || res.statusText);
      }
      const responseData = await res.json();
      const data = responseData.data;
      
      // Sort by ordering field, then by id as fallback
      const sortedSliders = data.sort((a, b) => {
        if (a.ordering !== b.ordering) {
          return a.ordering - b.ordering;
        }
        return a.id - b.id;
      });
      
            setSliders(sortedSliders);
          } catch (err: any) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'An unknown error occurred';
      console.error('Failed to fetch sliders:', err);

      // Retry logic
      if (attempt < retryAttempts) {
        console.log(`Retrying slider fetch (attempt ${attempt + 1}/${retryAttempts})...`);
        setTimeout(() => {
          fetchSliders(attempt + 1);
        }, retryDelay * attempt);
        return;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchSliders();
  }, [fetchSliders]);

  useEffect(() => {
    if (autoFetch) {
      fetchSliders();
    }
  }, [autoFetch, fetchSliders]);

  return {
    sliders,
    loading,
    error,
    refetch,
    clearError,
  };
}

// Hook for getting a specific slider by ID
export function useSliderById(id: number | null, autoFetch = true) {
  const [slider, setSlider] = useState<Slider | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchSlider = useCallback(async (): Promise<void> => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${API_BASE_URL}/sliders/${id}`;
      const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || res.statusText);
      }
      const responseData = await res.json();
      const data = responseData.data;
      setSlider(data);
        } catch (err: any) {
          const errorMessage = err instanceof Error
              ? err.message
              : 'An unknown error occurred';
      console.error('Failed to fetch slider:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchSlider();
  }, [fetchSlider]);

  useEffect(() => {
    if (autoFetch && id) {
      fetchSlider();
    }
  }, [autoFetch, id, fetchSlider]);

  return {
    slider,
    loading,
    error,
    refetch,
    clearError,
  };
}
