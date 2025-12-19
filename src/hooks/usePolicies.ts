import { API_BASE_URL } from '@/utilities/constants';
import { useState, useEffect, useCallback } from 'react';
import { Policy } from '@/types/policy';

interface UsePoliciesOptions {
  autoFetch?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UsePoliciesState {
  policies: Policy[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export function usePolicies(options: UsePoliciesOptions = {}): UsePoliciesState {
  const {
    autoFetch = true,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchPolicies = useCallback(async (attempt = 1): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${API_BASE_URL}/policies`;
      const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || res.statusText);
      }
      const responseData = await res.json();
      const data = responseData.data;
    } catch (err: any) {
      const errorMessage = err instanceof Error
          ? err.message
          : 'An unknown error occurred';

      console.error('Failed to fetch policy data:', err);

      // Retry logic
      if (attempt < retryAttempts) {
        console.log(`Retrying policy fetch (attempt ${attempt + 1}/${retryAttempts})...`);
        setTimeout(() => {
          fetchPolicies(attempt + 1);
        }, retryDelay * attempt);
        return;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [retryAttempts, retryDelay]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchPolicies();
  }, [fetchPolicies]);

  useEffect(() => {
    if (autoFetch) {
      fetchPolicies();
    }
  }, [autoFetch, fetchPolicies]);

  return {
    policies,
    loading,
    error,
    refetch,
    clearError,
  };
}

// Hook for getting a specific policy by ID
export function usePolicyById(id: number | null, autoFetch = true) {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchPolicy = useCallback(async (): Promise<void> => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${API_BASE_URL}/policies/${id}`;
      const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || res.statusText);
      }
      const responseData = await res.json();
      const data = responseData.data;
      setPolicy(data);
        } catch (err: any) {
          const errorMessage = err instanceof Error
              ? err.message
              : 'An unknown error occurred';
      console.error('Failed to fetch policy data:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchPolicy();
  }, [fetchPolicy]);

  useEffect(() => {
    if (autoFetch && id) {
      fetchPolicy();
    }
  }, [autoFetch, id, fetchPolicy]);

  return {
    policy,
    loading,
    error,
    refetch,
    clearError,
  };
}
