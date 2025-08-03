#!/bin/bash

# Simple MCP Server Starter Script

echo "🚀 Starting Jeu Plaza MCP Server..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Load environment variables
if [ -f .env ]; then
    source .env
    echo -e "${GREEN}✅ Environment loaded${NC}"
else
    echo "❌ .env file not found. Please create it from .env.example"
    exit 1
fi

echo -e "${YELLOW}📋 MCP Server Configuration:${NC}"
echo "API Base URL: $API_BASE_URL"
echo "API Key: ${API_KEY:0:10}..."
echo ""

echo -e "${YELLOW}💡 For global usage, add this to your MCP client configuration:${NC}"
echo '{
  "mcpServers": {
    "jeu-plaza": {
      "command": "npx",
      "args": ["jeu-plaza-mcp-server@latest"],
      "env": {
        "API_BASE_URL": "'$API_BASE_URL'",
        "API_KEY": "'$API_KEY'"
      },
      "disabled": false,
      "autoApprove": ["list_games", "get_game"]
    }
  }
}'
echo ""
echo -e "${YELLOW}💡 For local development:${NC}"
cat mcp-config-example.json
echo ""

echo -e "${GREEN}🚀 Starting MCP server (Press Ctrl+C to stop)...${NC}"
echo ""

# Start the server
npm start