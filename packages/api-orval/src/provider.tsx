'use client'
import * as React from 'react';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { setApiConfig, getApiConfig, resetApiConfig } from './config';
import type { ApiConfig } from './config';

/**
 * Context for API configuration state
 */
interface ApiConfigContextType {
    isInitialized: boolean;
    error: string | null;
    initialize: (config: ApiConfig) => void;
    reset: () => void;
}

/**
 * API Configuration Context
 */
const ApiConfigContext = createContext<ApiConfigContextType | undefined>(undefined);

/**
 * Props for the ApiConfigProvider
 */
export interface ApiConfigProviderProps {
    children: ReactNode;
    /**
     * Optional configuration to apply immediately
     */
    config?: ApiConfig;
    /**
     * Whether to suppress initialization warnings
     */
    suppressWarnings?: boolean;
}

/**
 * API Configuration Provider
 * 
 * This provider ensures that API configuration is properly initialized
 * across server and client environments in Next.js, React, and React Native.
 * 
 * @example
 * ```tsx
 * // Next.js App Router (app/layout.tsx)
 * import { ApiConfigProvider } from '@mono/api-orval';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ApiConfigProvider config={{
 *           getUrl: (contextUrl) => `${process.env.NEXT_PUBLIC_API_URL}${contextUrl}`,
 *           getHeaders: (headers) => ({ ...headers, 'Content-Type': 'application/json' }),
 *         }}>
 *           {children}
 *         </ApiConfigProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // React Native (App.tsx)
 * import { ApiConfigProvider } from '@mono/api-orval';
 * 
 * export default function App() {
 *   return (
 *     <ApiConfigProvider config={{
 *       getUrl: (contextUrl) => `${__DEV__ ? 'http://localhost:5074' : 'https://api.myapp.com'}${contextUrl}`,
 *       getHeaders: async (headers) => {
 *         const token = await AsyncStorage.getItem('auth_token');
 *         return { ...headers, ...(token && { Authorization: `Bearer ${token}` }) };
 *       },
 *     }}>
 *       <YourApp />
 *     </ApiConfigProvider>
 *   );
 * }
 * ```
 */
export function ApiConfigProvider({
    children,
    config,
    suppressWarnings = false
}: ApiConfigProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initialize = (newConfig: ApiConfig) => {
        try {
            setApiConfig(newConfig);
            setIsInitialized(true);
            setError(null);

            if (!suppressWarnings) {
                console.log('API configuration initialized successfully');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to initialize API configuration';
            setError(errorMessage);

            if (!suppressWarnings) {
                console.error('Failed to initialize API configuration:', err);
            }
        }
    };

    const reset = () => {
        try {
            resetApiConfig();
            setIsInitialized(false);
            setError(null);

            if (!suppressWarnings) {
                console.log('API configuration reset to defaults');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to reset API configuration';
            setError(errorMessage);

            if (!suppressWarnings) {
                console.error('Failed to reset API configuration:', err);
            }
        }
    };

    // Initialize configuration on mount if provided
    useEffect(() => {
        if (config && !isInitialized) {
            initialize(config);
        }
    }, [config, isInitialized]);

    // Provide context value
    const contextValue: ApiConfigContextType = {
        isInitialized,
        error,
        initialize,
        reset,
    };

    return (
        <ApiConfigContext.Provider value={contextValue}>
            {children}
        </ApiConfigContext.Provider>
    );
}

/**
 * Hook to access API configuration context
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isInitialized, error, initialize } = useApiConfig();
 *   
 *   if (!isInitialized) {
 *     return <div>Loading API configuration...</div>;
 *   }
 *   
 *   if (error) {
 *     return <div>Error: {error}</div>;
 *   }
 *   
 *   return <div>API is ready!</div>;
 * }
 * ```
 */
export function useApiConfig(): ApiConfigContextType {
    const context = useContext(ApiConfigContext);

    if (context === undefined) {
        throw new Error('useApiConfig must be used within an ApiConfigProvider');
    }

    return context;
}

/**
 * Hook to check if API configuration is initialized
 * This is useful for conditional rendering or warnings
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isReady = useApiConfigReady();
 *   
 *   if (!isReady) {
 *     console.warn('API configuration not ready yet');
 *   }
 *   
 *   return <div>Component content</div>;
 * }
 * ```
 */
export function useApiConfigReady(): boolean {
    try {
        const { isInitialized } = useApiConfig();
        return isInitialized;
    } catch {
        // If not within provider, check global config
        try {
            getApiConfig();
            return true;
        } catch {
            return false;
        }
    }
}


/**
 * Utility function to create a properly configured provider for your app
 * This is especially useful for Next.js apps where you want to configure
 * the API based on environment variables
 * 
 * @example
 * ```tsx
 * // utils/api-provider.tsx
 * import { createApiProvider } from '@mono/api-orval';
 * 
 * export const AppApiProvider = createApiProvider({
 *   getUrl: (contextUrl) => `${process.env.NEXT_PUBLIC_API_URL}${contextUrl}`,
 *   getHeaders: (headers) => ({
 *     ...headers,
 *     'Content-Type': 'application/json',
 *   }),
 * });
 * 
 * // app/layout.tsx
 * import { AppApiProvider } from '@/utils/api-provider';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AppApiProvider>
 *           {children}
 *         </AppApiProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function createApiProvider(config: ApiConfig) {
    return function CreatedApiProvider({ children }: { children: ReactNode }) {
        return (
            <ApiConfigProvider config={config}>
                {children}
            </ApiConfigProvider>
        );
    };
}
