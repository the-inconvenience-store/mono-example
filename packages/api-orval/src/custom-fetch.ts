import { getApiConfig } from './config';

/**
 * Custom fetch implementation that uses the configured API settings
 * 
 * This function respects the user's configuration for URL transformation,
 * header manipulation, and response body parsing.
 * 
 * @param url - The URL to fetch
 * @param options - The fetch options
 * @returns Promise resolving to the response with status, data, and headers
 */
export const customFetch = async <T>(
    url: string,
    options: RequestInit,
): Promise<T> => {
    const config = getApiConfig();

    const requestUrl = config.getUrl(url);
    const requestHeaders = config.getHeaders(options.headers);

    const requestInit: RequestInit = {
        ...options,
        headers: requestHeaders,
    };

    const response = await config.fetch(requestUrl, requestInit);
    const data = await config.getBody<T>(response);
    return { status: response.status, data, headers: response.headers } as T;
};