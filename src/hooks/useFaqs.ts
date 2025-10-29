import { useState, useEffect, useCallback } from 'react';
import { apiService, ApiError } from '@/services/api';
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

    try {
      const data = await apiService.getFaqs();
      setFaqs(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'An unknown error occurred';

      console.error('Failed to fetch FAQ data:', err);

      // Retry logic
      if (attempt < retryAttempts) {
        console.log(`Retrying FAQ fetch (attempt ${attempt + 1}/${retryAttempts})...`);
        setTimeout(() => {
          fetchFaqs(attempt + 1);
        }, retryDelay * attempt);
        return;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
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
export function useFaqById(id: number | null, autoFetch = true) {
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

    try {
      const data = await apiService.getFaqById(id);
      setFaq(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'An unknown error occurred';

      console.error('Failed to fetch FAQ data:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

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
