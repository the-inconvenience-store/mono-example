# Interface: BlogPost

Defined in: [packages/api-orval/gen/models/blogPost.ts:13](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/gen/models/blogPost.ts#L13)

Represents a complete blog post with metadata, content, and slug

## Properties

### content

> **content**: `string`

Defined in: [packages/api-orval/gen/models/blogPost.ts:26](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/gen/models/blogPost.ts#L26)

The main content of the blog post (MDX content without frontmatter)

#### Min Length

1

***

### metadata

> **metadata**: [`PostMetadata`](PostMetadata.md)

Defined in: [packages/api-orval/gen/models/blogPost.ts:14](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/gen/models/blogPost.ts#L14)

***

### slug

> **slug**: `string`

Defined in: [packages/api-orval/gen/models/blogPost.ts:21](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/gen/models/blogPost.ts#L21)

The URL-friendly slug derived from the filename

#### Min Length

1

#### Max Length

100

#### Pattern

^[a-z0-9]+(?:-[a-z0-9]+)*$
