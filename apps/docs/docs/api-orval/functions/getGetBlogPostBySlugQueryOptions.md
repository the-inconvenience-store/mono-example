# Function: getGetBlogPostBySlugQueryOptions()

> **getGetBlogPostBySlugQueryOptions**\<`TData`, `TError`\>(`slug`, `options?`): `UseQueryOptions`\<[`getBlogPostBySlugResponse`](../type-aliases/getBlogPostBySlugResponse.md), `TError`, `TData`, readonly `unknown`[]\> & `object`

Defined in: [packages/api-orval/gen/apis/blog-posts/blog-posts.ts:202](https://github.com/the-inconvenience-store/mono-example/blob/a3e1f4667d455f254c4a536af743fc2dff215781/packages/api-orval/gen/apis/blog-posts/blog-posts.ts#L202)

## Type Parameters

### TData

`TData` = [`getBlogPostBySlugResponse`](../type-aliases/getBlogPostBySlugResponse.md)

### TError

`TError` = [`ProblemDetails`](../interfaces/ProblemDetails.md)

## Parameters

### slug

`string`

### options?

#### query?

`UseQueryOptions`\<[`getBlogPostBySlugResponse`](../type-aliases/getBlogPostBySlugResponse.md), `TError`, `TData`\>

#### request?

`RequestInit`

## Returns

`UseQueryOptions`\<[`getBlogPostBySlugResponse`](../type-aliases/getBlogPostBySlugResponse.md), `TError`, `TData`, readonly `unknown`[]\> & `object`
