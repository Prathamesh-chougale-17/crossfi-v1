# Jeu Plaza MCP Server

An MCP (Model Context Protocol) server for managing games in the Jeu Plaza platform. This server allows users to create, update, and manage their canvas-based games using their wallet address through secure API endpoints.

## Features

- **create_game**: Create a new game for a wallet address
- **update_game**: Update an existing game with new requirements
- **list_games**: List all games owned by a wallet address
- **get_game**: Retrieve a specific game's code and details

## Security

This MCP server uses secure API endpoints instead of direct database access:
- All requests are authenticated using API keys
- Communication happens through your application's REST API
- No direct database credentials are exposed to users
- Rate limiting and validation handled by your main application

## Installation

```bash
cd mcp-server
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env` file in the mcp-server directory:

```env
# Base URL of your running Jeu Plaza application
API_BASE_URL=http://localhost:3000

# Secure API key (must match MCP_API_KEY in your main app's .env.local)
API_KEY=jeu-plaza-mcp-secure-key-2024
```

## Usage with MCP Client

### Tool: create_game

Creates a new game for a wallet address.

**Parameters:**
- `walletAddress` (string): The wallet address of the game owner
- `gameName` (string): The name of the game to create
- `gamePrompt` (string): Description of the game to generate

**Example:**
```json
{
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
  "gameName": "Space Invaders",
  "gamePrompt": "Create a space invaders game with moving aliens and a player ship that can shoot"
}
```

### Tool: update_game

Updates an existing game with new requirements.

**Parameters:**
- `walletAddress` (string): The wallet address of the game owner
- `gameName` (string): The name of the game to update
- `updatePrompt` (string): Description of changes to make

**Example:**
```json
{
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
  "gameName": "Space Invaders",
  "updatePrompt": "Add power-ups that increase fire rate and add particle effects when aliens are destroyed"
}
```

### Tool: list_games

Lists all games for a wallet address.

**Parameters:**
- `walletAddress` (string): The wallet address to list games for

### Tool: get_game

Retrieves a specific game's complete code and details.

**Parameters:**
- `walletAddress` (string): The wallet address of the game owner
- `gameName` (string): The name of the game to retrieve

## Integration with Main App

This MCP server communicates with your Jeu Plaza application through secure REST API endpoints:

- `POST /api/games` - Create new games
- `PUT /api/games/[gameName]` - Update existing games  
- `GET /api/games` - List games by wallet address
- `GET /api/games/[gameName]` - Get specific game details

Games created or updated through the MCP server are immediately available in the web interface since they use the same backend API.

## API Endpoints

The main application includes these new API routes for MCP integration:

- **Authentication**: All requests require `Authorization: Bearer <API_KEY>` header
- **Validation**: Request data is validated using Zod schemas
- **AI Integration**: Uses your existing `generateGameCode` flow for game creation/updates
- **Error Handling**: Proper HTTP status codes and error messages

## Setup Instructions

### Option 1: Global Installation with npx (Recommended)

1. **Start your main Jeu Plaza application:**
```bash
npm run dev  # Main app should be running on http://localhost:3000
```

2. **Add to your MCP client configuration:**
```json
{
  "mcpServers": {
    "jeu-plaza": {
      "command": "npx",
      "args": ["jeu-plaza-mcp-server@latest"],
      "env": {
        "API_BASE_URL": "http://localhost:3000",
        "API_KEY": "jeu-plaza-mcp-secure-key-2024"
      },
      "disabled": false,
      "autoApprove": ["list_games", "get_game"]
    }
  }
}
```

3. **The server will be automatically downloaded and run by npx when needed!**

### Option 2: Local Development

1. **Configure MCP server:**
```bash
cd mcp-server
cp .env.example .env
# Edit .env with your API_BASE_URL and API_KEY
```

2. **Install and run MCP server:**
```bash
npm install
npm run build
npm start
```

3. **Add to your MCP client configuration:**
```json
{
  "mcpServers": {
    "jeu-plaza": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "./mcp-server",
      "env": {
        "API_BASE_URL": "http://localhost:3000",
        "API_KEY": "jeu-plaza-mcp-secure-key-2024"
      },
      "disabled": false,
      "autoApprove": ["list_games", "get_game"]
    }
  }
}
```

## Notes

- Uses your existing AI flow from `ai/flows/generate-game-code.ts`
- All games are canvas-based following the platform's architecture
- Wallet addresses are used as the primary ownership mechanism
- Secure API communication with proper authentication
- No direct database access - all operations go through your app's API layer