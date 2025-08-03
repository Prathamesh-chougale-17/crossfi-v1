'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    sepolia,
    polygonAmoy,
} from 'wagmi/chains';
import { http } from 'viem';
import { crossfiTestnet, crossfiMainnet } from '../chains';

// Configuring supported chains and providers for Rainbow Kit
export const config = getDefaultConfig({
    appName: 'MediChainX',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
    chains: [
        crossfiTestnet,  // Put CrossFi testnet first for development
        crossfiMainnet,
        mainnet,
        polygon,
        optimism,
        arbitrum,
        base,
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia, polygonAmoy] : []),
    ],
    transports: {
        [crossfiTestnet.id]: http('https://rpc.testnet.ms'),
        [crossfiMainnet.id]: http('https://rpc.crossfi.io'),
        [mainnet.id]: http(),
        [polygon.id]: http(),
        [optimism.id]: http(),
        [arbitrum.id]: http(),
        [base.id]: http(),
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' 
            ? {
                [sepolia.id]: http(),
                [polygonAmoy.id]: http(),
            } 
            : {}),
    },
    ssr: true,
});

export const supportedChains = [
    { id: crossfiTestnet.id, name: 'CrossFi Testnet', icon: '/chains/crossfi.svg' },
    { id: crossfiMainnet.id, name: 'CrossFi Mainnet', icon: '/chains/crossfi.svg' },
    { id: mainnet.id, name: 'Ethereum', icon: '/chains/ethereum.svg' },
    { id: polygon.id, name: 'Polygon', icon: '/chains/polygon.svg' },
    { id: optimism.id, name: 'Optimism', icon: '/chains/optimism.svg' },
    { id: arbitrum.id, name: 'Arbitrum', icon: '/chains/arbitrum.svg' },
    { id: base.id, name: 'Base', icon: '/chains/base.svg' },
];