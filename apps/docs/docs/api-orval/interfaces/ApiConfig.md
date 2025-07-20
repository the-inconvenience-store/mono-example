# Interface: ApiConfig

Defined in: [packages/api-orval/src/config.ts:9](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/src/config.ts#L9)

Configuration interface for the API client

This allows users to customize the behavior of the API client by providing
their own implementations of URL transformation, header manipulation, and response body parsing.

## Properties

### fetch()?

> `optional` **fetch**: (`url`, `options`) => `Promise`\<`Response`\>

Defined in: [packages/api-orval/src/config.ts:89](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/src/config.ts#L89)

Custom fetch implementation

#### Parameters

##### url

`string`

The URL to fetch

##### options

`RequestInit`

The fetch options

#### Returns

`Promise`\<`Response`\>

Promise resolving to the fetch Response

#### Example

```typescript
// For React Native with custom timeout
fetch: async (url: string, options: RequestInit) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
```

***

### getBody()?

> `optional` **getBody**: \<`T`\>(`response`) => `Promise`\<`T`\>

Defined in: [packages/api-orval/src/config.ts:62](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/src/config.ts#L62)

Parse the response body based on content type

#### Type Parameters

##### T

`T`

#### Parameters

##### response

`Response`

The fetch Response object

#### Returns

`Promise`\<`T`\>

Promise resolving to the parsed response body

#### Example

```typescript
getBody: async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  return response.text() as Promise<T>;
}
```

***

### getHeaders()?

> `optional` **getHeaders**: (`headers?`) => `HeadersInit`

Defined in: [packages/api-orval/src/config.ts:43](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/src/config.ts#L43)

Transform headers before making the request

#### Parameters

##### headers?

`HeadersInit`

The original headers from the request options

#### Returns

`HeadersInit`

The transformed headers to use for the request

#### Example

```typescript
getHeaders: (headers?: HeadersInit) => ({
  ...headers,
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json',
})
```

***

### getUrl()?

> `optional` **getUrl**: (`contextUrl`) => `string`

Defined in: [packages/api-orval/src/config.ts:26](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/src/config.ts#L26)

Transform the URL before making the request

#### Parameters

##### contextUrl

`string`

The original URL from the API call

#### Returns

`string`

The transformed URL to use for the request

#### Example

```typescript
getUrl: (contextUrl: string) => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://api.myapp.com' 
    : 'http://localhost:3000';
  return `${baseUrl}${contextUrl}`;
}
```
