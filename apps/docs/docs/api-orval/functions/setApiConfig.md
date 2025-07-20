# Function: setApiConfig()

> **setApiConfig**(`config`): `void`

Defined in: [packages/api-orval/src/config.ts:177](https://github.com/the-inconvenience-store/mono-example/blob/a3e1f4667d455f254c4a536af743fc2dff215781/packages/api-orval/src/config.ts#L177)

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
