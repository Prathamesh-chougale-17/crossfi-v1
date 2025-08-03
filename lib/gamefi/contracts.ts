'use client';

import { ethers } from 'ethers';
import { toast } from 'sonner';

// Utility function to check if address is valid
function isValidEthereumAddress(address: string): boolean {
  return address && address.startsWith('0x') && address.length === 42 && /^0x[a-fA-F0-9]{40}$/.test(address);
}
import type { 
  GameNFT, 
  RoyaltyInfo, 
  StakingInfo, 
  TokenBalance,
  Transaction,
  ContractConfig,
  WalletAddress,
  TokenAmount 
} from './types';

// Contract ABIs (simplified for demo - in production, import from generated types)
export const GAME_NFT_ABI = [
  // Read functions
  'function getGameDetails(uint256 tokenId) view returns (tuple(address creator, string gameTitle, string gameDescription, string ipfsHash, uint256 createdAt, uint256 totalPlays, uint256 totalForks, uint256 totalStaked, bool isActive), tuple(uint256 totalEarned, uint256 playEarnings, uint256 forkEarnings, uint256 stakingRewards, uint256 lastClaimed), uint256 gameScore)',
  'function getUserStakingInfo(uint256 tokenId, address user) view returns (uint256 stakedAmount, uint256 pendingRewards, uint256 userShare)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function games(uint256 tokenId) view returns (address creator, string gameTitle, string gameDescription, string ipfsHash, uint256 createdAt, uint256 totalPlays, uint256 totalForks, uint256 totalStaked, bool isActive)',
  'function royalties(uint256 tokenId) view returns (uint256 totalEarned, uint256 playEarnings, uint256 forkEarnings, uint256 stakingRewards, uint256 lastClaimed)',
  
  // Write functions
  'function mintGame(address creator, string gameTitle, string gameDescription, string tokenURI, string ipfsHash) returns (uint256)',
  'function recordGamePlay(uint256 tokenId, address player, uint256 score, uint256 duration)',
  'function forkGame(uint256 originalTokenId, address forker, string newTitle, string newDescription, string newTokenURI, string newIpfsHash) returns (uint256)',
  'function stakeOnGame(uint256 tokenId, uint256 amount)',
  'function unstakeFromGame(uint256 tokenId, uint256 amount)',
  'function claimRoyalties(uint256 tokenId)',
  
  // Events
  'event GameMinted(uint256 indexed tokenId, address indexed creator, string gameTitle)',
  'event GamePlayed(uint256 indexed tokenId, address indexed player, uint256 reward)',
  'event GameForked(uint256 indexed originalId, uint256 indexed newId, address indexed forker)',
  'event TokensStaked(uint256 indexed tokenId, address indexed staker, uint256 amount)',
  'event TokensUnstaked(uint256 indexed tokenId, address indexed staker, uint256 amount)',
  'event RoyaltyClaimed(uint256 indexed tokenId, address indexed creator, uint256 amount)',
];

export const PLATFORM_TOKEN_ABI = [
  // ERC20 Standard
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  
  // Custom functions from PlatformToken.sol
  'function getRewardPools() view returns (uint256 playPool, uint256 stakingPool, uint256 creatorPool)',
  'function calculateDynamicReward(address user, uint256 baseReward, uint256 activityScore, uint256 loyaltyBonus) view returns (uint256)',
  'function mintPlayReward(address player, uint256 amount)',
  'function mintStakingReward(address staker, uint256 amount)',
  'function mintCreatorReward(address creator, uint256 amount)',
  'function authorizedMinters(address minter) view returns (bool)',
  'function playToEarnPool() view returns (uint256)',
  'function stakingRewardPool() view returns (uint256)',
  'function creatorRewardPool() view returns (uint256)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event RewardMinted(address indexed recipient, uint256 amount, string rewardType)',
];

// Contract configuration for different networks
export const CONTRACT_CONFIGS: Record<number, ContractConfig> = {
  // CrossFi Testnet
  4157: {
    gameNFT: '0x6C37D13C863193bdCcd2273Dc65488059e87fB17', // Updated with actual deployment
    platformToken: '0x96B8FB295da7070703e33CdE38E32cd6eA42e62e', // Updated with actual deployment
    marketplace: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    staking: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    governance: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    chainId: 4157,
    blockExplorer: 'https://test.xfiscan.com',
    rpcUrl: 'https://rpc.testnet.ms',
  },
  // CrossFi Mainnet
  4158: {
    gameNFT: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    platformToken: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    marketplace: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    staking: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    governance: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    chainId: 4158,
    blockExplorer: 'https://xfiscan.com',
    rpcUrl: 'https://rpc.crossfi.io',
  },
  // Local Development
  1337: {
    gameNFT: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    platformToken: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    marketplace: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    staking: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    governance: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    chainId: 1337,
    blockExplorer: 'http://localhost:8545',
    rpcUrl: 'http://localhost:8545',
  },
};

