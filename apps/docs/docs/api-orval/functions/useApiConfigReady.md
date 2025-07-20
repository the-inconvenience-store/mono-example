# Function: useApiConfigReady()

> **useApiConfigReady**(): `boolean`

Defined in: [packages/api-orval/src/provider.tsx:199](https://github.com/the-inconvenience-store/mono-example/blob/a3e1f4667d455f254c4a536af743fc2dff215781/packages/api-orval/src/provider.tsx#L199)

Hook to check if API configuration is initialized
This is useful for conditional rendering or warnings

## Returns

`boolean`

## Example

```tsx
function MyComponent() {
  const isReady = useApiConfigReady();
  
  if (!isReady) {
    console.warn('API configuration not ready yet');
  }
  
  return <div>Component content</div>;
}
```
