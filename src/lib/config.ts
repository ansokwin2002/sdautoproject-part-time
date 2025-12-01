/**
 * Application configuration utilities
 * Centralizes environment variable access and URL construction
 */

/**
 * Get the API base URL from environment variables
 * @returns The API base URL (e.g., http://192.168.1.2:8000/api)
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
}

/**
 * Get the base URL for images and static assets from the API server
 * Removes the '/api' suffix from the API base URL
 * @returns The base URL for images (e.g., http://192.168.1.2:8000)
 */
export function getImageBaseUrl(): string {
  const apiUrl = getApiBaseUrl();
  // Remove '/api' suffix if present
  return apiUrl.replace(/\/api\/?$/, '');
}

/**
 * Construct a full image URL from a relative or absolute path
 * @param imagePath - The image path from the API (can be relative or absolute)
 * @returns Full image URL
 */
export function getImageUrl(imagePath: string): string {
  // If already an absolute URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const baseUrl = getImageBaseUrl();
  // Ensure path starts with /
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${baseUrl}${path}`;
}

/**
 * Configuration object for easy access
 */
export const config = {
  apiBaseUrl: getApiBaseUrl(),
  imageBaseUrl: getImageBaseUrl(),
  getImageUrl,
} as const;
