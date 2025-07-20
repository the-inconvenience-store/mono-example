# TypeScript API Client

This guide explains how to configure the `@mono/api-orval` package for your specific needs across different platforms and environments.

## Overview

The API client is fully configurable, allowing you to customize:
- **URL transformation**: Modify base URLs, add path prefixes, etc.
- **Header management**: Add authentication, content types, custom headers
- **Response parsing**: Handle different content types and error scenarios
- **Fetch behavior**: Add timeouts, retry logic, custom error handling

## Quick Start

### Basic Configuration

```typescript
import { setApiConfig } from '@mono/api-orval';

// Set your configuration once at app startup
setApiConfig({
  getUrl: (contextUrl) => `https://api.myapp.com${contextUrl}`,
  getHeaders: (headers) => ({
    ...headers,
    'Authorization': 'Bearer ' + getAuthToken(),
  }),
});
```

### Using the Hooks

```typescript
import { useGetAllBlogPosts } from '@mono/api-orval';

function BlogList() {
  const { data, isLoading, error } = useGetAllBlogPosts();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.data.map(post => (
        <div key={post.slug}>{post.metadata.title}</div>
      ))}
    </div>
  );
}
```

## Configuration Options

### `getUrl(contextUrl: string): string`

Transform the URL before making requests.

```typescript
// Example: Environment-based URLs
getUrl: (contextUrl) => {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://api.myapp.com'
    : 'http://localhost:5074';
  return `${baseUrl}${contextUrl}`;
}

// Example: API versioning
getUrl: (contextUrl) => {
  const baseUrl = 'https://api.myapp.com';
  return `${baseUrl}/v1${contextUrl}`;
}

// Example: Path prefixes
getUrl: (contextUrl) => {
  const baseUrl = 'https://api.myapp.com';
  return `${baseUrl}/api${contextUrl}`;
}
```

### `getHeaders(headers?: HeadersInit): HeadersInit`

Transform headers before making requests.

```typescript
// Example: JWT Authentication
getHeaders: (headers) => ({
  ...headers,
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json',
})

// Example: API Key Authentication
getHeaders: (headers) => ({
  ...headers,
  'X-API-Key': process.env.API_KEY,
  'Content-Type': 'application/json',
})

// Example: Custom headers
getHeaders: (headers) => ({
  ...headers,
  'X-Client-Version': '1.0.0',
  'X-Platform': 'web',
})
```

### `getBody<T>(response: Response): Promise<T>`

Parse response bodies based on content type.

```typescript
// Example: Enhanced error handling
getBody: async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    try {
      return await response.json();
    } catch (error) {
      throw new Error(`Invalid JSON response: ${error}`);
    }
  }
  
  if (contentType?.includes('text/')) {
    return response.text() as Promise<T>;
  }
  
  throw new Error(`Unsupported content type: ${contentType}`);
}
```

### `fetch(url: string, options: RequestInit): Promise<Response>`

Customize the fetch behavior.

```typescript
// Example: Timeout and retry logic
fetch: async (url, options) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

## Platform-Specific Examples

### Next.js Configuration

```typescript
// api.config.ts
import { setApiConfig } from '@mono/api-orval';

export const initializeApi = () => {
  setApiConfig({
    getUrl: (contextUrl) => {
      const baseUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_URL!
        : 'http://localhost:5074';
      return `${baseUrl}${contextUrl}`;
    },
    
    getHeaders: (headers) => {
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('auth_token')
        : process.env.API_TOKEN;
      
      return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      };
    },
  });
};

// In your app initialization (_app.tsx or layout.tsx)
import { initializeApi } from './api.config';

export default function App() {
  useEffect(() => {
    initializeApi();
  }, []);
  
  return <YourApp />;
}
```

### React Native Configuration

```typescript
// api.config.ts
import { setApiConfig } from '@mono/api-orval';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const initializeApi = () => {
  setApiConfig({
    getUrl: (contextUrl) => {
      const baseUrl = __DEV__ 
        ? 'http://localhost:5074'  // Use 10.0.2.2 for Android emulator
        : 'https://api.myapp.com';
      return `${baseUrl}${contextUrl}`;
    },
    
    getHeaders: async (headers) => {
      const token = await AsyncStorage.getItem('auth_token');
      
      return {
        'Content-Type': 'application/json',
        'User-Agent': 'MyApp/1.0.0 (React Native)',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      };
    },
  });
};

// In your app initialization (App.tsx)
import { initializeApi } from './api.config';

export default function App() {
  useEffect(() => {
    initializeApi();
  }, []);
  
  return <YourApp />;
}
```

