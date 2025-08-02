'use server';

import { generateGameCode, type GenerateGameCodeInput, type GenerateGameCodeOutput } from '@/ai/flows/generate-game-code';
import { z } from 'zod';
import { ObjectId } from 'mongodb';
import {
    CheckpointClient,
    CreateGameData,
    CreateCheckpointData,
    getGamesCollection,
    getCheckpointsCollection,
    GameClient
} from './models';
import { WalletAddressSchema } from './wallet/validation';

const GenerateGameCodeInputSchema = z.object({
    prompt: z.string().describe('A description of the game concept.'),
    previousHtml: z.string().optional(),
    previousCss: z.string().optional(),
    previousJs: z.string().optional(),
});

// Validation schemas for game management
const CreateGameSchema = z.object({
    name: z.string().min(1, 'Game name is required').max(100, 'Game name must be less than 100 characters'),
    walletAddress: WalletAddressSchema,
    description: z.string().optional(),
});

const GetUserGamesSchema = z.object({
    walletAddress: WalletAddressSchema,
});

const GetGameByIdSchema = z.object({
    gameId: z.string().min(1, 'Game ID is required'),
    walletAddress: WalletAddressSchema,
});

const DeleteGameSchema = z.object({
    gameId: z.string().min(1, 'Game ID is required'),
    walletAddress: WalletAddressSchema,
});

// Validation schemas for checkpoint management
const SaveCheckpointSchema = z.object({
    gameId: z.string().min(1, 'Game ID is required'),
    walletAddress: WalletAddressSchema,
    prompt: z.string().min(1, 'Prompt is required'),
    html: z.string(),
    css: z.string(),
    javascript: z.string(),
    description: z.string(),
});

const GetGameCheckpointsSchema = z.object({
    gameId: z.string().min(1, 'Game ID is required'),
    walletAddress: WalletAddressSchema,
});

const DeleteCheckpointSchema = z.object({
    checkpointId: z.string().min(1, 'Checkpoint ID is required'),
    walletAddress: WalletAddressSchema,
});

// Validation schemas for pure data loading functions
const LoadGameDataSchema = z.object({
    gameId: z.string().min(1, 'Game ID is required'),
    walletAddress: WalletAddressSchema,
});

const SaveCodeChangesSchema = z.object({
    gameId: z.string().min(1, 'Game ID is required'),
    walletAddress: WalletAddressSchema,
    html: z.string(),
    css: z.string(),
    javascript: z.string(),
});

// Validation schemas for publishing
const PublishGameSchema = z.object({
    gameId: z.string().min(1, 'Game ID is required'),
    walletAddress: WalletAddressSchema,
    publishTo: z.enum(['marketplace', 'community']),
});

const UnpublishGameSchema = z.object({
    gameId: z.string().min(1, 'Game ID is required'),
    walletAddress: WalletAddressSchema,
    unpublishFrom: z.enum(['marketplace', 'community']),
});

const GetPublishedGamesSchema = z.object({
    publishedTo: z.enum(['marketplace', 'community']),
    limit: z.number().optional().default(50),
    offset: z.number().optional().default(0),
});

const GetPublishedGameByIdSchema = z.object({
    gameId: z.string().min(1, 'Game ID is required'),
    publishedTo: z.enum(['marketplace', 'community']),
});

export async function generateGame(input: GenerateGameCodeInput): Promise<GenerateGameCodeOutput> {
    const validatedInput = GenerateGameCodeInputSchema.parse(input);
    try {
        const result = await generateGameCode(validatedInput);
        return result;
    } catch (error) {
        console.error("Error generating game code:", error);
        throw new Error("Failed to generate game. The AI model might be unavailable.");
    }
}

/**
 * Enhanced generateGame function that integrates with the checkpoint system
 * Generates game code and optionally saves it as a checkpoint
 * @param input - Game generation input with optional checkpoint saving
 * @returns The generated game code output
 */
