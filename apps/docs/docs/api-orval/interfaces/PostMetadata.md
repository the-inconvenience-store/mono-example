# Interface: PostMetadata

Defined in: [packages/api-orval/gen/models/postMetadata.ts:12](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/gen/models/postMetadata.ts#L12)

Represents metadata for a blog post extracted from MDX frontmatter

## Properties

### image?

> `optional` **image**: `string`

Defined in: [packages/api-orval/gen/models/postMetadata.ts:37](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/gen/models/postMetadata.ts#L37)

Optional featured image URL for the blog post

#### Min Length

0

#### Max Length

500

#### Nullable

***

### publishedAt

> **publishedAt**: `string`

Defined in: [packages/api-orval/gen/models/postMetadata.ts:24](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/gen/models/postMetadata.ts#L24)

The publication date of the blog post in ISO format (YYYY-MM-DD)

#### Min Length

1

#### Pattern

^\d{4}-\d{2}-\d{2}$

***

### summary

> **summary**: `string`

Defined in: [packages/api-orval/gen/models/postMetadata.ts:30](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/gen/models/postMetadata.ts#L30)

A brief summary of the blog post content

#### Min Length

10

#### Max Length

500

***

### title

> **title**: `string`

Defined in: [packages/api-orval/gen/models/postMetadata.ts:18](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/gen/models/postMetadata.ts#L18)

The title of the blog post

#### Min Length

1

#### Max Length

200
