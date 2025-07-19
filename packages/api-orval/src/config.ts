import { markApiConfigInitialized, warnIfNotInitialized } from './auto-config';

/**
 * Configuration interface for the API client
 * 
 * This allows users to customize the behavior of the API client by providing
 * their own implementations of URL transformation, header manipulation, and response body parsing.
 */
export interface ApiConfig {
    /**
     * Transform the URL before making the request
     * 
     * @param contextUrl - The original URL from the API call
     * @returns The transformed URL to use for the request
     * 
     * @example
     * ```typescript
     * getUrl: (contextUrl: string) => {
     *   const baseUrl = process.env.NODE_ENV === 'production' 
     *     ? 'https://api.myapp.com' 
     *     : 'http://localhost:3000';
     *   return `${baseUrl}${contextUrl}`;
     * }
     * ```
     */
    getUrl?: (contextUrl: string) => string;

    /**
     * Transform headers before making the request
     * 
     * @param headers - The original headers from the request options
     * @returns The transformed headers to use for the request
     * 
     * @example
     * ```typescript
     * getHeaders: (headers?: HeadersInit) => ({
     *   ...headers,
     *   'Authorization': `Bearer ${getAuthToken()}`,
     *   'Content-Type': 'application/json',
     * })
     * ```
     */
    getHeaders?: (headers?: HeadersInit) => HeadersInit;

    /**
     * Parse the response body based on content type
     * 
     * @param response - The fetch Response object
     * @returns Promise resolving to the parsed response body
     * 
     * @example
     * ```typescript
     * getBody: async <T>(response: Response): Promise<T> => {
     *   const contentType = response.headers.get('content-type');
     *   if (contentType?.includes('application/json')) {
     *     return response.json();
     *   }
     *   return response.text() as Promise<T>;
     * }
     * ```
     */
    getBody?: <T>(response: Response) => Promise<T>;

    /**
     * Custom fetch implementation
     * 
     * @param url - The URL to fetch
     * @param options - The fetch options
     * @returns Promise resolving to the fetch Response
     * 
     * @example
     * ```typescript
     * // For React Native with custom timeout
     * fetch: async (url: string, options: RequestInit) => {
     *   const controller = new AbortController();
     *   const timeoutId = setTimeout(() => controller.abort(), 10000);
     *   
     *   try {
     *     return await fetch(url, {
     *       ...options,
     *       signal: controller.signal
     *     });
     *   } finally {
     *     clearTimeout(timeoutId);
     *   }
     * }
     * ```
     */
    fetch?: (url: string, options: RequestInit) => Promise<Response>;
}

/**
 * Default configuration for the API client
 */
export const defaultConfig: Required<ApiConfig> = {
    getUrl: (contextUrl: string): string => {
        const url = new URL(contextUrl);
        const pathname = url.pathname;
        const search = url.search;
        // Default to development URL - users should override this in production
        const baseUrl = 'http://localhost:5074';

        const requestUrl = new URL(`${baseUrl}${pathname}${search}`);
        return requestUrl.toString();
    },

    getHeaders: (headers?: HeadersInit): HeadersInit => {
        return {
            ...headers,
            Authorization: 'token',
            'Content-Type': 'multipart/form-data',
        };
    },

    getBody: async <T>(response: Response): Promise<T> => {
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            return response.json();
        }

        if (contentType && contentType.includes('application/pdf')) {
            return response.blob() as Promise<T>;
        }

        return response.text() as Promise<T>;
    },

    fetch: (url: string, options: RequestInit) => fetch(url, options),
};

/**
 * Global configuration storage
 * Using a global variable to ensure the same configuration is used across
 * different module instances in Next.js (server/client/different bundles)
 */
declare global {
    var __API_CONFIG__: Required<ApiConfig> | undefined;
}

/**
 * Get the current configuration from global storage or default
 */
const getCurrentConfig = (): Required<ApiConfig> => {
    if (typeof globalThis !== 'undefined' && globalThis.__API_CONFIG__) {
        return globalThis.__API_CONFIG__;
    }
    return { ...defaultConfig };
};

/**
 * Set the configuration in global storage
 */
const setGlobalConfig = (config: Required<ApiConfig>): void => {
    if (typeof globalThis !== 'undefined') {
        globalThis.__API_CONFIG__ = config;
    }
};

/**
 * Set the API configuration
 * 
 * @param config - Partial configuration to override defaults
 * 
 * @example
 * ```typescript
 * // In your app's initialization
 * setApiConfig({
 *   getUrl: (contextUrl) => `https://api.myapp.com${contextUrl}`,
 *   getHeaders: (headers) => ({
 *     ...headers,
 *     'Authorization': `Bearer ${getAuthToken()}`,
 *   }),
 * });
 * ```
 */
export const setApiConfig = (config: ApiConfig): void => {
    const mergedConfig = {
        ...defaultConfig,
        ...config,
    };
    setGlobalConfig(mergedConfig);
    markApiConfigInitialized();
};

/**
 * Get the current API configuration
 * 
 * @returns The current configuration
 */
export const getApiConfig = (): Required<ApiConfig> => {
    warnIfNotInitialized();
    return getCurrentConfig();
};

/**
 * Reset the API configuration to defaults
 */
export const resetApiConfig = (): void => {
    setGlobalConfig({ ...defaultConfig });
};