export async function generateGameWithCheckpoint(input: {
    prompt: string;
    previousHtml?: string;
    previousCss?: string;
    previousJs?: string;
    gameId?: string;
    walletAddress?: string;
    saveAsCheckpoint?: boolean;
}): Promise<GenerateGameCodeOutput & { checkpointId?: string }> {
    const gameInput: GenerateGameCodeInput = {
        prompt: input.prompt,
        previousHtml: input.previousHtml,
        previousCss: input.previousCss,
        previousJs: input.previousJs,
    };

    try {
        // Generate the game code using the AI flow
        const result = await generateGameCode(gameInput);

        // If checkpoint saving is requested and we have the required data
        if (input.saveAsCheckpoint && input.gameId && input.walletAddress) {
            try {
                const checkpoint = await saveCheckpoint({
                    gameId: input.gameId,
                    walletAddress: input.walletAddress,
                    prompt: input.prompt,
                    html: result.html,
                    css: result.css,
                    javascript: result.javascript,
                    description: result.description,
                });

                return {
                    ...result,
                    checkpointId: checkpoint._id?.toString(),
                };
            } catch (checkpointError) {
                console.error('Error saving checkpoint:', checkpointError);
                // Return the generated code even if checkpoint saving fails
                return result;
            }
        }

        return result;
    } catch (error) {
        console.error("Error generating game code:", error);
        throw new Error("Failed to generate game. The AI model might be unavailable.");
    }
}

/**
 * Creates a new game associated with a wallet address
 * @param input - Game creation data including name, wallet address, and optional description
 * @returns The created game object
 */
export async function createGame(input: {
    name: string;
    walletAddress: string;
    description?: string;
}): Promise<GameClient> {
    const validatedInput = CreateGameSchema.parse(input);

    try {
        const gamesCollection = await getGamesCollection();
        const now = new Date();

        const gameData: CreateGameData = {
            name: validatedInput.name,
            walletAddress: validatedInput.walletAddress,
            description: validatedInput.description,
            isPrivate: true, // Default to private
            publishedToMarketplace: false, // Default to not published
            publishedToCommunity: false, // Default to not published
            createdAt: now,
            updatedAt: now,
        };

        const result = await gamesCollection.insertOne(gameData);

        if (!result.insertedId) {
            throw new Error('Failed to create game');
        }

        return {
            ...gameData,
            _id: result.insertedId.toString(),
        };
    } catch (error) {
        console.error('Error creating game:', error);
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.issues.map((issue) => issue.message).join(', ')}`);
        }
        throw new Error('Failed to create game');
    }
}

/**
 * Retrieves all games owned by a specific wallet address
 * @param input - Object containing the wallet address
 * @returns Array of games owned by the wallet
 */
export async function getUserGames(input: {
    walletAddress: string;
}): Promise<GameClient[]> {
    const validatedInput = GetUserGamesSchema.parse(input);

    try {
        const gamesCollection = await getGamesCollection();

        const games = await gamesCollection
            .find({ walletAddress: validatedInput.walletAddress })
            .sort({ updatedAt: -1 }) // Most recently updated first
            .toArray();

        // Convert ObjectIds to strings for client consumption
        return games.map(game => ({
            _id: game._id?.toString(),
            name: game.name,
            walletAddress: game.walletAddress,
            description: game.description,
            currentCheckpointId: game.currentCheckpointId,
            createdAt: game.createdAt,
            updatedAt: game.updatedAt,
            isPrivate: game.isPrivate,
            publishedToMarketplace: game.publishedToMarketplace || false,
            publishedToCommunity: game.publishedToCommunity || false,
            publishedAt: game.publishedAt,
        }));
    } catch (error) {
        console.error('Error fetching user games:', error);
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.issues.map((issue) => issue.message).join(', ')}`);
        }
        throw new Error('Failed to fetch games');
    }
}

/**
 * Retrieves a specific game by ID with ownership verification
 * @param input - Object containing game ID and wallet address
 * @returns The game object if owned by the wallet, null if not found or not owned
 */
