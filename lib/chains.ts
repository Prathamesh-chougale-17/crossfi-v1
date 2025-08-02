import type { Chain } from '@rainbow-me/rainbowkit';
export const crossfiTestnet = {
    id: 4157,
    name: 'CrossFi Testnet',
    nativeCurrency: { name: 'CrossFi XFI', symbol: 'XFI', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.testnet.ms'] } },
    blockExplorers: { default: { name: 'XFI Scan Testnet', url: 'https://test.xfiscan.com' } },
    testnet: true,
    iconUrl: '/chains/crossfi.svg',          // optional
    iconBackground: '#fff',                  // optional
    contracts: {
      multicall3: {
        address: '0x...',                     // fill if known
        blockCreated: 0                       // optional
      },
    },
  } as const satisfies Chain;
  