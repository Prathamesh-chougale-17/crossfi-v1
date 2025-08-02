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
import { GameFiProvider } from '@/lib/gamefi/gamefi-context';
import { crossfiMainnet, crossfiTestnet } from '@/lib/gamefi/crossfi-config';

// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css';

interface ProvidersProps {
    children: ReactNode;
}

const config = getDefaultConfig({
    appName: 'Jeu Plaza - GameFi Platform',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'default',
    chains: [
        crossfiMainnet, // CrossFi as primary chain
        mainnet, 
        polygon, 
        optimism, 
        arbitrum, 
        base, 
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [crossfiTestnet, sepolia] : [])
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
                        <GameFiProvider>
                            {children}
                        </GameFiProvider>
                    </WalletProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}