'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiConfigProvider } from '@mono/api-orval'
import { useState } from 'react'
import { webApiConfig } from '@/config/api.config'


export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // 5 minutes
                        refetchOnWindowFocus: false,
                    },
                },
            })
    )


    return (
        <ApiConfigProvider config={webApiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ApiConfigProvider>
    )
}