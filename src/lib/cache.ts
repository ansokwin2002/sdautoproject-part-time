// src/lib/cache.ts

const CACHE_PREFIX = 'sdauto-cache-';

interface CacheItem<T> {
  value: T;
  expiry: number;
}

/**
 * Stores a value in localStorage with a Time-To-Live (TTL).
 * @param key The cache key.
 * @param value The value to store.
 * @param ttl The TTL in milliseconds.
 */
export function set<T>(key: string, value: T, ttl: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const item: CacheItem<T> = {
      value,
      expiry: new Date().getTime() + ttl,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  } catch (error) {
    console.error(`Error setting cache for key "${key}":`, error);
  }
}

/**
 * Retrieves a value from localStorage.
 * Returns null if the item doesn't exist or has expired.
 * @param key The cache key.
 */
export function get<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const serializedItem = localStorage.getItem(CACHE_PREFIX + key);
    if (!serializedItem) {
      return null;
    }

    const item: CacheItem<T> = JSON.parse(serializedItem);
    if (new Date().getTime() > item.expiry) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return item.value;
  } catch (error) {
    console.error(`Error getting cache for key "${key}":`, error);
    return null;
  }
}