export async function getGameById(input: {
    gameId: string;
    walletAddress: string;
}): Promise<GameClient | null> {
    const validatedInput = GetGameByIdSchema.parse(input);

    try {
        const gamesCollection = await getGamesCollection();

        // Validate ObjectId format
        if (!ObjectId.isValid(validatedInput.gameId)) {
            return null;
        }

        const game = await gamesCollection.findOne({
            _id: new ObjectId(validatedInput.gameId),
            walletAddress: validatedInput.walletAddress, // Ownership verification
        });

        if (!game) {
            return null; // Game not found or not owned by this wallet
        }

        const gameWithId: GameClient = {
            _id: game._id.toString(),
            name: game.name,
            walletAddress: game.walletAddress,
            description: game.description,
            currentCheckpointId: game.currentCheckpointId,
            createdAt: game.createdAt,
            updatedAt: game.updatedAt,
            isPrivate: game.isPrivate,
            publishedToMarketplace: game.publishedToMarketplace || false,
            publishedToCommunity: game.publishedToCommunity || false,
            publishedAt: game.publishedAt,
        };

        return gameWithId;
    } catch (error) {
        console.error('Error fetching game by ID:', error);
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.issues.map((issue) => issue.message).join(', ')}`);
        }
        throw new Error('Failed to fetch game');
    }
}

/**
 * Deletes a game and all associated checkpoints with ownership validation
 * @param input - Object containing game ID and wallet address
 * @returns True if deletion was successful, false if game not found or not owned
 */
export async function deleteGame(input: {
    gameId: string;
    walletAddress: string;
}): Promise<boolean> {
    const validatedInput = DeleteGameSchema.parse(input);

    try {
        const gamesCollection = await getGamesCollection();
        const checkpointsCollection = await getCheckpointsCollection();

        // Validate ObjectId format
        if (!ObjectId.isValid(validatedInput.gameId)) {
            return false;
        }

        const gameObjectId = new ObjectId(validatedInput.gameId);

        // First verify ownership
        const game = await gamesCollection.findOne({
            _id: gameObjectId,
            walletAddress: validatedInput.walletAddress,
        });

        if (!game) {
            return false; // Game not found or not owned by this wallet
        }

        // Delete all associated checkpoints first
        await checkpointsCollection.deleteMany({
            gameId: gameObjectId.toString(),
            walletAddress: validatedInput.walletAddress, // Additional safety check
        });

        // Delete the game
        const deleteResult = await gamesCollection.deleteOne({
            _id: gameObjectId,
            walletAddress: validatedInput.walletAddress,
        });

        return deleteResult.deletedCount === 1;
    } catch (error) {
        console.error('Error deleting game:', error);
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.issues.map((issue) => issue.message).join(', ')}`);
        }
        throw new Error('Failed to delete game');
    }
}

/**
 * Saves a checkpoint for a game with wallet address validation
 * @param input - Checkpoint data including game ID, wallet address, and game code
 * @returns The created checkpoint object
 */
