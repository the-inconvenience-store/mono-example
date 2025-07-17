// Type polyfills for React Native to work with the generated API client

declare global {
    type RequestCredentials = 'include' | 'omit' | 'same-origin'

    interface RequestInit {
        credentials?: RequestCredentials
    }
}

export { }
