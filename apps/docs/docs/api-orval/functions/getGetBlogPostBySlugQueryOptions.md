# Function: getGetBlogPostBySlugQueryOptions()

> **getGetBlogPostBySlugQueryOptions**\<`TData`, `TError`\>(`slug`, `options?`): `UseQueryOptions`\<[`getBlogPostBySlugResponse`](../type-aliases/getBlogPostBySlugResponse.md), `TError`, `TData`, readonly `unknown`[]\> & `object`

Defined in: [packages/api-orval/gen/apis/blog-posts/blog-posts.ts:202](https://github.com/the-inconvenience-store/mono-example/blob/77ed7dd80da67d5d4a2bd8320e638952ed491201/packages/api-orval/gen/apis/blog-posts/blog-posts.ts#L202)

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
