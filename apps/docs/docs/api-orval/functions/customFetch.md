# Function: customFetch()

> **customFetch**\<`T`\>(`url`, `options`): `Promise`\<`T`\>

Defined in: [packages/api-orval/src/custom-fetch.ts:13](https://github.com/the-inconvenience-store/mono-example/blob/a3e1f4667d455f254c4a536af743fc2dff215781/packages/api-orval/src/custom-fetch.ts#L13)

Custom fetch implementation that uses the configured API settings

This function respects the user's configuration for URL transformation,
header manipulation, and response body parsing.

## Type Parameters

### T

`T`

## Parameters

### url

`string`

The URL to fetch

### options

`RequestInit`

The fetch options

## Returns

`Promise`\<`T`\>

Promise resolving to the response with status, data, and headers
