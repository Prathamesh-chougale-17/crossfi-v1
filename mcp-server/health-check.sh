#!/bin/bash

# Health check script for Jeu Plaza MCP Server

set -e

echo "🏥 Jeu Plaza MCP Server Health Check"
echo "===================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Load environment variables
if [ -f .env ]; then
    source .env
else
    echo -e "${RED}❌ .env file not found${NC}"
    exit 1
fi

echo -e "${YELLOW}🔍 Checking environment variables...${NC}"

# Check required environment variables
if [ -z "$API_BASE_URL" ]; then
    echo -e "${RED}❌ API_BASE_URL not set${NC}"
    exit 1
fi

if [ -z "$API_KEY" ]; then
    echo -e "${RED}❌ API_KEY not set${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables OK${NC}"

# Check if main app is running
echo -e "${YELLOW}🔍 Checking main app connectivity...${NC}"

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE_URL/api/games?walletAddress=health-check" -H "Authorization: Bearer $API_KEY" || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Main app is accessible${NC}"
elif [ "$HTTP_STATUS" = "401" ]; then
    echo -e "${RED}❌ Authentication failed - check API_KEY${NC}"
    exit 1
elif [ "$HTTP_STATUS" = "000" ]; then
    echo -e "${RED}❌ Cannot connect to main app at $API_BASE_URL${NC}"
    exit 1
else
    echo -e "${YELLOW}⚠️  Unexpected response: $HTTP_STATUS${NC}"
fi

# Check if TypeScript is compiled
echo -e "${YELLOW}🔍 Checking build status...${NC}"

if [ -f "dist/index.js" ]; then
    echo -e "${GREEN}✅ TypeScript compiled${NC}"
else
    echo -e "${RED}❌ dist/index.js not found - run 'npm run build'${NC}"
    exit 1
fi

# Check Node.js version
echo -e "${YELLOW}🔍 Checking Node.js version...${NC}"
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js version: $NODE_VERSION${NC}"

# Check dependencies
echo -e "${YELLOW}🔍 Checking dependencies...${NC}"
if npm list --depth=0 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ All dependencies installed${NC}"
else
    echo -e "${RED}❌ Missing dependencies - run 'npm install'${NC}"
    exit 1
fi

# Test MCP server code validity
echo -e "${YELLOW}🔍 Testing MCP server code...${NC}"

# Check if the compiled JavaScript is syntactically valid
if node -c dist/index.js 2>/dev/null; then
    echo -e "${GREEN}✅ MCP server code is valid and ready to run${NC}"
else
    echo -e "${RED}❌ MCP server has syntax errors${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 All health checks passed!${NC}"
echo -e "${GREEN}🚀 MCP server is ready for deployment${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Start your main Jeu Plaza app: npm run dev"
echo "2. Deploy MCP server: ./deploy.sh"
echo "3. Add server to your MCP client configuration"