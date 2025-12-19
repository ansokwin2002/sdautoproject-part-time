import { API_BASE_URL } from '@/utilities/constants';
import { useState, useEffect, useCallback } from 'react';
import { Contact } from '@/types/contact';

interface UseContactsOptions {
  autoFetch?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseContactsState {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export function useContacts(options: UseContactsOptions = {}): UseContactsState {
  const { autoFetch = true, retryAttempts = 3, retryDelay = 1000 } = options;

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchContacts = useCallback(async (attempt = 1): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `${API_BASE_URL}/contacts`;
      const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || res.statusText);
      }
      const responseData = await res.json();
      const data = responseData.data;
      setContacts(data);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to fetch contacts:', err);
      if (attempt < retryAttempts) {
        setTimeout(() => fetchContacts(attempt + 1), retryDelay * attempt);
        return;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [retryAttempts, retryDelay]);

  const refetch = useCallback(async () => {
    await fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    if (autoFetch) fetchContacts();
  }, [autoFetch, fetchContacts]);

  return { contacts, loading, error, refetch, clearError };
}