export async function saveCheckpoint(input: {
    gameId: string;
    walletAddress: string;
    prompt: string;
    html: string;
    css: string;
    javascript: string;
    description: string;
}): Promise<CheckpointClient> {
    const validatedInput = SaveCheckpointSchema.parse(input);

    try {
        const gamesCollection = await getGamesCollection();
        const checkpointsCollection = await getCheckpointsCollection();

        // Validate ObjectId format
        if (!ObjectId.isValid(validatedInput.gameId)) {
            throw new Error('Invalid game ID format');
        }

        const gameObjectId = new ObjectId(validatedInput.gameId);

        // First verify that the game exists and is owned by the wallet
        const game = await gamesCollection.findOne({
            _id: gameObjectId,
            walletAddress: validatedInput.walletAddress,
        });

        if (!game) {
            throw new Error('Game not found or not owned by this wallet');
        }

        // Get the current highest version number for this game
        const latestCheckpoint = await checkpointsCollection
            .findOne(
                { gameId: gameObjectId.toString() },
                { sort: { version: -1 } }
            );

        const nextVersion = latestCheckpoint ? latestCheckpoint.version + 1 : 1;

        const checkpointData: CreateCheckpointData = {
            gameId: gameObjectId.toString(),
            walletAddress: validatedInput.walletAddress,
            prompt: validatedInput.prompt,
            html: validatedInput.html,
            css: validatedInput.css,
            javascript: validatedInput.javascript,
            description: validatedInput.description,
            version: nextVersion,
        };

        const result = await checkpointsCollection.insertOne({
            ...checkpointData,
            createdAt: new Date(),
        });

        if (!result.insertedId) {
            throw new Error('Failed to save checkpoint');
        }

        // Update the game's updatedAt timestamp and currentCheckpointId
        await gamesCollection.updateOne(
            { _id: gameObjectId },
            {
                $set: {
                    updatedAt: new Date(),
                    currentCheckpointId: result.insertedId.toString()
                }
            }
        );

        return {
            ...checkpointData,
            _id: result.insertedId.toString(),
            createdAt: new Date(),
        };
    } catch (error) {
        console.error('Error saving checkpoint:', error);
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.issues.map((issue) => issue.message).join(', ')}`);
        }
        throw new Error('Failed to save checkpoint');
    }
}

/**
 * Retrieves all checkpoints for a game filtered by wallet ownership
 * @param input - Object containing game ID and wallet address
 * @returns Array of checkpoints for the game owned by the wallet
 */
export async function getGameCheckpoints(input: {
    gameId: string;
    walletAddress: string;
}): Promise<CheckpointClient[]> {
    const validatedInput = GetGameCheckpointsSchema.parse(input);

    try {
        const gamesCollection = await getGamesCollection();
        const checkpointsCollection = await getCheckpointsCollection();

        // Validate ObjectId format
        if (!ObjectId.isValid(validatedInput.gameId)) {
            return [];
        }

        const gameObjectId = new ObjectId(validatedInput.gameId);

        // First verify that the game exists and is owned by the wallet
        const game = await gamesCollection.findOne({
            _id: gameObjectId,
            walletAddress: validatedInput.walletAddress,
        });

        if (!game) {
            return []; // Game not found or not owned by this wallet
        }

        // Fetch checkpoints for this game and wallet
        const checkpoints = await checkpointsCollection
            .find({
                gameId: gameObjectId.toString(),
                walletAddress: validatedInput.walletAddress,
            })
            .sort({ version: -1 }) // Most recent version first
            .toArray();

        // Convert ObjectIds to strings for client consumption
        return checkpoints.map(checkpoint => ({
            ...checkpoint,
            _id: checkpoint._id?.toString(),
        }));
    } catch (error) {
        console.error('Error fetching game checkpoints:', error);
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.issues.map((issue) => issue.message).join(', ')}`);
        }
        throw new Error('Failed to fetch checkpoints');
    }
}

/**
 * Deletes a checkpoint with ownership verification
 * @param input - Object containing checkpoint ID and wallet address
 * @returns True if deletion was successful, false if checkpoint not found or not owned
 */
