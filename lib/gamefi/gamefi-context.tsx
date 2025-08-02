'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { toast } from 'sonner';
import { GameFiContracts } from './contracts';
import { 
  crossfiMainnet, 
  crossfiTestnet, 
  CROSSFI_GAMEFI_CONFIG,
  isCrossFiNetwork,
  CROSSFI_ERRORS 
} from './crossfi-config';
import type { 
  GameNFT, 
  TokenBalance, 
  StakingInfo, 
  RoyaltyInfo,
  GameMetrics,
  Transaction,
  PortfolioSummary 
} from './types';

interface GameFiContextType {
  // Connection state
  isConnected: boolean;
  isCrossFiNetwork: boolean;
  chainId: number | undefined;
  address: string | undefined;
  
  // Contracts
  contracts: GameFiContracts | null;
  
  // Token & Balance
  tokenBalance: TokenBalance | null;
  portfolioSummary: PortfolioSummary | null;
  
  // User's games
  userGames: GameNFT[];
  
  // Loading states
  isLoadingBalance: boolean;
  isLoadingGames: boolean;
  isLoadingPortfolio: boolean;
  
  // Functions
  refreshBalance: () => Promise<void>;
  refreshUserGames: () => Promise<void>;
  refreshPortfolio: () => Promise<void>;
  
  // Game operations
  mintGameNFT: (gameTitle: string, gameDescription: string, ipfsHash: string) => Promise<string>;
  stakeOnGame: (tokenId: string, amount: string) => Promise<void>;
  unstakeFromGame: (tokenId: string, amount: string) => Promise<void>;
  claimRoyalties: (tokenId: string) => Promise<void>;
  forkGame: (originalTokenId: string, newTitle: string, newDescription: string, newIpfsHash: string) => Promise<string>;
  recordGamePlay: (tokenId: string, score: number, duration: number) => Promise<void>;
  
  // Analytics
  getGameMetrics: (tokenId: string) => Promise<GameMetrics>;
  getStakingInfo: (tokenId: string) => Promise<StakingInfo>;
  getRoyaltyInfo: (tokenId: string) => Promise<RoyaltyInfo>;
  getTransactionHistory: () => Promise<Transaction[]>;
}

const GameFiContext = createContext<GameFiContextType | null>(null);

