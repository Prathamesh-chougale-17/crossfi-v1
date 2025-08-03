#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Game schema matching the main app (for reference)
const GameSchema = z.object({
  name: z.string(),
  walletAddress: z.string(),
  html: z.string(),
  css: z.string(),
  javascript: z.string(),
  description: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

class JeuPlazaMCPServer {
  private server: Server;
  private apiBaseUrl: string;
  private apiKey: string;

  constructor() {
    this.server = new Server(
      {
        name: 'jeu-plaza-mcp-server',
        version: '1.0.0',
      }
    );

    this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    this.apiKey = process.env.API_KEY || 'your-secure-api-key-here';

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private async makeApiRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.apiBaseUrl}/api${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_game',
            description: 'Create a new game for a wallet address',
            inputSchema: {
              type: 'object',
              properties: {
                walletAddress: {
                  type: 'string',
                  description: 'The wallet address of the game owner',
                },
                gameName: {
                  type: 'string',
                  description: 'The name of the game to create',
                },
                gamePrompt: {
                  type: 'string',
                  description: 'Description of the game to generate',
                },
              },
              required: ['walletAddress', 'gameName', 'gamePrompt'],
            },
          },
          {
            name: 'update_game',
            description: 'Update an existing game for a wallet address',
            inputSchema: {
              type: 'object',
              properties: {
                walletAddress: {
                  type: 'string',
                  description: 'The wallet address of the game owner',
                },
                gameName: {
                  type: 'string',
                  description: 'The name of the game to update',
                },
                updatePrompt: {
                  type: 'string',
                  description: 'Description of changes to make to the game',
                },
              },
              required: ['walletAddress', 'gameName', 'updatePrompt'],
            },
          },
          {
            name: 'list_games',
            description: 'List all games for a wallet address',
            inputSchema: {
              type: 'object',
              properties: {
                walletAddress: {
                  type: 'string',
                  description: 'The wallet address to list games for',
                },
              },
              required: ['walletAddress'],
            },
          },
          {
            name: 'get_game',
            description: 'Get a specific game by wallet address and name',
            inputSchema: {
              type: 'object',
              properties: {
                walletAddress: {
                  type: 'string',
                  description: 'The wallet address of the game owner',
                },
                gameName: {
                  type: 'string',
                  description: 'The name of the game to retrieve',
                },
              },
              required: ['walletAddress', 'gameName'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_game':
            return await this.createGame(args as any);
          case 'update_game':
            return await this.updateGame(args as any);
          case 'list_games':
            return await this.listGames(args as any);
          case 'get_game':
            return await this.getGame(args as any);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    });
  }

  private async createGame(args: {
    walletAddress: string;
    gameName: string;
    gamePrompt: string;
  }) {
    try {
      const result = await this.makeApiRequest('/games', {
        method: 'POST',
        body: JSON.stringify({
          walletAddress: args.walletAddress,
          name: args.gameName,
          prompt: args.gamePrompt,
        }),
      });

      return {
        content: [
          {
            type: 'text',
            text: `Successfully created game "${args.gameName}" for wallet ${args.walletAddress}.\nGame ID: ${result.id}\nDescription: ${result.description}`,
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('409')) {
        return {
          content: [
            {
              type: 'text',
              text: `Game "${args.gameName}" already exists for wallet ${args.walletAddress}. Use update_game to modify it.`,
            },
          ],
        };
      }
      throw error;
    }
  }

  private async updateGame(args: {
    walletAddress: string;
    gameName: string;
    updatePrompt: string;
  }) {
    try {
      const result = await this.makeApiRequest(`/games/${encodeURIComponent(args.gameName)}`, {
        method: 'PUT',
        body: JSON.stringify({
          walletAddress: args.walletAddress,
          prompt: args.updatePrompt,
        }),
      });

      return {
        content: [
          {
            type: 'text',
            text: `Successfully updated game "${args.gameName}" for wallet ${args.walletAddress}.\nChanges: ${result.description}`,
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return {
          content: [
            {
              type: 'text',
              text: `Game "${args.gameName}" not found for wallet ${args.walletAddress}. Use create_game to create it first.`,
            },
          ],
        };
      }
      throw error;
    }
  }

  private async listGames(args: { walletAddress: string }) {
    try {
      const games = await this.makeApiRequest(`/games?walletAddress=${encodeURIComponent(args.walletAddress)}`);

      if (games.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No games found for wallet ${args.walletAddress}`,
            },
          ],
        };
      }

      const gamesList = games
        .map(
          (game: any) =>
            `• ${game.name} (Created: ${new Date(game.createdAt).toLocaleDateString()}, Updated: ${new Date(game.updatedAt).toLocaleDateString()})\n  ${game.description || 'No description'}`
        )
        .join('\n\n');

      return {
        content: [
          {
            type: 'text',
            text: `Games for wallet ${args.walletAddress}:\n\n${gamesList}`,
          },
        ],
      };
    } catch (error) {
      throw error;
    }
  }

  private async getGame(args: { walletAddress: string; gameName: string }) {
    try {
      const game = await this.makeApiRequest(`/games/${encodeURIComponent(args.gameName)}?walletAddress=${encodeURIComponent(args.walletAddress)}`);

      return {
        content: [
          {
            type: 'text',
            text: `Game: ${game.name}
Wallet: ${game.walletAddress}
Description: ${game.description || 'No description'}
Created: ${new Date(game.createdAt).toLocaleDateString()}
Updated: ${new Date(game.updatedAt).toLocaleDateString()}

HTML:
\`\`\`html
${game.html}
\`\`\`

CSS:
\`\`\`css
${game.css}
\`\`\`

JavaScript:
\`\`\`javascript
${game.javascript}
\`\`\``,
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return {
          content: [
            {
              type: 'text',
              text: `Game "${args.gameName}" not found for wallet ${args.walletAddress}`,
            },
          ],
        };
      }
      throw error;
    }
  }



  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Jeu Plaza MCP server running on stdio');
  }
}

const server = new JeuPlazaMCPServer();
server.run().catch(console.error);