## TypeScript Support

The configuration system is fully typed:

```typescript
import { ApiConfig, setApiConfig } from '@mono/api-orval';

const config: ApiConfig = {
  getUrl: (contextUrl: string): string => {
    // contextUrl is typed as string
    // Return must be string
    return `https://api.myapp.com${contextUrl}`;
  },
  
  getHeaders: (headers?: HeadersInit): HeadersInit => {
    // headers is typed as HeadersInit | undefined
    // Return must be HeadersInit
    return { ...headers, 'Custom-Header': 'value' };
  },
  
  getBody: async <T>(response: Response): Promise<T> => {
    // response is typed as Response
    // Return must be Promise<T>
    return response.json();
  },
  
  fetch: async (url: string, options: RequestInit): Promise<Response> => {
    // Standard fetch signature
    return fetch(url, options);
  },
};

setApiConfig(config);
```

## Error Handling

The configuration system provides multiple levels of error handling:

```typescript
setApiConfig({
  getBody: async <T>(response: Response): Promise<T> => {
    // Handle different error scenarios
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      try {
        return await response.json();
      } catch (error) {
        throw new Error(`Invalid JSON: ${error}`);
      }
    }
    
    throw new Error(`Unsupported content type: ${contentType}`);
  },
  
  fetch: async (url, options) => {
    try {
      const response = await fetch(url, options);
      
      // Custom error handling
      if (response.status === 401) {
        // Handle authentication errors
        throw new Error('Authentication required');
      }
      
      if (response.status >= 500) {
        // Handle server errors
        throw new Error('Server error - please try again later');
      }
      
      return response;
    } catch (error) {
      // Network errors, timeouts, etc.
      throw new Error(`Network error: ${error.message}`);
    }
  },
});
```

## Advanced Use Cases

### Multi-tenant Configuration

```typescript
let currentTenant: string | null = null;

setApiConfig({
  getUrl: (contextUrl) => {
    const baseUrl = 'https://api.myapp.com';
    const tenant = currentTenant || 'default';
    return `${baseUrl}/tenant/${tenant}${contextUrl}`;
  },
});

// Change tenant dynamically
export const setTenant = (tenant: string) => {
  currentTenant = tenant;
};
```

### Request Interceptors

```typescript
setApiConfig({
  fetch: async (url, options) => {
    // Log all requests
    console.log(`Making request to: ${url}`);
    
    // Add request ID for tracing
    const requestId = generateRequestId();
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'X-Request-ID': requestId,
      },
    });
    
    // Log response
    console.log(`Response ${response.status} for request ${requestId}`);
    
    return response;
  },
});
```

## Testing

You can easily mock the API configuration for testing:

```typescript
// test-utils.ts
import { setApiConfig, resetApiConfig } from '@mono/api-orval';

export const setupMockApi = () => {
  setApiConfig({
    fetch: async (url, options) => {
      // Return mock responses
      return new Response(JSON.stringify({ data: mockData }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    },
  });
};

export const teardownMockApi = () => {
  resetApiConfig();
};
```

## Best Practices

1. **Initialize Once**: Set up your configuration once at app startup
2. **Environment Variables**: Use environment variables for different deployment environments
3. **Error Handling**: Implement comprehensive error handling for better UX
4. **Timeouts**: Always set reasonable timeouts for network requests
5. **Logging**: Add logging for debugging and monitoring
6. **Type Safety**: Use TypeScript for better development experience
7. **Testing**: Mock the configuration for unit and integration tests

## Migration Guide

If you're migrating from the old API client, here's how to update:

### Before (Old API)
```typescript
import { blogPostsApi } from '@mono/api';

const posts = await blogPostsApi.getAllBlogPosts();
```

### After (New API with Configuration)
```typescript
import { setApiConfig, useGetAllBlogPosts } from '@mono/api-orval';

// Set up configuration once
setApiConfig({
  getUrl: (contextUrl) => `https://api.myapp.com${contextUrl}`,
  getHeaders: (headers) => ({
    ...headers,
    'Authorization': `Bearer ${getAuthToken()}`,
  }),
});

// Use in components
function BlogList() {
  const { data, isLoading, error } = useGetAllBlogPosts();
  // ... handle loading, error, and data
}
```

The new system provides much more flexibility while maintaining type safety and ease of use.
