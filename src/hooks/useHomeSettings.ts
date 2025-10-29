import { useState, useEffect, useCallback } from 'react';
import { HomeSettings } from '@/types/settings';
import { apiService, ApiError } from '@/services/api';

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
      const data = await apiService.getHomeSettings();
      
      setAllSettings(data);
      
      // If not fetching all, set the first setting as the primary setting
      if (!fetchAll && data.length > 0) {
        setSettings(data[0]);
      } else if (fetchAll) {
        setSettings(data[0] || null);
      }
      
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'An unknown error occurred';

      console.error('Failed to fetch home settings:', err);

      // Don't retry on authentication errors (401) or client errors (4xx)
      const shouldRetry = !(err instanceof ApiError && err.status && err.status >= 400 && err.status < 500);

      // Retry logic for network errors and server errors only
      if (attempt < retryAttempts && shouldRetry) {
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
      const data = await apiService.getHomeSettingById(id);
      setSetting(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
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
