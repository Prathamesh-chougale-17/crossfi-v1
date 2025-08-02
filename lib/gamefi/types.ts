import { z } from 'zod';

// Game NFT Schema
export const GameNFTSchema = z.object({
  tokenId: z.string(),
  creator: z.string(),
  owner: z.string(),
  gameTitle: z.string(),
  gameDescription: z.string(),
  ipfsHash: z.string(),
  tokenURI: z.string(),
  createdAt: z.number(),
  totalPlays: z.number(),
  totalForks: z.number(),
  totalStaked: z.string(), // BigNumber as string
  isActive: z.boolean(),
  gameScore: z.number(),
});

export type GameNFT = z.infer<typeof GameNFTSchema>;

// Royalty Information Schema
export const RoyaltyInfoSchema = z.object({
  totalEarned: z.string(), // BigNumber as string
  playEarnings: z.string(),
  forkEarnings: z.string(),
  stakingRewards: z.string(),
  lastClaimed: z.string(),
  pendingAmount: z.string(),
});

export type RoyaltyInfo = z.infer<typeof RoyaltyInfoSchema>;

// Staking Information Schema
export const StakingInfoSchema = z.object({
  tokenId: z.string(),
  userStaked: z.string(), // BigNumber as string
  totalStaked: z.string(),
  userShare: z.number(), // Percentage (0-100)
  pendingRewards: z.string(),
  rewardPool: z.string(),
  apy: z.number(), // Annual percentage yield
});

export type StakingInfo = z.infer<typeof StakingInfoSchema>;

// Platform Token Balance Schema
export const TokenBalanceSchema = z.object({
  balance: z.string(), // BigNumber as string
  lockedBalance: z.string(), // Tokens locked in staking
  availableBalance: z.string(), // Available for transactions
  totalEarned: z.string(), // Total earned from all sources
  playToEarnTotal: z.string(),
  stakingTotal: z.string(),
  royaltyTotal: z.string(),
});

export type TokenBalance = z.infer<typeof TokenBalanceSchema>;

// Game Performance Metrics Schema
export const GameMetricsSchema = z.object({
  tokenId: z.string(),
  dailyPlays: z.number(),
  weeklyPlays: z.number(),
  monthlyPlays: z.number(),
  totalPlays: z.number(),
  averageScore: z.number(),
  averagePlayTime: z.number(), // in seconds
  retentionRate: z.number(), // percentage
  forkRate: z.number(), // forks per play
  stakingRatio: z.number(), // staked amount / market cap
  trending: z.boolean(),
  category: z.enum(['rising', 'stable', 'declining']),
});

export type GameMetrics = z.infer<typeof GameMetricsSchema>;

