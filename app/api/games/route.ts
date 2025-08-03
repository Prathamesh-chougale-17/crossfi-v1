import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateGameCode } from '@/ai/flows/generate-game-code';
import { z } from 'zod';

const CreateGameSchema = z.object({
    walletAddress: z.string().min(1, 'Wallet address is required'),
    name: z.string().min(1, 'Game name is required'),
    prompt: z.string().min(1, 'Game prompt is required'),
});

const API_KEY = process.env.MCP_API_KEY || 'your-secure-api-key';

function validateApiKey(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }
    const token = authHeader.substring(7);
    return token === API_KEY;
}

export async function POST(request: NextRequest) {
    try {
        // Validate API key
        if (!validateApiKey(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { walletAddress, name, prompt } = CreateGameSchema.parse(body);
        const client = await clientPromise;
        const db = client.db();
        const gamesCollection = db.collection('games');

        // Check if game already exists
        const existingGame = await gamesCollection.findOne({
            walletAddress,
            name,
        });

        if (existingGame) {
            return NextResponse.json(
                { error: 'Game already exists' },
                { status: 409 }
            );
        }

        // Generate game code using AI
        const gameCode = await generateGameCode({ prompt });

        const newGame = {
            name,
            walletAddress,
            html: gameCode.html,
            css: gameCode.css,
            javascript: gameCode.javascript,
            description: gameCode.description,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await gamesCollection.insertOne(newGame);

        return NextResponse.json({
            id: result.insertedId,
            name,
            description: gameCode.description,
        });
    } catch (error) {
        console.error('Error creating game:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.issues },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        // Validate API key
        if (!validateApiKey(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const walletAddress = searchParams.get('walletAddress');

        if (!walletAddress) {
            return NextResponse.json(
                { error: 'Wallet address is required' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const gamesCollection = db.collection('games');

        const games = await gamesCollection
            .find({ walletAddress })
            .project({ name: 1, description: 1, createdAt: 1, updatedAt: 1 })
            .toArray();

        return NextResponse.json(games);
    } catch (error) {
        console.error('Error listing games:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}