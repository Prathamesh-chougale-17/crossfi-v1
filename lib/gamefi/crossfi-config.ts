import { defineChain } from 'viem';

// CrossFi Network Configuration
export const crossfiMainnet = defineChain({
  id: 4157,
  name: 'CrossFi',
  nativeCurrency: {
    decimals: 18,
    name: 'XFI',
    symbol: 'XFI',
  },
  rpcUrls: {
    default: { http: ['https://rpc.crossfi.io'] },
    public: { http: ['https://rpc.crossfi.io'] },
  },
  blockExplorers: {
    default: { name: 'CrossFi Explorer', url: 'https://xfiscan.com' },
  },
  contracts: {
    // Add contract addresses when deployed
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1,
    },
  },
});

export const crossfiTestnet = defineChain({
  id: 4158,
  name: 'CrossFi Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'XFI',
    symbol: 'XFI',
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.crossfi.io'] },
    public: { http: ['https://rpc.testnet.crossfi.io'] },
  },
  blockExplorers: {
    default: { name: 'CrossFi Testnet Explorer', url: 'https://test.xfiscan.com' },
  },
  testnet: true,
});

// CrossFi-specific GameFi configuration
export const CROSSFI_GAMEFI_CONFIG = {
  // Contract addresses (to be updated after deployment)
  contracts: {
    gameNFT: '0x...' as `0x${string}`,
    platformToken: '0x...' as `0x${string}`,
    marketplace: '0x...' as `0x${string}`,
    staking: '0x...' as `0x${string}`,
    governance: '0x...' as `0x${string}`,
  },
  
  // Token configuration
  token: {
    name: 'Jeu Token',
    symbol: 'JEU',
    decimals: 18,
    totalSupply: '1000000000', // 1 billion JEU
    initialPrice: '0.01', // $0.01 per JEU
  },
  
  // Staking configuration
  staking: {
    minStakeAmount: '100', // 100 JEU minimum
    stakingPeriods: [
      { days: 30, apy: 12 },
      { days: 90, apy: 18 },
      { days: 180, apy: 25 },
      { days: 365, apy: 35 },
    ],
    earlyUnstakePenalty: 0.1, // 10% penalty
  },
  
  // Royalty configuration
  royalties: {
    creatorShare: 0.05, // 5% to creator
    platformFee: 0.025, // 2.5% platform fee
    stakerShare: 0.925, // 92.5% to stakers
    forkFee: '1000', // 1000 JEU to fork a game
  },
  
  // Play-to-Earn configuration
  playToEarn: {
    baseReward: '10', // 10 JEU base reward
    maxReward: '100', // 100 JEU max reward
    streakMultiplier: 0.1, // 10% bonus per streak
    levelMultiplier: 0.05, // 5% bonus per level
    dailyChallenges: [
      { id: 'daily_play', reward: '10', requirement: 5 },
      { id: 'high_score', reward: '15', requirement: 10000 },
      { id: 'streak', reward: '25', requirement: 5 },
      { id: 'social', reward: '20', requirement: 3 },
    ],
  },
  
  // Competition configuration
  competitions: {
    entryFee: '50', // 50 JEU entry fee
    prizePool: {
      first: 0.5, // 50% of pool
      second: 0.3, // 30% of pool
      third: 0.2, // 20% of pool
    },
    maxParticipants: 100,
    durationHours: 24,
  },
  
  // Governance configuration
  governance: {
    proposalThreshold: '10000', // 10,000 JEU to create proposal
    votingPeriod: 7 * 24 * 60 * 60, // 7 days in seconds
    quorumPercentage: 10, // 10% of total supply must vote
    executionDelay: 2 * 24 * 60 * 60, // 2 days delay
  },
} as const;

// CrossFi network utilities
export const getCrossFiNetwork = (isTestnet = false) => {
  return isTestnet ? crossfiTestnet : crossfiMainnet;
};

export const isCrossFiNetwork = (chainId: number) => {
  return chainId === crossfiMainnet.id || chainId === crossfiTestnet.id;
};

// CrossFi-specific transaction configurations
export const CROSSFI_TX_CONFIG = {
  gasLimit: {
    mint: 200000,
    stake: 150000,
    unstake: 180000,
    claim: 120000,
    fork: 250000,
    play: 100000,
  },
  
  // Recommended gas prices in gwei
  gasPrice: {
    slow: '1',
    standard: '2',
    fast: '5',
  },
  
  // Transaction confirmation settings
  confirmations: 2,
  timeout: 60000, // 60 seconds
};

// CrossFi ecosystem integrations
export const CROSSFI_INTEGRATIONS = {
  // DeFi protocols on CrossFi
  dex: {
    name: 'CrossFi DEX',
    url: 'https://dex.crossfi.io',
    routerAddress: '0x...' as `0x${string}`,
  },
  
  // Lending protocols
  lending: {
    name: 'CrossFi Lend',
    url: 'https://lend.crossfi.io',
    contractAddress: '0x...' as `0x${string}`,
  },
  
  // NFT marketplaces
  nftMarketplace: {
    name: 'CrossFi NFTs',
    url: 'https://nft.crossfi.io',
    contractAddress: '0x...' as `0x${string}`,
  },
  
  // Bridge services
  bridge: {
    name: 'CrossFi Bridge',
    url: 'https://bridge.crossfi.io',
    supportedChains: [1, 137, 10, 42161], // Ethereum, Polygon, Optimism, Arbitrum
  },
};

// Utility functions for CrossFi
export const formatCrossFiAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getCrossFiExplorerUrl = (hash: string, type: 'tx' | 'address' | 'token' = 'tx', isTestnet = false) => {
  const baseUrl = isTestnet ? 'https://test.xfiscan.com' : 'https://xfiscan.com';
  
  switch (type) {
    case 'tx':
      return `${baseUrl}/tx/${hash}`;
    case 'address':
      return `${baseUrl}/address/${hash}`;
    case 'token':
      return `${baseUrl}/token/${hash}`;
    default:
      return baseUrl;
  }
};

// Price feeds and oracles (if available on CrossFi)
export const CROSSFI_ORACLES = {
  xfiUsd: '0x...' as `0x${string}`,
  ethUsd: '0x...' as `0x${string}`,
  btcUsd: '0x...' as `0x${string}`,
};

// CrossFi-specific error messages
export const CROSSFI_ERRORS = {
  NETWORK_NOT_SUPPORTED: 'Please switch to CrossFi network',
  INSUFFICIENT_XFI: 'Insufficient XFI for gas fees',
  INSUFFICIENT_JEU: 'Insufficient JEU tokens',
  TRANSACTION_FAILED: 'Transaction failed on CrossFi network',
  CONTRACT_NOT_DEPLOYED: 'GameFi contracts not deployed on this network',
} as const;