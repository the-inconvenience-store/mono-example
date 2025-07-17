// Re-export types from the API client for convenience
export type { PostMetadata, BlogPost } from '../lib/api-client'

// Navigation types
export type RootStackParamList = {
    Home: undefined
    BlogPost: { slug: string }
    Weather: undefined
}
