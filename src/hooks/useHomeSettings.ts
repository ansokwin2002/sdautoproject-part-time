import { API_BASE_URL } from '@/utilities/constants';
import { useState, useEffect, useCallback } from 'react';
import { HomeSettings } from '@/types/settings';

interface UseHomeSettingsState {
  settings: HomeSettings | null;
  allSettings: HomeSettings[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

interface UseHomeSettingsOptions {
  // If true, fetches all settings. If false or undefined, fetches the first setting
  fetchAll?: boolean;
  // Auto-fetch on mount
  autoFetch?: boolean;
  // Retry attempts on failure
  retryAttempts?: number;
  // Retry delay in milliseconds
  retryDelay?: number;
}

export function useHomeSettings(options: UseHomeSettingsOptions = {}): UseHomeSettingsState {
  const {
    fetchAll = false,
    autoFetch = true,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [settings, setSettings] = useState<HomeSettings | null>(null);
  const [allSettings, setAllSettings] = useState<HomeSettings[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchSettings = useCallback(async (attempt = 1): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${API_BASE_URL}/settings`;
      const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || res.statusText);
      }
      const responseData = await res.json();
      const data = responseData.data;
      
      setAllSettings(data);
      
      // If not fetching all, set the first setting as the primary setting
      if (!fetchAll && data.length > 0) {
        setSettings(data[0]);
      } else if (fetchAll) {
        setSettings(data[0] || null);
      }
      
    } catch (err: any) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'An unknown error occurred';

      console.error('Failed to fetch home settings:', err);

      // Don't retry on client errors (4xx) based on error message
      const isClientError = errorMessage.startsWith('HTTP 4');

      // Retry logic for network errors and server errors only
      if (attempt < retryAttempts && !isClientError) {
        console.log(`Retrying fetch attempt ${attempt + 1}/${retryAttempts} in ${retryDelay}ms...`);
        setTimeout(() => {
          fetchSettings(attempt + 1);
        }, retryDelay);
        return;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchAll, retryAttempts, retryDelay]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (autoFetch) {
      fetchSettings();
    }
  }, [autoFetch, fetchSettings]);

  return {
    settings,
    allSettings,
    loading,
    error,
    refetch,
    clearError,
  };
}

// Hook for getting a specific setting by ID
export function useHomeSettingById(id: number | null, autoFetch = true) {
  const [setting, setSetting] = useState<HomeSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchSetting = useCallback(async (): Promise<void> => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${API_BASE_URL}/settings/${id}`;
      const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || res.statusText);
      }
      const responseData = await res.json();
      const data = responseData.data;
      setSetting(data);
        } catch (err: any) {
          const errorMessage = err instanceof Error
              ? err.message
              : 'An unknown error occurred';
      console.error('Failed to fetch home setting:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchSetting();
  }, [fetchSetting]);

  useEffect(() => {
    if (autoFetch && id) {
      fetchSetting();
    }
  }, [autoFetch, id, fetchSetting]);

  return {
    setting,
    loading,
    error,
    refetch,
    clearError,
  };
}
