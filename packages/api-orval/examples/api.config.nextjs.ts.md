```tsx
import { ApiConfig } from '@mono/api-orval';

/**
 * Example API configuration for Next.js applications
 * 
 * This configuration demonstrates how to set up the API client for a Next.js app
 * with proper environment variable handling and authentication.
 */
export const nextJsApiConfig: ApiConfig = {
    /**
     * Configure the base URL based on environment
     */
    getUrl: (contextUrl: string): string => {
        const baseUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_URL || 'https://api.myapp.com'
            : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5074';

        // Handle both absolute and relative URLs
        if (contextUrl.startsWith('http')) {
            return contextUrl;
        }

        return `${baseUrl}${contextUrl}`;
    },

    /**
     * Add authentication headers and proper content type
     */
    getHeaders: (headers?: HeadersInit): HeadersInit => {
        const authToken = typeof window !== 'undefined'
            ? localStorage.getItem('auth_token')
            : process.env.API_TOKEN;

        const baseHeaders: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (authToken) {
            (baseHeaders as Record<string, string>).Authorization = `Bearer ${authToken}`;
        }

        return {
            ...baseHeaders,
            ...headers,
        };
    },

    /**
     * Enhanced body parsing with better error handling
     */
    getBody: async <T>(response: Response): Promise<T> => {
        const contentType = response.headers.get('content-type');

        // Handle JSON responses
        if (contentType && contentType.includes('application/json')) {
            try {
                return await response.json();
            } catch (error) {
                throw new Error(`Failed to parse JSON response: ${error}`);
            }
        }

        // Handle PDF responses
        if (contentType && contentType.includes('application/pdf')) {
            return response.blob() as Promise<T>;
        }

        // Handle text responses
        if (contentType && contentType.includes('text/')) {
            return response.text() as Promise<T>;
        }

        // Default to text for unknown content types
        return response.text() as Promise<T>;
    },

    /**
     * Custom fetch with timeout and error handling
     */
    fetch: async (url: string, options: RequestInit): Promise<Response> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });

            // Handle HTTP errors
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response;
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    },
};

/**
 * Initialize the API configuration for Next.js
 * Call this in your app's initialization (e.g., in _app.tsx or layout.tsx)
 */
export const initializeNextJsApi = () => {
    const { setApiConfig } = require('@mono/api-orval');
    setApiConfig(nextJsApiConfig);
};
```