import { BlogPostsApi, Configuration } from '@mono/api'
import { env } from '@/config/env/client'
// API Configuration
const apiConfig = new Configuration({
    basePath: env.NEXT_PUBLIC_API_URL || 'http://localhost:5074',
    headers: {
        'Content-Type': 'application/json',
    },
})

// API Client instances
export const blogPostsApi = new BlogPostsApi(apiConfig)

// Type exports for convenience
export type { BlogPost, PostMetadata } from '@mono/api'
