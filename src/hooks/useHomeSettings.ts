import { API_BASE_URL } from '@/utilities/constants';
import { useState, useEffect, useCallback } from 'react';
import { HomeSettings } from '@/types/settings';
import { get, set } from '@/lib/cache';

const CACHE_KEY = 'home-settings';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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
    const cachedData = get<HomeSettings[]>(CACHE_KEY);
    if (cachedData) {
      setAllSettings(cachedData);
      if (!fetchAll && cachedData.length > 0) {
        setSettings(cachedData[0]);
      } else if (fetchAll) {
        setSettings(cachedData[0] || null);
      }
      return;
    }

    setLoading(true);
    setError(null);

    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const apiUrl = `${API_BASE_URL}/settings`;
        const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || res.statusText);
        }
        const responseData = await res.json();
        const data = responseData.data;
        
        set(CACHE_KEY, data, CACHE_TTL);
        setAllSettings(data);
        
        // If not fetching all, set the first setting as the primary setting
        if (!fetchAll && data.length > 0) {
          setSettings(data[0]);
        } else if (fetchAll) {
          setSettings(data[0] || null);
        }
        setLoading(false);
        return; // Exit on success

      } catch (err: any) {
        if (attempt === retryAttempts) {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
          console.error('Failed to fetch home settings:', err);
          setError(errorMessage);
          setLoading(false);
        } else {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }
  }, [fetchAll, retryAttempts, retryDelay]);

  const refetch = useCallback(async (): Promise<void> => {
    set(CACHE_KEY, null, 0); // Invalidate cache
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
export function useHomeSettingById(id: number | null, options: UseHomeSettingsOptions = {}) {
  const {
    autoFetch = true,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [setting, setSetting] = useState<HomeSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchSetting = useCallback(async (): Promise<void> => {
    if (!id) return;

    const cacheKey = `${CACHE_KEY}-${id}`;
    const cachedData = get<HomeSettings>(cacheKey);
    if (cachedData) {
      setSetting(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const apiUrl = `${API_BASE_URL}/settings/${id}`;
        const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || res.statusText);
        }
        
        const responseData = await res.json();
        const data = responseData.data;
        set(cacheKey, data, CACHE_TTL);
        setSetting(data);
        setLoading(false);
        return; // Exit on success

      } catch (err: any) {
        if (attempt === retryAttempts) {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
          console.error('Failed to fetch home setting:', err);
          setError(errorMessage);
          setLoading(false);
        } else {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }
  }, [id, retryAttempts, retryDelay]);

  const refetch = useCallback(async (): Promise<void> => {
    if(id) {
        set(`${CACHE_KEY}-${id}`, null, 0); // Invalidate cache
    }
    await fetchSetting();
  }, [fetchSetting, id]);

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