export async function deleteCheckpoint(input: {
    checkpointId: string;
    walletAddress: string;
}): Promise<boolean> {
    const validatedInput = DeleteCheckpointSchema.parse(input);

    try {
        const checkpointsCollection = await getCheckpointsCollection();
        const gamesCollection = await getGamesCollection();

        // Validate ObjectId format
        if (!ObjectId.isValid(validatedInput.checkpointId)) {
            return false;
        }

        const checkpointObjectId = new ObjectId(validatedInput.checkpointId);

        // First verify ownership by checking if the checkpoint belongs to this wallet
        const checkpoint = await checkpointsCollection.findOne({
            _id: checkpointObjectId,
            walletAddress: validatedInput.walletAddress,
        });

        if (!checkpoint) {
            return false; // Checkpoint not found or not owned by this wallet
        }

        // Delete the checkpoint
        const deleteResult = await checkpointsCollection.deleteOne({
            _id: checkpointObjectId,
            walletAddress: validatedInput.walletAddress,
        });

        if (deleteResult.deletedCount === 1) {
            // If this was the current checkpoint for the game, update the game
            const gameObjectId = new ObjectId(checkpoint.gameId);
            const game = await gamesCollection.findOne({
                _id: gameObjectId,
                currentCheckpointId: checkpointObjectId.toString(),
            });

            if (game) {
                // Find the most recent remaining checkpoint for this game
                const latestCheckpoint = await checkpointsCollection
                    .findOne(
                        { gameId: checkpoint.gameId },
                        { sort: { version: -1 } }
                    );

                // Update the game's current checkpoint
                await gamesCollection.updateOne(
                    { _id: gameObjectId },
                    {
                        $set: {
                            currentCheckpointId: latestCheckpoint?._id?.toString() || undefined,
                            updatedAt: new Date(),
                        }
                    }
                );
            }

            return true;
        }

        return false;
    } catch (error) {
        console.error('Error deleting checkpoint:', error);
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.issues.map((issue) => issue.message).join(', ')}`);
        }
        throw new Error('Failed to delete checkpoint');
    }
}

// ===== PURE DATA LOADING FUNCTIONS (NO AI GENERATION) =====

/**
 * Pure data loading function that retrieves game and checkpoint data without triggering AI generation
 * @param input - Object containing game ID and wallet address
 * @returns Game data with latest checkpoint code, or null if not found
 */
export async function loadGameData(input: {
    gameId: string;
    walletAddress: string;
}): Promise<{
    game: GameClient;
    checkpoints: CheckpointClient[];
    latestCode: {
        html: string;
        css: string;
        javascript: string;
    } | null;
} | null> {
    const validatedInput = LoadGameDataSchema.parse(input);

    try {
        // Load game details (this function already doesn't trigger AI generation)
        const game = await getGameById({
            gameId: validatedInput.gameId,
            walletAddress: validatedInput.walletAddress,
        });

        if (!game) {
            return null; // Game not found or not owned
        }

        // Load checkpoints (this function already doesn't trigger AI generation)
        const checkpoints = await getGameCheckpoints({
            gameId: validatedInput.gameId,
            walletAddress: validatedInput.walletAddress,
        });

        // Get latest code from the most recent checkpoint
        let latestCode: { html: string; css: string; javascript: string } | null = null;
        if (checkpoints.length > 0) {
            const latestCheckpoint = checkpoints[0]; // Already sorted by version desc
            latestCode = {
                html: latestCheckpoint.html,
                css: latestCheckpoint.css,
                javascript: latestCheckpoint.javascript,
            };
        }

        return {
            game,
            checkpoints,
            latestCode,
        };
    } catch (error) {
        console.error('Error loading game data:', error);
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.issues.map((issue) => issue.message).join(', ')}`);
        }
        throw new Error('Failed to load game data');
    }
}

/**
 * Pure function to get the latest game code from checkpoints without triggering AI generation
 * @param input - Object containing game ID and wallet address
 * @returns Latest code from checkpoints, or null if no checkpoints exist
 */