// Transaction History Schema
export const TransactionSchema = z.object({
  id: z.string(),
  type: z.enum([
    'game_mint',
    'game_play',
    'game_fork',
    'stake',
    'unstake',
    'royalty_claim',
    'reward_earn',
    'token_transfer'
  ]),
  tokenId: z.string().optional(),
  amount: z.string(), // BigNumber as string
  from: z.string(),
  to: z.string(),
  txHash: z.string(),
  blockNumber: z.number(),
  timestamp: z.number(),
  gasUsed: z.string(),
  status: z.enum(['pending', 'confirmed', 'failed']),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// Marketplace Listing Schema
export const MarketplaceListingSchema = z.object({
  tokenId: z.string(),
  seller: z.string(),
  price: z.string(), // BigNumber as string
  currency: z.enum(['JEU', 'ETH', 'USDC']),
  listingType: z.enum(['fixed_price', 'auction', 'bundle']),
  startTime: z.number(),
  endTime: z.number(),
  isActive: z.boolean(),
  bids: z.array(z.object({
    bidder: z.string(),
    amount: z.string(),
    timestamp: z.number(),
  })).optional(),
});

export type MarketplaceListing = z.infer<typeof MarketplaceListingSchema>;

// Leaderboard Entry Schema
export const LeaderboardEntrySchema = z.object({
  rank: z.number(),
  address: z.string(),
  username: z.string().optional(),
  score: z.number(),
  category: z.enum([
    'top_creators',
    'top_earners',
    'top_stakers',
    'top_players',
    'rising_stars'
  ]),
  value: z.string(), // Could be earnings, games created, etc.
  change: z.number(), // Position change
});

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

// Portfolio Summary Schema
export const PortfolioSummarySchema = z.object({
  totalValue: z.string(), // Total portfolio value in JEU
  totalGames: z.number(), // Games owned
  totalStaked: z.string(), // Total tokens staked
  totalEarnings: z.string(), // All-time earnings
  monthlyEarnings: z.string(), // This month's earnings
  portfolioChange: z.number(), // 24h percentage change
  breakdown: z.object({
    gameAssets: z.string(), // Value of game NFTs
    stakingRewards: z.string(), // Value of staking positions
    tokenBalance: z.string(), // Liquid token balance
    pendingRewards: z.string(), // Unclaimed rewards
  }),
});

export type PortfolioSummary = z.infer<typeof PortfolioSummarySchema>;

// Competition Entry Schema
export const CompetitionEntrySchema = z.object({
  competitionId: z.string(),
  tokenId: z.string(), // Game being used
  participant: z.string(),
  score: z.number(),
  rank: z.number(),
  entryFee: z.string(),
  potentialReward: z.string(),
  status: z.enum(['active', 'completed', 'claimed']),
  timestamp: z.number(),
});

export type CompetitionEntry = z.infer<typeof CompetitionEntrySchema>;

// Governance Proposal Schema
export const GovernanceProposalSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  proposer: z.string(),
  category: z.enum([
    'platform_upgrade',
    'fee_adjustment',
    'reward_distribution',
    'game_curation',
    'treasury_usage'
  ]),
  votingPower: z.string(), // Required voting power to pass
  votesFor: z.string(),
  votesAgainst: z.string(),
  startTime: z.number(),
  endTime: z.number(),
  status: z.enum(['active', 'passed', 'rejected', 'executed']),
  quorum: z.number(), // Minimum participation percentage
});

export type GovernanceProposal = z.infer<typeof GovernanceProposalSchema>;

// API Response Schemas
export const ApiResponseSchema = <T>(dataSchema: z.ZodSchema<T>) => z.object({
  success: z.boolean(),
  data: dataSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
  timestamp: z.number(),
});

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: number;
};

// Contract Configuration
export const ContractConfigSchema = z.object({
  gameNFT: z.string(), // Contract address
  platformToken: z.string(),
  marketplace: z.string(),
  staking: z.string(),
  governance: z.string(),
  chainId: z.number(),
  blockExplorer: z.string(),
  rpcUrl: z.string(),
});

export type ContractConfig = z.infer<typeof ContractConfigSchema>;

// Event Log Schema for Contract Events
export const ContractEventSchema = z.object({
  event: z.string(),
  address: z.string(),
  blockNumber: z.number(),
  transactionHash: z.string(),
  args: z.record(z.any()),
  timestamp: z.number(),
});

export type ContractEvent = z.infer<typeof ContractEventSchema>;

// Utility Types
export type WalletAddress = `0x${string}`;
export type TokenAmount = string; // BigNumber as string
export type IPFSHash = string;
export type TransactionHash = `0x${string}`;

// Constants
export const PLATFORM_CONSTANTS = {
  TOKEN_DECIMALS: 18,
  MIN_STAKE_AMOUNT: '100', // 100 JEU minimum stake
  PLATFORM_FEE_BASIS_POINTS: 250, // 2.5%
  CREATOR_ROYALTY_BASIS_POINTS: 500, // 5%
  MAX_ROYALTY_BASIS_POINTS: 1000, // 10%
  MIN_PLAY_REWARD: '1', // 1 JEU minimum
  MAX_PLAY_REWARD: '100', // 100 JEU maximum
  FORK_FEE: '1000', // 1000 JEU to fork a game
  COMPETITION_ENTRY_FEE: '50', // 50 JEU entry fee
} as const;

// Error Types
export class GameFiError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'GameFiError';
  }
}

export const ERROR_CODES = {
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  GAME_NOT_FOUND: 'GAME_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  CONTRACT_ERROR: 'CONTRACT_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;