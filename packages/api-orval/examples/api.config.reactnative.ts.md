```tsx
import { ApiConfig } from '@mono/api-orval';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Example API configuration for React Native applications
 * 
 * This configuration demonstrates how to set up the API client for a React Native app
 * with proper device-specific handling and secure storage.
 */
export const reactNativeApiConfig: ApiConfig = {
    /**
     * Configure the base URL for React Native
     * Note: Use 10.0.2.2 for Android emulator, localhost for iOS simulator
     */
    getUrl: (contextUrl: string): string => {
        const isDev = __DEV__;

        let baseUrl: string;

        if (isDev) {
            // Development URLs for different platforms
            baseUrl = 'http://localhost:5074'; // iOS simulator
            // For Android emulator, you might need: 'http://10.0.2.2:5074'
        } else {
            baseUrl = 'https://api.myapp.com'; // Production URL
        }

        // Handle both absolute and relative URLs
        if (contextUrl.startsWith('http')) {
            return contextUrl;
        }

        return `${ baseUrl }${ contextUrl } `;
    },

    /**
     * Add authentication headers using AsyncStorage
     */
    getHeaders: async (headers?: HeadersInit): Promise<HeadersInit> => {
        const authToken = await AsyncStorage.getItem('auth_token');

        const baseHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            'User-Agent': 'MyApp/1.0.0 (React Native)',
        };

        if (authToken) {
            (baseHeaders as Record<string, string>).Authorization = `Bearer ${ authToken } `;
        }

        return {
            ...baseHeaders,
            ...headers,
        };
    },

    /**
     * Enhanced body parsing optimized for React Native
     */
    getBody: async <T>(response: Response): Promise<T> => {
        const contentType = response.headers.get('content-type');

        // Handle JSON responses
        if (contentType && contentType.includes('application/json')) {
            try {
                return await response.json();
            } catch (error) {
                console.error('Failed to parse JSON response:', error);
                throw new Error(`Failed to parse JSON response: ${ error } `);
            }
        }

        // Handle binary data (images, files, etc.)
        if (contentType && (
            contentType.includes('image/') ||
            contentType.includes('application/octet-stream') ||
            contentType.includes('application/pdf')
        )) {
            return response.blob() as Promise<T>;
        }

        // Handle text responses
        return response.text() as Promise<T>;
    },

    /**
     * Custom fetch with React Native specific optimizations
     */
    fetch: async (url: string, options: RequestInit): Promise<Response> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout for mobile

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                // React Native specific options
                headers: {
                    ...options.headers,
                    'Cache-Control': 'no-cache', // Prevent caching issues on mobile
                },
            });

            // Handle HTTP errors
            if (!response.ok) {
                console.error(`HTTP error! status: ${ response.status }, url: ${ url } `);
                throw new Error(`HTTP error! status: ${ response.status } `);
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
 * Initialize the API configuration for React Native
 * Call this in your app's initialization (e.g., in App.tsx or index.js)
 */
export const initializeReactNativeApi = () => {
    const { setApiConfig } = require('@mono/api-orval');
    setApiConfig(reactNativeApiConfig);
};
```