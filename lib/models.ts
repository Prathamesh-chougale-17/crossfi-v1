import { ObjectId } from 'mongodb';

/**
 * Game model interface with wallet-based ownership
 */
export interface Game {
  _id?: ObjectId;
  name: string;
  walletAddress: string; // Owner's wallet address
  description?: string;
  currentCheckpointId?: string;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean; // Privacy setting (default: true)
  publishedToMarketplace: boolean; // Whether game is published to marketplace
  publishedToCommunity: boolean; // Whether game is published to community
  publishedAt?: Date; // When the game was first published
  tokenId?: string; // NFT token ID if tokenized
  tokenizedAt?: Date; // When the game was tokenized
  ipfsHash?: string; // IPFS hash for NFT metadata
}

export interface GameClient {
  _id?: string;
  name: string;
  description?: string;
  walletAddress: string;
  currentCheckpointId?: string;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean; // Privacy setting (default: true)
  publishedToMarketplace: boolean; // Whether game is published to marketplace
  publishedToCommunity: boolean; // Whether game is published to community
  publishedAt?: Date; // When the game was first published
  tokenId?: string; // NFT token ID if tokenized
  tokenizedAt?: Date; // When the game was tokenized
  ipfsHash?: string; // IPFS hash for NFT metadata
}

/**
 * Checkpoint model interface with wallet-based ownership (database version)
 */
export interface Checkpoint {
  _id?: ObjectId;
  gameId: string;
  walletAddress: string; // Owner's wallet address
  prompt: string;
  html: string;
  css: string;
  javascript: string;
  description: string;
  version: number;
  createdAt: Date;
}

/**
 * Client-safe checkpoint interface with string _id
 */
export interface CheckpointClient {
  _id?: string;
  gameId: string;
  walletAddress: string; // Owner's wallet address
  prompt: string;
  html: string;
  css: string;
  javascript: string;
  description: string;
  version: number;
  createdAt: Date;
}

/**
 * Database collection names
 */
export const COLLECTIONS = {
  GAMES: 'games',
  CHECKPOINTS: 'checkpoints'
} as const;

/**
 * Type for creating a new game (without generated fields)
 */
export type CreateGameData = Omit<Game, '_id'>;

/**
 * Type for creating a new checkpoint (without generated fields)
 */
export type CreateCheckpointData = Omit<Checkpoint, '_id' | 'createdAt'>;

/**
 * Type for updating a game (optional fields except wallet address and name)
 */
export type UpdateGameData = Partial<Omit<Game, '_id' | 'walletAddress' | 'createdAt'>> & {
  updatedAt: Date;
};

/**
 * Database utility functions
 */
import clientPromise from './mongodb';

export async function getDatabase() {
  const client = await clientPromise;
  return client.db();
}

export async function getGamesCollection() {
  const db = await getDatabase();
  return db.collection<Game>(COLLECTIONS.GAMES);
}

export async function getCheckpointsCollection() {
  const db = await getDatabase();
  return db.collection<Checkpoint>(COLLECTIONS.CHECKPOINTS);
}