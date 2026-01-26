import { API_BASE_URL } from '@/utilities/constants';
import { useState, useEffect, useCallback } from 'react';
import { Slider } from '@/types/slider';
import { get, set } from '@/lib/cache';

const CACHE_KEY = 'sliders';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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
    const cachedData = get<Slider[]>(CACHE_KEY);
    if (cachedData) {
      setSliders(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
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
        const sortedSliders = data.sort((a: Slider, b: Slider) => {
          if (a.ordering !== b.ordering) {
            return a.ordering - b.ordering;
          }
          return a.id - b.id;
        });
        
        set(CACHE_KEY, sortedSliders, CACHE_TTL);
        setSliders(sortedSliders);
        setLoading(false);
        return; // Exit on success

      } catch (err: any) {
        if (attempt === retryAttempts) {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
          console.error('Failed to fetch sliders:', err);
          setError(errorMessage);
          setLoading(false);
        } else {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }
  }, [retryAttempts, retryDelay]);

  const refetch = useCallback(async (): Promise<void> => {
    set(CACHE_KEY, null, 0); // Invalidate cache
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
export function useSliderById(id: number | null, options: UseSlidersOptions = {}) {
  const {
    autoFetch = true,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [slider, setSlider] = useState<Slider | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchSlider = useCallback(async (): Promise<void> => {
    if (!id) return;

    const cacheKey = `${CACHE_KEY}-${id}`;
    const cachedData = get<Slider>(cacheKey);
    if (cachedData) {
      setSlider(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const apiUrl = `${API_BASE_URL}/sliders/${id}`;
        const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || res.statusText);
        }
        
        const responseData = await res.json();
        const data = responseData.data;
        set(cacheKey, data, CACHE_TTL);
        setSlider(data);
        setLoading(false);
        return; // Exit on success

      } catch (err: any) {
        if (attempt === retryAttempts) {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
          console.error('Failed to fetch slider:', err);
          setError(errorMessage);
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
    await fetchSlider();
  }, [fetchSlider, id]);

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
