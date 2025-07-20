# Type Alias: getBlogPostBySlugResponse200

> **getBlogPostBySlugResponse200** = `object`

Defined in: [packages/api-orval/gen/apis/blog-posts/blog-posts.ts:166](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/gen/apis/blog-posts/blog-posts.ts#L166)

Retrieves a single blog post using its URL-friendly slug identifier.
The slug is derived from the original filename and is used for SEO-friendly URLs.

Example slugs:
- "getting-started-with-react"
- "advanced-typescript-patterns"
- "nextjs-best-practices"

Sample response:
```json
{
 "metadata": {
   "title": "Getting Started with React",
   "publishedAt": "2024-01-15",
   "summary": "Learn the basics of React development",
   "image": "react-intro.jpg"
 },
 "slug": "getting-started-with-react",
 "content": "# Getting Started with React\n\nReact is a..."
}
```

## Properties

### data

> **data**: [`BlogPost`](../interfaces/BlogPost.md)

Defined in: [packages/api-orval/gen/apis/blog-posts/blog-posts.ts:167](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/gen/apis/blog-posts/blog-posts.ts#L167)

***

### status

> **status**: `200`

Defined in: [packages/api-orval/gen/apis/blog-posts/blog-posts.ts:168](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/gen/apis/blog-posts/blog-posts.ts#L168)