export class GameFiContracts {
  private signer?: any;
  private config: ContractConfig;
  private gameNFTContract: any;
  private platformTokenContract: any;
  private initialized = false;
  private initializationPromise: Promise<void>;

  constructor(
    provider: any,
    chainId: number,
    signer?: any
  ) {
    this.signer = signer;
    this.config = CONTRACT_CONFIGS[chainId];
    
    if (!this.config) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }

    // Initialize contracts - will be done later with dynamic import
    this.initializationPromise = this.initializeContracts(signer || provider);
  }

  private async initializeContracts(signerOrProvider: any) {
    try {
      // Dynamic import to avoid SSR issues and use proper ethers v6
      const { ethers } = await import('ethers');
      
      this.gameNFTContract = new ethers.Contract(
        this.config.gameNFT,
        GAME_NFT_ABI,
        signerOrProvider
      );

      this.platformTokenContract = new ethers.Contract(
        this.config.platformToken,
        PLATFORM_TOKEN_ABI,
        signerOrProvider
      );
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing contracts:', error);
      throw new Error('Failed to initialize contracts');
    }
  }

  public async waitForInitialization(): Promise<void> {
    return this.initializationPromise;
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initializationPromise;
    }
  }

  // Game NFT Operations
  async mintGameNFT(
    gameTitle: string,
    gameDescription: string,
    ipfsHash: string,
    tokenURI?: string
  ): Promise<string> {
    await this.ensureInitialized();
    if (!this.signer) throw new Error('Signer required for minting');
    
    try {
      const finalTokenURI = tokenURI || `https://ipfs.io/ipfs/${ipfsHash}/metadata.json`;
      const creatorAddress = await this.signer.getAddress();
      const tx = await this.gameNFTContract.mintGame(
        creatorAddress,
        gameTitle,
        gameDescription,
        finalTokenURI,
        ipfsHash
      );
      
      const receipt = await tx.wait();
      
      // Parse events correctly for ethers v6
      let tokenId: string | undefined;
      for (const log of receipt.logs) {
        try {
          const parsed = this.gameNFTContract.interface.parseLog(log);
          if (parsed && parsed.name === 'GameMinted') {
            tokenId = parsed.args.tokenId.toString();
            break;
          }
        } catch (error) {
          // Skip logs that can't be parsed
          continue;
        }
      }
      
      if (!tokenId) {
        throw new Error('Failed to get token ID from transaction receipt');
      }
      
      toast.success('Game NFT Minted!', {
        description: `Token ID: ${tokenId}`,
      });
      
      return tokenId;
    } catch (error) {
      console.error('Error minting game NFT:', error);
      toast.error('Failed to mint game NFT');
      throw error;
    }
  }

  async getGameDetails(tokenId: string): Promise<{
    gameData: GameNFT;
    royaltyData: RoyaltyInfo;
    gameScore: number;
  }> {
    await this.ensureInitialized();
    try {
      const [gameData, royaltyData, gameScore] = await this.gameNFTContract.getGameDetails(tokenId);
      
      return {
        gameData: {
          tokenId,
          creator: gameData.creator,
          owner: await this.gameNFTContract.ownerOf(tokenId),
          gameTitle: gameData.gameTitle,
          gameDescription: gameData.gameDescription,
          ipfsHash: gameData.ipfsHash,
          tokenURI: await this.gameNFTContract.tokenURI(tokenId),
          createdAt: Number(gameData.createdAt),
          totalPlays: Number(gameData.totalPlays),
          totalForks: Number(gameData.totalForks),
          totalStaked: gameData.totalStaked.toString(),
          isActive: gameData.isActive,
          gameScore: Number(gameScore),
        },
        royaltyData: {
          totalEarned: royaltyData.totalEarned.toString(),
          playEarnings: royaltyData.playEarnings.toString(),
          forkEarnings: royaltyData.forkEarnings.toString(),
          stakingRewards: royaltyData.stakingRewards.toString(),
          lastClaimed: royaltyData.lastClaimed.toString(),
          pendingAmount: (royaltyData.totalEarned - royaltyData.lastClaimed).toString(),
        },
        gameScore: Number(gameScore),
      };
    } catch (error) {
      console.error('Error getting game details:', error);
      throw error;
    }
  }

  async recordGamePlay(
    tokenId: string,
    playerAddress: string,
    score: number,
    duration: number
  ): Promise<void> {
    await this.ensureInitialized();
    if (!this.signer) throw new Error('Signer required for recording play');
    
    try {
      // Ensure player address is valid
      if (!isValidEthereumAddress(playerAddress)) {
        throw new Error('Invalid player address format');
      }
      const tx = await this.gameNFTContract.recordGamePlay(
        tokenId,
        playerAddress,
        score,
        duration
      );
      
      await tx.wait();
      
      toast.success('Game play recorded!', {
        description: 'Rewards distributed to creator and stakers',
      });
    } catch (error) {
      console.error('Error recording game play:', error);
      toast.error('Failed to record game play');
      throw error;
    }
  }

  async forkGame(
    originalTokenId: string,
    newTitle: string,
    newDescription: string,
    newIpfsHash: string,
    newTokenURI: string
  ): Promise<string> {
    if (!this.signer) throw new Error('Signer required for forking');
    
    try {
      const forkerAddress = await this.signer.getAddress();
      const tx = await this.gameNFTContract.forkGame(
        originalTokenId,
        forkerAddress,
        newTitle,
        newDescription,
        newTokenURI,
        newIpfsHash
      );
      
      const receipt = await tx.wait();
      
      // Parse events correctly for ethers v6
      let newTokenId: string | undefined;
      for (const log of receipt.logs) {
        try {
          const parsed = this.gameNFTContract.interface.parseLog(log);
          if (parsed && parsed.name === 'GameForked') {
            newTokenId = parsed.args.newId.toString();
            break;
          }
        } catch (error) {
          // Skip logs that can't be parsed
          continue;
        }
      }
      
      if (!newTokenId) {
        throw new Error('Failed to get new token ID from transaction receipt');
      }
      
      toast.success('Game Forked Successfully!', {
        description: `New Token ID: ${newTokenId}`,
      });
      
      return newTokenId;
    } catch (error) {
      console.error('Error forking game:', error);
      toast.error('Failed to fork game');
      throw error;
    }
  }

  // Staking Operations
  async stakeOnGame(tokenId: string, amount: TokenAmount): Promise<void> {
    await this.ensureInitialized();
    if (!this.signer) throw new Error('Signer required for staking');
    
    try {
      // First approve the GameNFT contract to spend tokens
      const approveTx = await this.platformTokenContract.approve(
        this.config.gameNFT,
        amount
      );
      await approveTx.wait();
      
      // Then stake the tokens
      const stakeTx = await this.gameNFTContract.stakeOnGame(tokenId, amount);
      await stakeTx.wait();
      
      toast.success('Tokens Staked!', {
        description: `Staked on game ${tokenId}`,
      });
    } catch (error) {
      console.error('Error staking tokens:', error);
      toast.error('Failed to stake tokens');
      throw error;
    }
  }

  async unstakeFromGame(tokenId: string, amount: TokenAmount): Promise<void> {
    await this.ensureInitialized();
    if (!this.signer) throw new Error('Signer required for unstaking');
    
    try {
      const tx = await this.gameNFTContract.unstakeFromGame(tokenId, amount);
      await tx.wait();
      
      toast.success('Tokens Unstaked!', {
        description: 'Rewards claimed automatically',
      });
    } catch (error) {
      console.error('Error unstaking tokens:', error);
      toast.error('Failed to unstake tokens');
      throw error;
    }
  }

  async getStakingInfo(tokenId: string, userAddress: string): Promise<StakingInfo> {
    await this.ensureInitialized();
    try {
      // Ensure address is valid
      if (!userAddress || !userAddress.startsWith('0x')) {
        throw new Error('Invalid address format');
      }
      const [stakedAmount, pendingRewards, userShare] = await this.gameNFTContract.getUserStakingInfo(
        tokenId,
        userAddress
      );
      
      const gameDetails = await this.getGameDetails(tokenId);
      
      return {
        tokenId,
        userStaked: stakedAmount.toString(),
        totalStaked: gameDetails.gameData.totalStaked,
        userShare: Number(userShare) / 100, // Convert from basis points
        pendingRewards: pendingRewards.toString(),
        rewardPool: '0', // Would get from separate call
        apy: 15.5, // Would calculate based on historical data
      };
    } catch (error) {
      console.error('Error getting staking info:', error);
      throw error;
    }
  }

  // Royalty Operations
  async claimRoyalties(tokenId: string): Promise<void> {
    await this.ensureInitialized();
    if (!this.signer) throw new Error('Signer required for claiming royalties');
    
    try {
      const tx = await this.gameNFTContract.claimRoyalties(tokenId);
      await tx.wait();
      
      toast.success('Royalties Claimed!', {
        description: 'Rewards transferred to your wallet',
      });
    } catch (error) {
      console.error('Error claiming royalties:', error);
      toast.error('Failed to claim royalties');
      throw error;
    }
  }

  // Token Operations
  async getTokenBalance(userAddress: string): Promise<TokenBalance> {
    await this.ensureInitialized();
    try {
      // Ensure address is valid and not an ENS name
      if (!isValidEthereumAddress(userAddress)) {
        throw new Error('Invalid address format');
      }
      
      const balance = await this.platformTokenContract.balanceOf(userAddress);
      
      // In a real implementation, you'd calculate these from various sources
      return {
        balance: balance.toString(),
        lockedBalance: '0', // Would calculate from staking positions
        availableBalance: balance.toString(),
        totalEarned: '0', // Would track from events/database
        playToEarnTotal: '0',
        stakingTotal: '0',
        royaltyTotal: '0',
      };
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }

  async approveTokenSpending(spender: string, amount: TokenAmount): Promise<void> {
    await this.ensureInitialized();
    if (!this.signer) throw new Error('Signer required for approval');
    
    try {
      // Ensure spender address is valid
      if (!isValidEthereumAddress(spender)) {
        throw new Error('Invalid spender address format');
      }
      const tx = await this.platformTokenContract.approve(spender, amount);
      await tx.wait();
      
      toast.success('Spending Approved!');
    } catch (error) {
      console.error('Error approving spending:', error);
      toast.error('Failed to approve spending');
      throw error;
    }
  }

  // Utility Functions
  async getUserGames(userAddress: string): Promise<GameNFT[]> {
    await this.ensureInitialized();
    try {
      // Ensure address is valid and not an ENS name
      if (!isValidEthereumAddress(userAddress)) {
        throw new Error('Invalid address format');
      }
      
      const balance = await this.gameNFTContract.balanceOf(userAddress);
      const games: GameNFT[] = [];
      
      // If user has no NFTs, return empty array immediately
      if (balance.toString() === '0') {
        return games;
      }
      
      // Check first 1000 token IDs for user's games (reasonable limit for testing)
      // In production, you'd use events or a subgraph for efficient querying
      for (let tokenId = 1; tokenId <= 1000; tokenId++) {
        try {
          const owner = await this.gameNFTContract.ownerOf(tokenId);
          if (owner.toLowerCase() === userAddress.toLowerCase()) {
            const gameDetails = await this.getGameDetails(tokenId.toString());
            games.push(gameDetails.gameData);
            
            // If we found all user's games, break early
            if (games.length >= Number(balance)) {
              break;
            }
          }
        } catch (error) {
          // Token doesn't exist yet, we've reached the end
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          if (errorMessage.includes('ERC721: invalid token ID') || 
              errorMessage.includes('owner query for nonexistent token')) {
            break;
          }
          // Other errors, skip this token
          continue;
        }
      }
      
      return games;
    } catch (error) {
      console.error('Error getting user games:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }

  async getRewardPools(): Promise<{
    playToEarn: TokenAmount;
    staking: TokenAmount;
    creator: TokenAmount;
  }> {
    try {
      const [playPool, stakingPool, creatorPool] = await this.platformTokenContract.getRewardPools();
      
      return {
        playToEarn: playPool.toString(),
        staking: stakingPool.toString(),
        creator: creatorPool.toString(),
      };
    } catch (error) {
      console.error('Error getting reward pools:', error);
      throw error;
    }
  }

  // Event Listeners
  onGameMinted(callback: (tokenId: string, creator: string, gameTitle: string) => void) {
    this.gameNFTContract.on('GameMinted', callback);
  }

  onGamePlayed(callback: (tokenId: string, player: string, reward: string) => void) {
    this.gameNFTContract.on('GamePlayed', callback);
  }

  onTokensStaked(callback: (tokenId: string, staker: string, amount: string) => void) {
    this.gameNFTContract.on('TokensStaked', callback);
  }

  onRoyaltyClaimed(callback: (tokenId: string, creator: string, amount: string) => void) {
    this.gameNFTContract.on('RoyaltyClaimed', callback);
  }

  // Cleanup
  removeAllListeners() {
    this.gameNFTContract.removeAllListeners();
    this.platformTokenContract.removeAllListeners();
  }
}