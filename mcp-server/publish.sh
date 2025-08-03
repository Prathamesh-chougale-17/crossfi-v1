#!/bin/bash

# Jeu Plaza MCP Server Publishing Script

set -e

echo "📦 Publishing Jeu Plaza MCP Server to npm..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if user is logged into npm
if ! npm whoami > /dev/null 2>&1; then
    echo -e "${RED}❌ Not logged into npm. Please run 'npm login' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Logged into npm as: $(npm whoami)${NC}"

# Run health check first
echo -e "${YELLOW}🔍 Running health check...${NC}"
if ./health-check.sh; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed. Please fix issues before publishing.${NC}"
    exit 1
fi

# Build the project
echo -e "${YELLOW}🔨 Building project...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Update version (optional)
echo -e "${YELLOW}📝 Current version: $(npm pkg get version | tr -d '"')${NC}"
read -p "Do you want to update the version? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Select version bump type:"
    echo "1) patch (1.0.0 -> 1.0.1)"
    echo "2) minor (1.0.0 -> 1.1.0)"
    echo "3) major (1.0.0 -> 2.0.0)"
    read -p "Enter choice (1-3): " -n 1 -r
    echo
    
    case $REPLY in
        1) npm version patch ;;
        2) npm version minor ;;
        3) npm version major ;;
        *) echo "Invalid choice, keeping current version" ;;
    esac
fi

# Show what will be published
echo -e "${YELLOW}📋 Package contents:${NC}"
npm pack --dry-run

echo ""
read -p "Do you want to publish this package? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Publish to npm
    echo -e "${YELLOW}🚀 Publishing to npm...${NC}"
    npm publish
    
    if [ $? -eq 0 ]; then
        NEW_VERSION=$(npm pkg get version | tr -d '"')
        echo -e "${GREEN}🎉 Successfully published jeu-plaza-mcp-server@${NEW_VERSION}${NC}"
        echo ""
        echo -e "${YELLOW}📋 Users can now install with:${NC}"
        echo "npx jeu-plaza-mcp-server@latest"
        echo ""
        echo -e "${YELLOW}💡 MCP Configuration:${NC}"
        cat mcp-config-example.json
    else
        echo -e "${RED}❌ Publishing failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}📦 Publishing cancelled${NC}"
fi