export async function getLatestGameCode(input: {
    gameId: string;
    walletAddress: string;
}): Promise<{
    html: string;
    css: string;
    javascript: string;
    version: number;
    checkpointId: string;
} | null> {
    const validatedInput = LoadGameDataSchema.parse(input);

    try {
        const checkpointsCollection = await getCheckpointsCollection();
        const gamesCollection = await getGamesCollection();

        // Validate ObjectId format
        if (!ObjectId.isValid(validatedInput.gameId)) {
            return null;
        }

        const gameObjectId = new ObjectId(validatedInput.gameId);

        // First verify that the game exists and is owned by the wallet
        const game = await gamesCollection.findOne({
            _id: gameObjectId,
            walletAddress: validatedInput.walletAddress,
        });

        if (!game) {
            return null; // Game not found or not owned by this wallet
        }

        // Get the most recent checkpoint
        const latestCheckpoint = await checkpointsCollection
            .findOne(
                {
                    gameId: gameObjectId.toString(),
                    walletAddress: validatedInput.walletAddress,
                },
                { sort: { version: -1 } }
            );

        if (!latestCheckpoint) {
            return null; // No checkpoints found
        }

        return {
            html: latestCheckpoint.html,
            css: latestCheckpoint.css,
            javascript: latestCheckpoint.javascript,
            version: latestCheckpoint.version,
            checkpointId: latestCheckpoint._id!.toString(),
        };
    } catch (error) {
        console.error('Error getting latest game code:', error);
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.issues.map((issue) => issue.message).join(', ')}`);
        }
        throw new Error('Failed to get latest game code');
    }
}

/**
 * Pure function to save code changes without triggering AI generation
 * Creates a simple save checkpoint for manual code edits
 * @param input - Object containing game ID, wallet address, and code
 * @returns The created checkpoint
 */
export async function saveCodeChanges(input: {
    gameId: string;
    walletAddress: string;
    html: string;
    css: string;
    javascript: string;
}): Promise<CheckpointClient> {
    const validatedInput = SaveCodeChangesSchema.parse(input);

    try {
        const gamesCollection = await getGamesCollection();
        const checkpointsCollection = await getCheckpointsCollection();

        // Validate ObjectId format
        if (!ObjectId.isValid(validatedInput.gameId)) {
            throw new Error('Invalid game ID format');
        }

        const gameObjectId = new ObjectId(validatedInput.gameId);

        // First verify that the game exists and is owned by the wallet
        const game = await gamesCollection.findOne({
            _id: gameObjectId,
            walletAddress: validatedInput.walletAddress,
        });

        if (!game) {
            throw new Error('Game not found or not owned by this wallet');
        }

        // Get the current highest version number for this game
        const latestCheckpoint = await checkpointsCollection
            .findOne(
                { gameId: gameObjectId.toString() },
                { sort: { version: -1 } }
            );

        const nextVersion = latestCheckpoint ? latestCheckpoint.version + 1 : 1;

        const checkpointData: CreateCheckpointData = {
            gameId: gameObjectId.toString(),
            walletAddress: validatedInput.walletAddress,
            prompt: 'Manual code save', // Simple prompt indicating this is a manual save
            html: validatedInput.html,
            css: validatedInput.css,
            javascript: validatedInput.javascript,
            description: 'Manual code changes saved', // Simple description
            version: nextVersion,
        };

        const result = await checkpointsCollection.insertOne({
            ...checkpointData,
            createdAt: new Date(),
        });

        if (!result.insertedId) {
            throw new Error('Failed to save code changes');
        }

        // Update the game's updatedAt timestamp and currentCheckpointId
        await gamesCollection.updateOne(
            { _id: gameObjectId },
            {
                $set: {
                    updatedAt: new Date(),
                    currentCheckpointId: result.insertedId.toString()
                }
            }
        );

        return {
            ...checkpointData,
            _id: result.insertedId.toString(),
            createdAt: new Date(),
        };
    } catch (error) {
        console.error('Error saving code changes:', error);
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.issues.map((issue) => issue.message).join(', ')}`);
        }
        throw new Error('Failed to save code changes');
    }
}

// ===== PUBLISHING FUNCTIONS =====

/**
 * Publishes a game to marketplace or community
 * @param input - Object containing game ID, wallet address, and publish destination
 * @returns True if publishing was successful
 */