export function GameFiProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  // State
  const [contracts, setContracts] = useState<GameFiContracts | null>(null);
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [userGames, setUserGames] = useState<GameNFT[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);

  // Check if on CrossFi network
  const isCrossFi = chainId ? isCrossFiNetwork(chainId) : false;

  // Initialize contracts when connected to CrossFi
  useEffect(() => {
    if (isConnected && isCrossFi && typeof window !== 'undefined') {
      try {
        const { ethereum } = window as any;
        if (ethereum) {
          // In a real implementation, you'd use the actual provider
          // This is a simplified version for demonstration
          console.log('GameFi contracts would be initialized here');
          // const provider = new ethers.providers.Web3Provider(ethereum);
          // const signer = provider.getSigner();
          // const gamefiContracts = new GameFiContracts(provider, chainId, signer);
          // setContracts(gamefiContracts);
        }
      } catch (error) {
        console.error('Error initializing GameFi contracts:', error);
        toast.error('Failed to initialize GameFi contracts');
      }
    } else {
      setContracts(null);
    }
  }, [isConnected, isCrossFi, chainId]);

  // Load user data when contracts are ready
  useEffect(() => {
    if (contracts && address) {
      refreshBalance();
      refreshUserGames();
      refreshPortfolio();
    }
  }, [contracts, address]);

  // Functions
  const refreshBalance = async () => {
    if (!contracts || !address) return;
    
    setIsLoadingBalance(true);
    try {
      const balance = await contracts.getTokenBalance(address);
      setTokenBalance(balance);
    } catch (error) {
      console.error('Error loading token balance:', error);
      toast.error('Failed to load token balance');
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const refreshUserGames = async () => {
    if (!contracts || !address) return;
    
    setIsLoadingGames(true);
    try {
      const games = await contracts.getUserGames(address);
      setUserGames(games);
    } catch (error) {
      console.error('Error loading user games:', error);
      toast.error('Failed to load your games');
    } finally {
      setIsLoadingGames(false);
    }
  };

  const refreshPortfolio = async () => {
    if (!tokenBalance || !userGames.length) return;
    
    setIsLoadingPortfolio(true);
    try {
      // Calculate portfolio summary
      const totalValue = tokenBalance.balance;
      const totalStaked = '0'; // Would calculate from staking positions
      const totalEarnings = tokenBalance.totalEarned;
      const monthlyEarnings = '0'; // Would calculate from recent earnings
      
      const portfolio: PortfolioSummary = {
        totalValue,
        totalGames: userGames.length,
        totalStaked,
        totalEarnings,
        monthlyEarnings,
        portfolioChange: 0, // Would calculate 24h change
        breakdown: {
          gameAssets: '0', // Would calculate NFT values
          stakingRewards: tokenBalance.stakingTotal,
          tokenBalance: tokenBalance.availableBalance,
          pendingRewards: '0', // Would calculate pending rewards
        },
      };
      
      setPortfolioSummary(portfolio);
    } catch (error) {
      console.error('Error calculating portfolio:', error);
    } finally {
      setIsLoadingPortfolio(false);
    }
  };

  // Game operations
  const mintGameNFT = async (gameTitle: string, gameDescription: string, ipfsHash: string): Promise<string> => {
    if (!contracts) {
      toast.error(CROSSFI_ERRORS.CONTRACT_NOT_DEPLOYED);
      throw new Error('Contracts not initialized');
    }
    
    if (!isCrossFi) {
      toast.error(CROSSFI_ERRORS.NETWORK_NOT_SUPPORTED);
      throw new Error('Not on CrossFi network');
    }

    try {
      const tokenURI = `https://ipfs.io/ipfs/${ipfsHash}/metadata.json`;
      const tokenId = await contracts.mintGameNFT(gameTitle, gameDescription, ipfsHash, tokenURI);
      
      // Refresh user games
      await refreshUserGames();
      
      return tokenId;
    } catch (error) {
      console.error('Error minting game NFT:', error);
      throw error;
    }
  };

  const stakeOnGame = async (tokenId: string, amount: string): Promise<void> => {
    if (!contracts) throw new Error('Contracts not initialized');
    
    try {
      await contracts.stakeOnGame(tokenId, amount);
      
      // Refresh balance and portfolio
      await refreshBalance();
      await refreshPortfolio();
    } catch (error) {
      console.error('Error staking on game:', error);
      throw error;
    }
  };

  const unstakeFromGame = async (tokenId: string, amount: string): Promise<void> => {
    if (!contracts) throw new Error('Contracts not initialized');
    
    try {
      await contracts.unstakeFromGame(tokenId, amount);
      
      // Refresh balance and portfolio
      await refreshBalance();
      await refreshPortfolio();
    } catch (error) {
      console.error('Error unstaking from game:', error);
      throw error;
    }
  };

  const claimRoyalties = async (tokenId: string): Promise<void> => {
    if (!contracts) throw new Error('Contracts not initialized');
    
    try {
      await contracts.claimRoyalties(tokenId);
      
      // Refresh balance
      await refreshBalance();
    } catch (error) {
      console.error('Error claiming royalties:', error);
      throw error;
    }
  };

  const forkGame = async (
    originalTokenId: string, 
    newTitle: string, 
    newDescription: string, 
    newIpfsHash: string
  ): Promise<string> => {
    if (!contracts) throw new Error('Contracts not initialized');
    
    try {
      const newTokenURI = `https://ipfs.io/ipfs/${newIpfsHash}/metadata.json`;
      const newTokenId = await contracts.forkGame(
        originalTokenId,
        newTitle,
        newDescription,
        newIpfsHash,
        newTokenURI
      );
      
      // Refresh user games
      await refreshUserGames();
      
      return newTokenId;
    } catch (error) {
      console.error('Error forking game:', error);
      throw error;
    }
  };

  const recordGamePlay = async (tokenId: string, score: number, duration: number): Promise<void> => {
    if (!contracts || !address) throw new Error('Contracts not initialized');
    
    try {
      await contracts.recordGamePlay(tokenId, address, score, duration);
    } catch (error) {
      console.error('Error recording game play:', error);
      throw error;
    }
  };

  // Analytics functions (simplified implementations)
  const getGameMetrics = async (tokenId: string): Promise<GameMetrics> => {
    // In a real implementation, this would fetch from contracts/API
    return {
      tokenId,
      dailyPlays: Math.floor(Math.random() * 100),
      weeklyPlays: Math.floor(Math.random() * 500),
      monthlyPlays: Math.floor(Math.random() * 2000),
      totalPlays: Math.floor(Math.random() * 10000),
      averageScore: Math.floor(Math.random() * 10000),
      averagePlayTime: Math.floor(Math.random() * 300),
      retentionRate: Math.random() * 100,
      forkRate: Math.random() * 10,
      stakingRatio: Math.random() * 50,
      trending: Math.random() > 0.7,
      category: Math.random() > 0.5 ? 'rising' : 'stable',
    };
  };

  const getStakingInfo = async (tokenId: string): Promise<StakingInfo> => {
    if (!contracts || !address) throw new Error('Contracts not initialized');
    
    return await contracts.getStakingInfo(tokenId, address);
  };

  const getRoyaltyInfo = async (tokenId: string): Promise<RoyaltyInfo> => {
    if (!contracts) throw new Error('Contracts not initialized');
    
    const { royaltyData } = await contracts.getGameDetails(tokenId);
    return royaltyData;
  };

  const getTransactionHistory = async (): Promise<Transaction[]> => {
    // In a real implementation, this would fetch from a subgraph or indexer
    return [];
  };

  const contextValue: GameFiContextType = {
    // Connection state
    isConnected,
    isCrossFiNetwork: isCrossFi,
    chainId,
    address,
    
    // Contracts
    contracts,
    
    // Token & Balance
    tokenBalance,
    portfolioSummary,
    
    // User's games
    userGames,
    
    // Loading states
    isLoadingBalance,
    isLoadingGames,
    isLoadingPortfolio,
    
    // Functions
    refreshBalance,
    refreshUserGames,
    refreshPortfolio,
    
    // Game operations
    mintGameNFT,
    stakeOnGame,
    unstakeFromGame,
    claimRoyalties,
    forkGame,
    recordGamePlay,
    
    // Analytics
    getGameMetrics,
    getStakingInfo,
    getRoyaltyInfo,
    getTransactionHistory,
  };

  return (
    <GameFiContext.Provider value={contextValue}>
      {children}
    </GameFiContext.Provider>
  );
}

export function useGameFi() {
  const context = useContext(GameFiContext);
  if (!context) {
    throw new Error('useGameFi must be used within a GameFiProvider');
  }
  return context;
}

// Custom hook for CrossFi network detection
export function useCrossFiNetwork() {
  const chainId = useChainId();
  const isCrossFi = chainId ? isCrossFiNetwork(chainId) : false;
  
  return {
    isCrossFi,
    isMainnet: chainId === crossfiMainnet.id,
    isTestnet: chainId === crossfiTestnet.id,
    networkName: isCrossFi 
      ? chainId === crossfiMainnet.id 
        ? 'CrossFi Mainnet' 
        : 'CrossFi Testnet'
      : 'Unsupported Network',
  };
}