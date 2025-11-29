'use client'

import { wagmiAdapter, projectId } from '@/lib/wagmiConfig'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { FarcasterProvider } from './FarcasterProvider'

const queryClient = new QueryClient()

if (!projectId) {
    throw new Error('Project ID is not defined')
}

export default function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <FarcasterProvider>
                    {children}
                </FarcasterProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