export async function publishGame(input: {
    gameId: string;
    walletAddress: string;
    publishTo: 'marketplace' | 'community';
}): Promise<boolean> {
    const validatedInput = PublishGameSchema.parse(input);

    try {
        const gamesCollection = await getGamesCollection();

        // Validate ObjectId format
        if (!ObjectId.isValid(validatedInput.gameId)) {
            throw new Error('Invalid game ID format');
        }

        const gameObjectId = new ObjectId(validatedInput.gameId);

        // First verify that the game exists and is owned by the wallet
        const game = await gamesCollection.findOne({
            _id: gameObjectId,
            walletAddress: validatedInput.walletAddress,
        });

        if (!game) {
            throw new Error('Game not found or not owned by this wallet');
        }

        // Check if game has content (at least one checkpoint)
        const checkpointsCollection = await getCheckpointsCollection();
        const hasCheckpoints = await checkpointsCollection.findOne({
            gameId: gameObjectId.toString(),
            walletAddress: validatedInput.walletAddress,
        });

        if (!hasCheckpoints) {
            throw new Error('Cannot publish game without content. Please generate or add game code first.');
        }

        // Update the game's publishing status
        const updateFields: {
            updatedAt: Date;
            publishedToMarketplace?: boolean;
            publishedToCommunity?: boolean;
            publishedAt?: Date;
        } = {
            updatedAt: new Date(),
        };

        if (validatedInput.publishTo === 'marketplace') {
            updateFields.publishedToMarketplace = true;
        } else {
            updateFields.publishedToCommunity = true;
        }

        // Set publishedAt if this is the first time publishing
        if (!game.publishedToMarketplace && !game.publishedToCommunity) {
            updateFields.publishedAt = new Date();
        }

        const result = await gamesCollection.updateOne(
            { _id: gameObjectId },
            { $set: updateFields }
        );

        return result.modifiedCount === 1;
    } catch (error) {
        console.error('Error publishing game:', error);
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.issues.map((issue) => issue.message).join(', ')}`);
        }
        throw new Error('Failed to publish game');
    }
}

/**
 * Unpublishes a game from marketplace or community
 * @param input - Object containing game ID, wallet address, and unpublish source
 * @returns True if unpublishing was successful
 */
export async function unpublishGame(input: {
    gameId: string;
    walletAddress: string;
    unpublishFrom: 'marketplace' | 'community';
}): Promise<boolean> {
    const validatedInput = UnpublishGameSchema.parse(input);

    try {
        const gamesCollection = await getGamesCollection();

        // Validate ObjectId format
        if (!ObjectId.isValid(validatedInput.gameId)) {
            throw new Error('Invalid game ID format');
        }

        const gameObjectId = new ObjectId(validatedInput.gameId);

        // First verify that the game exists and is owned by the wallet
        const game = await gamesCollection.findOne({
            _id: gameObjectId,
            walletAddress: validatedInput.walletAddress,
        });

        if (!game) {
            throw new Error('Game not found or not owned by this wallet');
        }

        // Update the game's publishing status
        const updateFields: {
            updatedAt: Date;
            publishedToMarketplace?: boolean;
            publishedToCommunity?: boolean;
        } = {
            updatedAt: new Date(),
        };

        if (validatedInput.unpublishFrom === 'marketplace') {
            updateFields.publishedToMarketplace = false;
        } else {
            updateFields.publishedToCommunity = false;
        }

        const result = await gamesCollection.updateOne(
            { _id: gameObjectId },
            { $set: updateFields }
        );

        return result.modifiedCount === 1;
    } catch (error) {
        console.error('Error unpublishing game:', error);
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.issues.map((issue) => issue.message).join(', ')}`);
        }
        throw new Error('Failed to unpublish game');
    }
}

/**
 * Retrieves published games from marketplace or community
 * @param input - Object containing publish destination and pagination options
 * @returns Array of published games
 */
