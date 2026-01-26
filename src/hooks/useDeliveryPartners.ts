import { API_BASE_URL } from '@/utilities/constants';
import { useState, useEffect, useCallback } from 'react';
import { get, set } from '@/lib/cache';

const CACHE_KEY = 'delivery-partners';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export interface DeliveryPartner {
  id?: number;
  title: string;
  description: string;
  image: string; // relative or absolute url
  url_link: string;
}

interface UseDeliveryPartnersOptions {
  autoFetch?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  // Optional: override API URL
  apiUrl?: string;
}

interface UseDeliveryPartnersState {
  partners: DeliveryPartner[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export function useDeliveryPartners(options: UseDeliveryPartnersOptions = {}): UseDeliveryPartnersState {
  const {
    autoFetch = true,
    retryAttempts = 3,
    retryDelay = 1000,
    apiUrl,
  } = options;

  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const deliveryUrl = apiUrl || `${API_BASE_URL}/delivery-partners`;
  // For assets, strip trailing /api/public if present to point to root server
  const assetBase = API_BASE_URL.replace(/\/api\/public$/, '');

  const fetchPartners = useCallback(async (attempt = 1): Promise<void> => {
    const cachedData = get<DeliveryPartner[]>(CACHE_KEY);
    if (cachedData) {
        setPartners(cachedData);
        return;
    }
    
    setLoading(true);
    setError(null);

    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const res = await fetch(deliveryUrl, { headers: { Accept: 'application/json' } });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
        }
        const data = await res.json();
        // Normalize expected shape (array of items with title, description, image, url_link)
        const list: DeliveryPartner[] = Array.isArray(data) ? data : (data?.data ?? []);
        // Normalize images to absolute URLs using assetBase
        const normalized = list.map((item) => ({
          ...item,
          image: item.image?.startsWith('http') ? item.image : `${assetBase}${item.image}`,
        }));
        set(CACHE_KEY, normalized, CACHE_TTL);
        setPartners(normalized);
        setLoading(false);
        return; // Exit on success

      } catch (e: any) {
        if (attempt === retryAttempts) {
          console.error('Failed to fetch delivery partners:', e);
          console.error('Delivery partners fetch error details (message):', e instanceof Error ? e.message : e);
          // Attempt to log more details if available in the error object
          if (e.status) {
            console.error('Delivery partners fetch HTTP status:', e.status);
          }
          if (e.response) {
            // If it's a network error, e.response might not exist or be a readable stream
            e.response.text().then((text: string) => {
              console.error('Delivery partners fetch raw response:', text);
            }).catch(() => {}); // Catch potential errors if response.text() fails
          }
          setError(e?.message || 'Failed to load delivery partners');
          setLoading(false);
        } else {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }
  }, [deliveryUrl, assetBase, retryAttempts, retryDelay]);

  const refetch = useCallback(async () => {
    set(CACHE_KEY, null, 0); // Invalidate cache
    await fetchPartners();
  }, [fetchPartners]);

  useEffect(() => {
    if (autoFetch) fetchPartners();
  }, [autoFetch, fetchPartners]);

  return { partners, loading, error, refetch, clearError };
}
