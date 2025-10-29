import { HomeSettings, HomeSettingsResponse, SingleHomeSettingResponse } from '@/types/settings';
import { Slider, SliderResponse, SingleSliderResponse } from '@/types/slider';
import { Shipping, ShippingResponse, SingleShippingResponse } from '@/types/shipping';
import { Policy, PolicyResponse, SinglePolicyResponse } from '@/types/policy';
import { Faq, FaqResponse, SingleFaqResponse } from '@/types/faq';

// Get API base URL from environment variable or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;

        // Handle specific error cases
        if (response.status === 401) {
          errorMessage = 'API authentication required. Using fallback data.';
        } else if (response.status === 404) {
          errorMessage = 'API endpoint not found. Using fallback data.';
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Using fallback data.';
        }
      } catch {
        // If parsing fails, use the original error message
        if (response.status === 401) {
          errorMessage = 'API authentication required. Using fallback data.';
        }
      }

      throw new ApiError(errorMessage, response.status, errorText);
    }

    try {
      return await response.json();
    } catch (error) {
      throw new ApiError('Invalid JSON response', response.status);
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle network errors
      throw new ApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0
      );
    }
  }

  // Home Settings API methods
  async getHomeSettings(): Promise<HomeSettings[]> {
    const response = await this.request<HomeSettingsResponse>('/public/settings');

    if (!response.success) {
      throw new ApiError(response.message || 'Failed to fetch home settings');
    }

    return response.data || [];
  }

  async getHomeSettingById(id: number): Promise<HomeSettings> {
    const response = await this.request<SingleHomeSettingResponse>(`/public/settings/${id}`);

    if (!response.success) {
      throw new ApiError(response.message || 'Failed to fetch home setting');
    }

    if (!response.data) {
      throw new ApiError('No data received');
    }

    return response.data;
  }

  async createHomeSetting(data: Partial<HomeSettings>): Promise<HomeSettings> {
    const response = await this.request<SingleHomeSettingResponse>('/home-settings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response.success) {
      throw new ApiError(response.message || 'Failed to create home setting');
    }
    
    if (!response.data) {
      throw new ApiError('No data received');
    }
    
    return response.data;
  }

  async updateHomeSetting(id: number, data: Partial<HomeSettings>): Promise<HomeSettings> {
    const response = await this.request<SingleHomeSettingResponse>(`/home-settings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    if (!response.success) {
      throw new ApiError(response.message || 'Failed to update home setting');
    }
    
    if (!response.data) {
      throw new ApiError('No data received');
    }
    
    return response.data;
  }

  // Slider API methods
  async getSliders(): Promise<Slider[]> {
    const response = await this.request<SliderResponse>('/public/sliders');

    if (!response.success) {
      throw new ApiError(response.message || 'Failed to fetch sliders');
    }

    return response.data || [];
  }

  async getSliderById(id: number): Promise<Slider> {
    const response = await this.request<SingleSliderResponse>(`/public/sliders/${id}`);

    if (!response.success) {
      throw new ApiError(response.message || 'Failed to fetch slider');
    }

    if (!response.data) {
      throw new ApiError('No data received');
    }

    return response.data;
  }

  // Shipping API methods
  async getShipping(): Promise<Shipping[]> {
    const response = await this.request<ShippingResponse>('/public/shipping');

    if (!response.success) {
      throw new ApiError(response.message || 'Failed to fetch shipping data');
    }

    return response.data || [];
  }

  async getShippingById(id: number): Promise<Shipping> {
    const response = await this.request<SingleShippingResponse>(`/public/shipping/${id}`);

    if (!response.success) {
      throw new ApiError(response.message || 'Failed to fetch shipping data');
    }

    if (!response.data) {
      throw new ApiError('No data received');
    }

    return response.data;
  }

  // Policy API methods
  async getPolicies(): Promise<Policy[]> {
    const response = await this.request<PolicyResponse>('/public/policies');

    if (!response.success) {
      throw new ApiError(response.message || 'Failed to fetch policy data');
    }

    return response.data || [];
  }

  async getPolicyById(id: number): Promise<Policy> {
    const response = await this.request<SinglePolicyResponse>(`/public/policies/${id}`);

    if (!response.success) {
      throw new ApiError(response.message || 'Failed to fetch policy data');
    }

    if (!response.data) {
      throw new ApiError('No data received');
    }

    return response.data;
  }

  // FAQ API methods
  async getFaqs(): Promise<Faq[]> {
    const response = await this.request<FaqResponse>('/public/faqs');

    if (!response.success) {
      throw new ApiError(response.message || 'Failed to fetch FAQ data');
    }

    return response.data || [];
  }

  async getFaqById(id: number): Promise<Faq> {
    const response = await this.request<SingleFaqResponse>(`/public/faqs/${id}`);

    if (!response.success) {
      throw new ApiError(response.message || 'Failed to fetch FAQ data');
    }

    if (!response.data) {
      throw new ApiError('No data received');
    }

    return response.data;
  }
}

// Export a singleton instance
export const apiService = new ApiService();

// Export the class for testing or custom instances
export { ApiService, ApiError };
