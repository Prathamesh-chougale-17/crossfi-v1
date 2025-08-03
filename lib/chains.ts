import type { Chain } from '@rainbow-me/rainbowkit';
export const crossfiTestnet = {
    id: 4157,
    name: 'CrossFi Testnet',
    nativeCurrency: { name: 'CrossFi XFI', symbol: 'XFI', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.testnet.ms'] } },
    blockExplorers: { default: { name: 'XFI Scan Testnet', url: 'https://test.xfiscan.com' } },
    testnet: true,
    iconUrl: '/chains/crossfi.svg',
    iconBackground: '#fff',
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 1
      },
    },
  } as const satisfies Chain;

export const crossfiMainnet = {
    id: 4158,
    name: 'CrossFi Mainnet',
    nativeCurrency: { name: 'CrossFi XFI', symbol: 'XFI', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.crossfi.io'] } },
    blockExplorers: { default: { name: 'XFI Scan', url: 'https://xfiscan.com' } },
    testnet: false,
    iconUrl: '/chains/crossfi.svg',
    iconBackground: '#fff',
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 1
      },
    },
  } as const satisfies Chain;
  