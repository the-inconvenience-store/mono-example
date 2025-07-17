import '../types/api-polyfills'
import { BlogPostsApi, Configuration, WeatherApi } from '@mono/api'

// API Configuration for React Native
const apiConfig = new Configuration({
    basePath: __DEV__ ? 'http://localhost:5074' : 'https://your-production-api.com/',
    headers: {
        'Content-Type': 'application/json',
    },
    // For React Native, we need to configure fetch properly
    fetchApi: fetch,
})

// API Client instances
export const blogPostsApi = new BlogPostsApi(apiConfig)
export const weatherApi = new WeatherApi(apiConfig)
// Type exports for convenience
export type { BlogPost, PostMetadata, WeatherForecast } from '@mono/api'
