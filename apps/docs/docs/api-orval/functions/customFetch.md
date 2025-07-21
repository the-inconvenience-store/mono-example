# Function: customFetch()

> **customFetch**\<`T`\>(`url`, `options`): `Promise`\<`T`\>

Defined in: [packages/api-orval/src/custom-fetch.ts:13](https://github.com/the-inconvenience-store/mono-example/blob/77ed7dd80da67d5d4a2bd8320e638952ed491201/packages/api-orval/src/custom-fetch.ts#L13)

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
