# Function: useGetAllBlogPosts()

> **useGetAllBlogPosts**\<`TData`, `TError`\>(`options?`): `UseQueryResult`\<`TData`, `TError`\> & `object`

Defined in: [packages/api-orval/gen/apis/blog-posts/blog-posts.ts:120](https://github.com/the-inconvenience-store/mono-example/blob/a3e1f4667d455f254c4a536af743fc2dff215781/packages/api-orval/gen/apis/blog-posts/blog-posts.ts#L120)

## Type Parameters

### TData

`TData` = [`getAllBlogPostsResponse`](../type-aliases/getAllBlogPostsResponse.md)

### TError

`TError` = [`ProblemDetails`](../interfaces/ProblemDetails.md)

## Parameters

### options?

#### query?

`UseQueryOptions`\<[`getAllBlogPostsResponse`](../type-aliases/getAllBlogPostsResponse.md), `TError`, `TData`\>

#### request?

`RequestInit`

## Returns

`UseQueryResult`\<`TData`, `TError`\> & `object`
