import { NextRequest, NextResponse } from 'next/server';
import { generateGameCode } from '@/ai/flows/generate-game-code';
import { z } from 'zod';
import clientPromise from '@/lib/mongodb';

const UpdateGameSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
  prompt: z.string().min(1, 'Update prompt is required'),
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameName: string }> }
) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const gameName = decodeURIComponent((await params).gameName);

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const gamesCollection = db.collection('games');

    const game = await gamesCollection.findOne({
      walletAddress,
      name: gameName,
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error('Error getting game:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ gameName: string }> }
) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { walletAddress, prompt } = UpdateGameSchema.parse(body);
    const gameName = decodeURIComponent((await params).gameName);

    const client = await clientPromise;
    const db = client.db();
    const gamesCollection = db.collection('games');

    // Find existing game
    const existingGame = await gamesCollection.findOne({
      walletAddress,
      name: gameName,
    });

    if (!existingGame) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    // Generate updated game code
    const updatedGameCode = await generateGameCode({
      prompt,
      previousHtml: existingGame.html,
      previousCss: existingGame.css,
      previousJs: existingGame.javascript,
    });

    const updateResult = await gamesCollection.updateOne(
      {
        walletAddress,
        name: gameName,
      },
      {
        $set: {
          html: updatedGameCode.html,
          css: updatedGameCode.css,
          javascript: updatedGameCode.javascript,
          description: updatedGameCode.description,
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json({
      name: gameName,
      description: updatedGameCode.description,
    });
  } catch (error) {
    console.error('Error updating game:', error);
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