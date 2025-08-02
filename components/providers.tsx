'use client';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    sepolia,
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import { ReactNode } from 'react';
import { WalletProvider } from '@/lib/wallet/wallet-context';

// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css';

interface ProvidersProps {
    children: ReactNode;
}

const config = getDefaultConfig({
    appName: 'MediChainX',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'default',
    chains: [
        mainnet, 
        polygon, 
        optimism, 
        arbitrum, 
        base, 
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : [])
    ],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

export function Providers({ children }: ProvidersProps) {
    const queryClient = new QueryClient();
    
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <WalletProvider>
                        {children}
                    </WalletProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}