export async function getPublishedGames(input: {
    publishedTo: 'marketplace' | 'community';
    limit?: number;
    offset?: number;
}): Promise<GameClient[]> {
    const validatedInput = GetPublishedGamesSchema.parse(input);

    try {
        const gamesCollection = await getGamesCollection();

        const query: {
            publishedToMarketplace?: boolean;
            publishedToCommunity?: boolean;
        } = {};
        if (validatedInput.publishedTo === 'marketplace') {
            query.publishedToMarketplace = true;
        } else {
            query.publishedToCommunity = true;
        }

        const games = await gamesCollection
            .find(query)
            .sort({ publishedAt: -1, updatedAt: -1 }) // Most recently published first
            .skip(validatedInput.offset)
            .limit(validatedInput.limit)
            .toArray();

        return games.map(game => ({
            _id: game._id.toString(),
            name: game.name,
            walletAddress: game.walletAddress,
            description: game.description,
            currentCheckpointId: game.currentCheckpointId,
            createdAt: game.createdAt,
            updatedAt: game.updatedAt,
            isPrivate: game.isPrivate,
            publishedToMarketplace: game.publishedToMarketplace || false,
            publishedToCommunity: game.publishedToCommunity || false,
            publishedAt: game.publishedAt,
        }));
    } catch (error) {
        console.error('Error fetching published games:', error);
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.issues.map((issue) => issue.message).join(', ')}`);
        }
        throw new Error('Failed to fetch published games');
    }
}

/**
 * Retrieves a published game by ID for public viewing
 * @param input - Object containing game ID and publish source
 * @returns The published game with latest code, or null if not found or not published
 */
export async function getPublishedGameById(input: {
    gameId: string;
    publishedTo: 'marketplace' | 'community';
}): Promise<{
    game: GameClient;
    latestCode: {
        html: string;
        css: string;
        javascript: string;
        version: number;
    };
} | null> {
    const validatedInput = GetPublishedGameByIdSchema.parse(input);

    try {
        const gamesCollection = await getGamesCollection();
        const checkpointsCollection = await getCheckpointsCollection();

        // Validate ObjectId format
        if (!ObjectId.isValid(validatedInput.gameId)) {
            return null;
        }

        const gameObjectId = new ObjectId(validatedInput.gameId);

        // Find the game and verify it's published to the requested destination
        const query: {
            _id: ObjectId;
            publishedToMarketplace?: boolean;
            publishedToCommunity?: boolean;
        } = { _id: gameObjectId };
        if (validatedInput.publishedTo === 'marketplace') {
            query.publishedToMarketplace = true;
        } else {
            query.publishedToCommunity = true;
        }

        const game = await gamesCollection.findOne(query);

        if (!game) {
            return null; // Game not found or not published to the requested destination
        }

        // Get the latest checkpoint for this game
        const latestCheckpoint = await checkpointsCollection
            .findOne(
                { gameId: gameObjectId.toString() },
                { sort: { version: -1 } }
            );

        if (!latestCheckpoint) {
            return null; // No content available
        }

        const gameClient: GameClient = {
            _id: game._id.toString(),
            name: game.name,
            walletAddress: game.walletAddress,
            description: game.description,
            currentCheckpointId: game.currentCheckpointId,
            createdAt: game.createdAt,
            updatedAt: game.updatedAt,
            isPrivate: game.isPrivate,
            publishedToMarketplace: game.publishedToMarketplace || false,
            publishedToCommunity: game.publishedToCommunity || false,
            publishedAt: game.publishedAt,
        };

        return {
            game: gameClient,
            latestCode: {
                html: latestCheckpoint.html,
                css: latestCheckpoint.css,
                javascript: latestCheckpoint.javascript,
                version: latestCheckpoint.version,
            },
        };
    } catch (error) {
        console.error('Error fetching published game by ID:', error);
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.issues.map((issue) => issue.message).join(', ')}`);
        }
        throw new Error('Failed to fetch published game');
    }
}

/**
 * Creates a fork of a community game for the current user
 * @param input - Object containing original game ID and wallet address of the forker
 * @returns The created forked game
 */
export async function forkCommunityGame(input: {
    originalGameId: string;
    walletAddress: string;
    forkName?: string;
}): Promise<GameClient> {
    try {
        // First get the published community game
        const originalGameData = await getPublishedGameById({
            gameId: input.originalGameId,
            publishedTo: 'community',
        });

        if (!originalGameData) {
            throw new Error('Community game not found or not available for forking');
        }

        // Create a new game for the user
        const forkName = input.forkName || `Fork of ${originalGameData.game.name}`;
        const newGame = await createGame({
            name: forkName,
            walletAddress: input.walletAddress,
            description: `Forked from ${originalGameData.game.name} by ${originalGameData.game.walletAddress}`,
        });

        // Create the initial checkpoint with the original game's code
        await saveCheckpoint({
            gameId: newGame._id!,
            walletAddress: input.walletAddress,
            prompt: 'Forked from community game',
            html: originalGameData.latestCode.html,
            css: originalGameData.latestCode.css,
            javascript: originalGameData.latestCode.javascript,
            description: `Forked from ${originalGameData.game.name}`,
        });

        return newGame;
    } catch (error) {
        console.error('Error forking community game:', error);
        throw new Error('Failed to fork community game');
    }
}
