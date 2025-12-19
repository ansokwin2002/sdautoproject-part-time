import { API_BASE_URL } from '@/utilities/constants';
import { useState, useEffect, useCallback } from 'react';

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
    setLoading(true);
    setError(null);

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
      setPartners(normalized);
    } catch (e: any) {
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
      if (attempt < retryAttempts) {
        setTimeout(() => fetchPartners(attempt + 1), retryDelay * attempt);
        return;
      }
      setError(e?.message || 'Failed to load delivery partners');
    } finally {
      setLoading(false);
    }
  }, [deliveryUrl, assetBase, retryAttempts, retryDelay]);

  const refetch = useCallback(async () => {
    await fetchPartners();
  }, [fetchPartners]);

  useEffect(() => {
    if (autoFetch) fetchPartners();
  }, [autoFetch, fetchPartners]);

  return { partners, loading, error, refetch, clearError };
}
