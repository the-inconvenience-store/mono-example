# Function: ApiConfigProvider()

> **ApiConfigProvider**(`__namedParameters`): `Element`

Defined in: [packages/api-orval/src/provider.tsx:84](https://github.com/the-inconvenience-store/mono-example/blob/77ed7dd80da67d5d4a2bd8320e638952ed491201/packages/api-orval/src/provider.tsx#L84)

API Configuration Provider

This provider ensures that API configuration is properly initialized
across server and client environments in Next.js, React, and React Native.

## Parameters

### \_\_namedParameters

[`ApiConfigProviderProps`](../interfaces/ApiConfigProviderProps.md)

## Returns

`Element`

## Examples

```tsx
// Next.js App Router (app/layout.tsx)
import { ApiConfigProvider } from '@mono/api-orval';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ApiConfigProvider config={{
          getUrl: (contextUrl) => `${process.env.NEXT_PUBLIC_API_URL}${contextUrl}`,
          getHeaders: (headers) => ({ ...headers, 'Content-Type': 'application/json' }),
        }}>
          {children}
        </ApiConfigProvider>
      </body>
    </html>
  );
}
```

```tsx
// React Native (App.tsx)
import { ApiConfigProvider } from '@mono/api-orval';

export default function App() {
  return (
    <ApiConfigProvider config={{
      getUrl: (contextUrl) => `${__DEV__ ? 'http://localhost:5074' : 'https://api.myapp.com'}${contextUrl}`,
      getHeaders: async (headers) => {
        const token = await AsyncStorage.getItem('auth_token');
        return { ...headers, ...(token && { Authorization: `Bearer ${token}` }) };
      },
    }}>
      <YourApp />
    </ApiConfigProvider>
  );
}
```
