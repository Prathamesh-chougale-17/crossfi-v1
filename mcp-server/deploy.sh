#!/bin/bash

# Jeu Plaza MCP Server Deployment Script

set -e

echo "🚀 Starting Jeu Plaza MCP Server deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}📝 Please edit .env file with your configuration before continuing.${NC}"
    echo -e "${YELLOW}Press any key to continue after editing .env...${NC}"
    read -n 1 -s
fi

# Load environment variables
source .env

# Validate required environment variables
if [ -z "$API_BASE_URL" ] || [ -z "$API_KEY" ]; then
    echo -e "${RED}❌ Missing required environment variables. Please check your .env file.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables loaded${NC}"

# Build the project
echo -e "${YELLOW}🔨 Building TypeScript project...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Test the server connection
echo -e "${YELLOW}🔍 Testing connection to main app...${NC}"
if curl -f -s "$API_BASE_URL/api/games?walletAddress=test" -H "Authorization: Bearer $API_KEY" > /dev/null; then
    echo -e "${GREEN}✅ Connection to main app successful${NC}"
else
    echo -e "${RED}❌ Cannot connect to main app at $API_BASE_URL${NC}"
    echo -e "${YELLOW}Make sure your main Jeu Plaza app is running and accessible${NC}"
    exit 1
fi

# Start the MCP server
echo -e "${YELLOW}🚀 Starting MCP server...${NC}"

# Start server and capture initial output to verify it started
timeout 3s npm start 2>&1 | tee /tmp/mcp_startup.log &
MCP_PID=$!

# Wait a moment for server to start and produce output
sleep 2

# Check if server started successfully by looking for the startup message
if grep -q "Jeu Plaza MCP server running on stdio" /tmp/mcp_startup.log 2>/dev/null; then
    echo -e "${GREEN}✅ MCP server started successfully${NC}"
    echo -e "${GREEN}📋 Server is ready to accept MCP connections${NC}"
    echo -e "${YELLOW}💡 Add this server to your MCP client configuration:${NC}"
    echo ""
    cat mcp-config-example.json
    echo ""
    echo -e "${YELLOW}🔄 Starting server in foreground mode...${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
    echo ""
    
    # Clean up temp file
    rm -f /tmp/mcp_startup.log
    
    # Start server in foreground for actual use
    npm start
else
    echo -e "${RED}❌ Failed to start MCP server${NC}"
    if [ -f /tmp/mcp_startup.log ]; then
        echo -e "${YELLOW}Server output:${NC}"
        cat /tmp/mcp_startup.log
        rm -f /tmp/mcp_startup.log
    fi
    exit 1
fi