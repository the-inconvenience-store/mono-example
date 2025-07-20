# Type Alias: getAllBlogPostsResponse200

> **getAllBlogPostsResponse200** = `object`

Defined in: [packages/api-orval/gen/apis/blog-posts/blog-posts.ts:50](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/gen/apis/blog-posts/blog-posts.ts#L50)

Retrieves a complete list of all available blog posts including their metadata and full content.
Posts are returned with their original publication order and include:
- Metadata (title, publication date, summary, optional image)
- URL-friendly slug
- Full MDX content

Sample response:
```json
[
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
]
```

## Properties

### data

> **data**: [`BlogPost`](../interfaces/BlogPost.md)[]

Defined in: [packages/api-orval/gen/apis/blog-posts/blog-posts.ts:51](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/gen/apis/blog-posts/blog-posts.ts#L51)

***

### status

> **status**: `200`

Defined in: [packages/api-orval/gen/apis/blog-posts/blog-posts.ts:52](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/gen/apis/blog-posts/blog-posts.ts#L52)
