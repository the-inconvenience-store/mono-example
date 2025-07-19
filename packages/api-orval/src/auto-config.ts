/**
 * Auto-initialization utility for the API configuration
 * 
 * This module provides utilities to ensure API configuration is properly
 * loaded across server and client environments in Next.js applications.
 */

/**
 * Global flag to track if configuration has been initialized
 * This is shared across all instances of the API client
 */
declare global {
    var __API_CONFIG_INITIALIZED__: boolean | undefined;
}

/**
 * Check if the API configuration has been initialized
 */
export const isApiConfigInitialized = (): boolean => {
    return typeof globalThis !== 'undefined' && globalThis.__API_CONFIG_INITIALIZED__ === true;
};

/**
 * Mark the API configuration as initialized
 */
export const markApiConfigInitialized = (): void => {
    if (typeof globalThis !== 'undefined') {
        globalThis.__API_CONFIG_INITIALIZED__ = true;
    }
};

/**
 * Reset the initialization flag (useful for testing)
 */
export const resetApiConfigInitialization = (): void => {
    if (typeof globalThis !== 'undefined') {
        globalThis.__API_CONFIG_INITIALIZED__ = false;
    }
};

/**
 * Warning function to alert developers if configuration is not initialized
 * This helps with debugging when the API config is not properly set up
 */
export const warnIfNotInitialized = (): void => {
    if (!isApiConfigInitialized()) {
        console.warn(
            'API configuration not initialized. Make sure to call setApiConfig() or import your api.config file before using API hooks.'
        );
    }
};
