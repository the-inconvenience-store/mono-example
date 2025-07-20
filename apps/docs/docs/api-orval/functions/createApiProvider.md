# Function: createApiProvider()

> **createApiProvider**(`config`): (`__namedParameters`) => `Element`

Defined in: [packages/api-orval/src/provider.tsx:249](https://github.com/the-inconvenience-store/mono-example/blob/a3e1f4667d455f254c4a536af743fc2dff215781/packages/api-orval/src/provider.tsx#L249)

Utility function to create a properly configured provider for your app
This is especially useful for Next.js apps where you want to configure
the API based on environment variables

## Parameters

### config

[`ApiConfig`](../interfaces/ApiConfig.md)

## Returns

> (`__namedParameters`): `Element`

### Parameters

#### \_\_namedParameters

##### children

`ReactNode`

### Returns

`Element`

## Example

```tsx
// utils/api-provider.tsx
import { createApiProvider } from '@mono/api-orval';

export const AppApiProvider = createApiProvider({
  getUrl: (contextUrl) => `${process.env.NEXT_PUBLIC_API_URL}${contextUrl}`,
  getHeaders: (headers) => ({
    ...headers,
    'Content-Type': 'application/json',
  }),
});

// app/layout.tsx
import { AppApiProvider } from '@/utils/api-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppApiProvider>
          {children}
        </AppApiProvider>
      </body>
    </html>
  );
}
```
