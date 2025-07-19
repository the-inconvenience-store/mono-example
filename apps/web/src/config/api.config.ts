import { setApiConfig } from '@mono/api-orval';
import { env } from '@/config/env/client'

/**
 * API configuration for the Next.js web application
 * 
 * This configuration works across both server and client environments
 * and is initialized once but works everywhere.
 */
export const webApiConfig = {
    getUrl: (contextUrl: string): string => {
        const baseUrl = env.NEXT_PUBLIC_API_URL || 'http://localhost:5074';
        return `${baseUrl}${contextUrl}`;
    },

    getHeaders: (headers?: HeadersInit): HeadersInit => {
        // For now, keep the existing headers structure
        // You can add authentication later when needed
        return {
            'Content-Type': 'application/json',
            // Remove the multipart/form-data as it's not needed for JSON APIs
            // 'Content-Type': 'multipart/form-data', // This was from the old config
            ...headers,
        };
    },

    getBody: async <T>(response: Response): Promise<T> => {
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            try {
                return await response.json();
            } catch (error) {
                console.error('Failed to parse JSON response:', error);
                throw new Error(`Failed to parse JSON response: ${error}`);
            }
        }

        if (contentType && contentType.includes('application/pdf')) {
            return response.blob() as Promise<T>;
        }

        return response.text() as Promise<T>;
    },

    fetch: async (url: string, options: RequestInit): Promise<Response> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}, url: ${url}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response;
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.error('Request timeout:', url);
                throw new Error('Request timeout');
            }
            console.error('Fetch error:', error);
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    },
};

/**
 * Flag to track if API configuration has been initialized
 */
let isApiConfigInitialized = false;

/**
 * Initialize the API configuration once
 * This function is safe to call multiple times - it will only initialize once
 */
export const initializeWebApiConfig = () => {
    if (isApiConfigInitialized) {
        return;
    }

    setApiConfig(webApiConfig);
    isApiConfigInitialized = true;
};


// Initialize immediately when this module is loaded
// This ensures the configuration is available on both server and client
initializeWebApiConfig();
