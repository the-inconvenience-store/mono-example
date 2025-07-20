# Function: setApiConfig()

> **setApiConfig**(`config`): `void`

Defined in: [packages/api-orval/src/config.ts:177](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/src/config.ts#L177)

Set the API configuration

## Parameters

### config

[`ApiConfig`](../interfaces/ApiConfig.md)

Partial configuration to override defaults

## Returns

`void`

## Example

```typescript
// In your app's initialization
setApiConfig({
  getUrl: (contextUrl) => `https://api.myapp.com${contextUrl}`,
  getHeaders: (headers) => ({
    ...headers,
    'Authorization': `Bearer ${getAuthToken()}`,
  }),
});
```
