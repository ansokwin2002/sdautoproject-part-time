import { API_BASE_URL } from '@/utilities/constants';
import { useState, useEffect, useCallback } from 'react';
import { Faq } from '@/types/faq';

interface UseFaqsOptions {
  autoFetch?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseFaqsState {
  faqs: Faq[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export function useFaqs(options: UseFaqsOptions = {}): UseFaqsState {
  const {
    autoFetch = true,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchFaqs = useCallback(async (attempt = 1): Promise<void> => {
    setLoading(true);
    setError(null);

    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const apiUrl = `${API_BASE_URL}/faqs`;
        const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || res.statusText);
        }
        const responseData = await res.json();
        const data = responseData.data;
        setFaqs(data);
        setLoading(false);
        return; // Exit on success

      } catch (err: any) {
        if (attempt === retryAttempts) {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
          console.error('Failed to fetch FAQ data:', err);
          setError(errorMessage);
          setLoading(false);
        } else {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }
  }, [retryAttempts, retryDelay]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchFaqs();
  }, [fetchFaqs]);

  useEffect(() => {
    if (autoFetch) {
      fetchFaqs();
    }
  }, [autoFetch, fetchFaqs]);

  return {
    faqs,
    loading,
    error,
    refetch,
    clearError,
  };
}

// Hook for getting a specific FAQ by ID
export function useFaqById(id: number | null, options: UseFaqsOptions = {}) {
  const {
    autoFetch = true,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [faq, setFaq] = useState<Faq | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchFaq = useCallback(async (): Promise<void> => {
    if (!id) return;

    setLoading(true);
    setError(null);

    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const apiUrl = `${API_BASE_URL}/faqs/${id}`;
        const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || res.statusText);
        }
        
        const responseData = await res.json();
        const data = responseData.data;
        setFaq(data);
        setLoading(false);
        return; // Exit on success

      } catch (err: any) {
        if (attempt === retryAttempts) {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
          console.error('Failed to fetch FAQ data:', err);
          setError(errorMessage);
          setLoading(false);
        } else {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }
  }, [id, retryAttempts, retryDelay]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchFaq();
  }, [fetchFaq]);

  useEffect(() => {
    if (autoFetch && id) {
      fetchFaq();
    }
  }, [autoFetch, id, fetchFaq]);

  return {
    faq,
    loading,
    error,
    refetch,
    clearError,
  };
}
