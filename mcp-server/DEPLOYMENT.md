# Jeu Plaza MCP Server Deployment Guide

This guide will help you deploy and test the Jeu Plaza MCP Server in different environments.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Your main Jeu Plaza app running on `http://localhost:3000`
- MongoDB connection configured in your main app

### 1. Setup Environment
```bash
cd mcp-server
cp .env.example .env
# Edit .env with your configuration
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build Project
```bash
npm run build
```

### 4. Health Check
```bash
npm run health
```

### 5. Deploy
```bash
npm run deploy
```

## 📋 Deployment Options

### Option 1: Local Development
Best for testing and development.

```bash
# Terminal 1: Start your main app
cd ..
npm run dev

# Terminal 2: Start MCP server
cd mcp-server
npm run dev
```

### Option 2: Production Deployment
For production use with built files.

```bash
npm run build
npm run health
npm run deploy
```

### Option 3: Docker Deployment
For containerized deployment.

```bash
# Build Docker image
npm run docker:build

# Start with Docker Compose
npm run docker:run

# Check logs
npm run docker:logs

# Stop containers
npm run docker:stop
```

## 🔧 Configuration

### Environment Variables (.env)
```env
# Required
API_BASE_URL=http://localhost:3000
API_KEY=jeu-plaza-mcp-secure-key-2024

# Optional
LOG_LEVEL=info
```

### MCP Client Configuration
Add this to your MCP client (e.g., Kiro IDE):

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
      "autoApprove": [
        "list_games",
        "get_game"
      ]
    }
  }
}
```

## 🧪 Testing

### Manual Testing
```bash
# Test server functionality
npm test

# Health check
npm run health
```

### Test Commands
Once connected to an MCP client, try these commands:

1. **List games for a wallet:**
   ```
   list_games with walletAddress: "0x1234567890abcdef1234567890abcdef12345678"
   ```

2. **Create a new game:**
   ```
   create_game with:
   - walletAddress: "0x1234567890abcdef1234567890abcdef12345678"
   - gameName: "My Pong Game"
   - gamePrompt: "Create a classic pong game with two paddles and a bouncing ball"
   ```

3. **Update an existing game:**
   ```
   update_game with:
   - walletAddress: "0x1234567890abcdef1234567890abcdef12345678"
   - gameName: "My Pong Game"
   - updatePrompt: "Add particle effects when the ball hits the paddles"
   ```

4. **Get game details:**
   ```
   get_game with:
   - walletAddress: "0x1234567890abcdef1234567890abcdef12345678"
   - gameName: "My Pong Game"
   ```

## 🔍 Troubleshooting

### Common Issues

#### 1. "Cannot connect to main app"
- Ensure your main Jeu Plaza app is running
- Check `API_BASE_URL` in `.env`
- Verify the app is accessible at the specified URL

#### 2. "Authentication failed"
- Check `API_KEY` matches between `.env` and main app's `.env.local`
- Ensure `MCP_API_KEY` is set in your main app's environment

#### 3. "MCP server failed to start"
- Run `npm run build` to compile TypeScript
- Check for syntax errors in the code
- Verify all dependencies are installed

#### 4. "Game creation fails"
- Check if your main app's AI flow is working
- Verify MongoDB connection in main app
- Check API endpoint responses

### Debug Mode
Enable detailed logging:

```bash
LOG_LEVEL=debug npm start
```

### Check Logs
```bash
# Docker logs
npm run docker:logs

# Local logs
tail -f logs/mcp-server.log
```

## 🔒 Security Notes

- The API key should be kept secure and not committed to version control
- Use HTTPS in production for `API_BASE_URL`
- Consider rate limiting on your main app's API endpoints
- Regularly rotate API keys

## 📊 Monitoring

### Health Checks
The server includes built-in health checks:

```bash
# Quick health check
npm run health

# Continuous monitoring
watch -n 30 npm run health
```

### Metrics
Monitor these key metrics:
- API response times
- Error rates
- Game creation/update success rates
- Memory usage

## 🚀 Production Deployment

### Recommended Setup
1. Use a process manager like PM2
2. Set up log rotation
3. Configure monitoring and alerting
4. Use environment-specific configurations
5. Set up automated backups

### PM2 Configuration
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/index.js --name jeu-plaza-mcp-server

# Save PM2 configuration
pm2 save
pm2 startup
```

## 📝 Maintenance

### Regular Tasks
- Monitor logs for errors
- Update dependencies regularly
- Test API connectivity
- Backup configurations
- Review and rotate API keys

### Updates
```bash
# Update dependencies
npm update

# Rebuild
npm run build

# Test
npm run health

# Redeploy
npm run deploy
```