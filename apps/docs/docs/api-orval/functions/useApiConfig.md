# Function: useApiConfig()

> **useApiConfig**(): `ApiConfigContextType`

Defined in: [packages/api-orval/src/provider.tsx:172](https://github.com/the-inconvenience-store/mono-example/blob/a3e1f4667d455f254c4a536af743fc2dff215781/packages/api-orval/src/provider.tsx#L172)

Hook to access API configuration context

## Returns

`ApiConfigContextType`

## Example

```tsx
function MyComponent() {
  const { isInitialized, error, initialize } = useApiConfig();
  
  if (!isInitialized) {
    return <div>Loading API configuration...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return <div>API is ready!</div>;
}
```
