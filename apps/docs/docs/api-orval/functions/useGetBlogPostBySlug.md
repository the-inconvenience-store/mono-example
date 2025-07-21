# Function: useGetBlogPostBySlug()

> **useGetBlogPostBySlug**\<`TData`, `TError`\>(`slug`, `options?`): `UseQueryResult`\<`TData`, `TError`\> & `object`

Defined in: [packages/api-orval/gen/apis/blog-posts/blog-posts.ts:245](https://github.com/the-inconvenience-store/mono-example/blob/77ed7dd80da67d5d4a2bd8320e638952ed491201/packages/api-orval/gen/apis/blog-posts/blog-posts.ts#L245)

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

`UseQueryResult`\<`TData`, `TError`\> & `object`
