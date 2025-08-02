# Jeu Plaza - AI-Powered Canvas Game Creation Platform

**Jeu Plaza** is a comprehensive Web3-enabled platform for creating AI-powered HTML5 Canvas games with wallet-based ownership and storage. The platform features a modern, visually stunning interface with professional design, comprehensive game management, and seamless Web3 integration.

## 🚀 Key Features

### 🎮 Canvas Game Creation & Management
- **Canvas-First AI Generation**: Generate complete HTML5 Canvas games from text prompts using Google AI (Genkit)
- **Professional Game Architecture**: AI creates games with `requestAnimationFrame` loops and proper Canvas 2D API usage
- **Visual Polish**: Modern, visually attractive games with vibrant colors, particle effects, and smooth animations
- **Canvas Architecture**: Games rendered entirely on a single `<canvas>` element with HTML UI overlays for controls
- **Real-time Code Editor**: Built-in canvas forge editor with live preview and syntax highlighting
- **Manual Save & Versioning**: Explicit checkpoint creation through AI generation dialog or manual save functionality
- **Cross-platform Games**: Generated games support both desktop (keyboard) and mobile (touch) controls with responsive canvas
- **Built-in Tank Shooter**: Professional multiplayer tank battle arena with free-to-play competition modes
- **Enhanced Games Library**: Modern games listing page with professional card-based layout, game ratings, and feature highlights
- **Game Discovery**: Dedicated games section at `/games` with enhanced visual design, animated backgrounds, and comprehensive game information
- **Rich Game Cards**: Professional game cards featuring screenshots, ratings, difficulty levels, player counts, and feature badges

### 🔐 Web3 Integration
- **Wallet-based Ownership**: Games are owned and stored using wallet addresses (RainbowKit/Wagmi)
- **Multi-Chain Support**: Ethereum, Polygon, Arbitrum, Base, and CrossFi networks
- **Secure Authentication**: Wallet connection required for game creation and management
- **Privacy Controls**: Games are private by default and associated with your wallet address
- **Decentralized Storage**: Your games are stored with blockchain-verified ownership

### 🌐 Platform Features
- **Stunning Landing Page**: Enhanced home page with animated backgrounds, gradient effects, and professional visual design
- **Interactive Hero Section**: Modern hero with animated elements, enhanced typography, and engaging call-to-action buttons
- **Feature Showcase**: Comprehensive sections highlighting AI generation, Web3 integration, and community features
- **Game Dashboard**: Personalized dashboard showing user's games with creation tools and analytics
- **Enhanced Marketplace**: Modern game discovery platform with search functionality and professional game cards
- **Community Hub**: Dedicated community page for exploring open source games and collaborating with developers
- **Game Export & Sharing**: Export games as standalone HTML files or share via encoded URLs

## 🛠 Technology Stack

### Core Framework
- **Next.js 15.4.5** with App Router
- **React 19.1.0** with TypeScript 5
- **Node.js** runtime environment

### Web3 Integration
- **RainbowKit 2.2.8** - Wallet connection UI
- **Wagmi 2.16.0** - React hooks for Ethereum
- **Viem 2.33.1** - TypeScript interface for Ethereum

### AI & Code Generation
- **Google AI Genkit 1.15.5** - AI flow orchestration
- **Firebase Genkit** - AI model integration
- Custom Canvas game generation flows

### Database & Storage
- **MongoDB 6.18.0** - Primary database
- Wallet-based ownership model
- Game and checkpoint collections

### UI & Styling
- **Tailwind CSS 4** - Utility-first styling with OKLCH color space and modern CSS architecture
- **Radix UI** - Accessible component primitives
- **Lucide React** - Modern icon library
- **Next Themes** - Dark/light mode support
- **Custom Design System** - OKLCH color space, comprehensive typography, and glass morphism effects

### Form & Validation
- **React Hook Form 7.61.1** - Form management
- **Zod 4.0.14** - Schema validation
- **Hookform Resolvers** - Form validation integration

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database
- Google AI API key for Genkit
- Web3 wallet (MetaMask, etc.)

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd jeu-plaza
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/jeu-plaza

# Google AI (for game generation)
GOOGLE_GENAI_API_KEY=your_google_ai_api_key

# Wallet Connect (optional)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Development (optional)
NEXT_PUBLIC_ENABLE_TESTNETS=true

# WebSocket Server (for multiplayer games - optional)
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8080
```

### 3. Database Setup

The application will automatically create the required MongoDB collections:
- `games` - Stores game metadata and ownership
- `checkpoints` - Stores game code versions and history

### 4. Additional Setup for Tank Shooter Game

The tank shooter game requires additional components that need to be implemented:

#### Optional API Endpoints
The Tank Shooter game can optionally integrate with additional API endpoints for enhanced features:

**Competition Analytics API** (`app/api/competition-stats/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return competition statistics and leaderboards
    return NextResponse.json({
      totalGames: 1250,
      activePlayers: 45,
      topPlayers: [
        { name: "TankMaster", score: 45230, kills: 23 },
        { name: "BulletStorm", score: 38940, kills: 19 }
      ]
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch stats'
    }, { status: 500 });
  }
}
```

#### WebSocket Hook (Already Implemented)
The `hooks/use-websocket.ts` hook is already implemented with the following features:

- **Offline-First Design**: Gracefully falls back to offline mode when connection fails
- **Simplified Connection**: Single connection attempt with immediate fallback to demo mode
- **Message Parsing**: Automatic JSON parsing with error handling
- **Type Safety**: Full TypeScript support with proper interfaces

```typescript
// Hook interface
interface UseWebSocketReturn {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: WebSocketMessage) => void;
  lastMessage: WebSocketMessage | null;
  disconnect: () => void;
}

// Usage
const { socket, isConnected, sendMessage, lastMessage, disconnect } = useWebSocket();
```

#### Missing Components That Need Implementation
The Tank Shooter game references several components that are not yet implemented. You'll need to create these:

**Optional Components for Enhanced Features:**
The Tank Shooter game is fully functional as-is, but can optionally integrate with additional components for enhanced features:

- `@/components/account/account-data-access` - Hook for player statistics tracking
- `@/components/app-header` - Application header component for navigation
- Player analytics functions for tracking game performance and statistics

**Example Implementation for Player Stats:**
```typescript
// components/account/player-stats.ts
export function usePlayerStatsQuery(playerName: string) {
  // Implement player statistics tracking here
  return {
    data: { 
      gamesPlayed: 25,
      totalKills: 150,
      bestScore: 45230,
      winRate: 0.68
    },
    isLoading: false,
    error: null
  };
}
```

**Required Game Engine Components (Already Implemented):**
- `lib/game-engine.ts` - Core game engine with Canvas rendering ✅
- `lib/sound-manager.ts` - Audio management system ✅
- `components/games/tankshooter/chat-panel.tsx` - Chat interface component ✅
- `components/games/tankshooter/upgrade-panel.tsx` - Player upgrade interface ✅
- `components/games/tankshooter/leaderboard.tsx` - Game leaderboard component ✅
- `components/games/tankshooter/game-over-screen.tsx` - Game over modal ✅
- `components/games/tankshooter/minimap.tsx` - Strategic minimap component ✅
- `components/games/tankshooter/sound-control-panel.tsx` - Audio controls ✅

#### WebSocket Server Setup
You'll need a WebSocket server for multiplayer functionality. Example using Node.js:

```javascript
// websocket-server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});
```

### 5. Run Development Server

```bash
# Start Next.js development server
npm run dev

# Start AI development server (in separate terminal)
npm run genkit:dev

# Or start AI server with file watching
npm run genkit:watch
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

## 🎮 User Flow

### AI Game Creation Flow
1. **Connect Wallet**: Connect your Web3 wallet (MetaMask, etc.)
2. **Create Game**: Use AI prompts to generate new games from the dashboard
3. **Edit & Preview**: View and modify generated code in the canvas forge editor with live preview
4. **Manual Save**: Save code changes directly as checkpoints or through AI generation dialog
5. **Version Control**: Access previous checkpoints and manage game versions
6. **Export & Share**: Export games as HTML files or share via encoded URLs

### Games Section Flow
1. **Enhanced Games Listing**: Navigate to `/games` to access the modern games library
   - **Visual Design**: Professional page with animated backgrounds, gradient effects, and glass morphism cards
   - **Hero Section**: Large gradient title with animated badges and game statistics display
   - **Game Statistics**: Live counters showing available games, free-to-play status, and AI-powered features
   - **Featured Games Section**: Curated games with "Premium Quality" badge and enhanced visual presentation
   - **Rich Game Cards**: Professional cards with hover effects, play button overlays, and comprehensive game information
   - **Game Metadata**: Each card displays ratings, difficulty levels, player counts, categories, and feature badges
   - **Interactive Elements**: Hover animations, scale effects, and smooth transitions throughout the interface
   - **Coming Soon Section**: Teaser for future games with animated status indicators
2. **Tank Shooter Access**: Navigate to `/games/tankshooter` to access the professional game lobby

### Tank Shooter Game Flow
1. **Access Game**: Navigate to `/games/tankshooter` to access the professional game lobby
2. **Configure Battle**: 
   - Enter your tank commander name (with real-time validation)
   - Select battle mode (Auto Select, Multiplayer, Competition, Bot Arena)
   - Choose tank class (Basic, Twin, Sniper, Machine Gun)
   - Pick game mode (Free For All, Team Deathmatch, Domination)
3. **Enter Battle**: Start playing immediately - no payments required
4. **Play Game**: Use WASD to move, mouse to aim/shoot, and compete for high scores
5. **Competition Mode**: Compete in free 8-player tournaments with AI bots

## 🏗 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page with user games dashboard
│   ├── games/             # Games section routes
│   │   ├── page.tsx       # Games listing page with card-based layout
│   │   └── tankshooter/page.tsx  # Built-in tank shooter game
│   ├── editor/            # Game editor routes
│   │   ├── page.tsx       # General editor interface (legacy)
│   │   └── [gameId]/page.tsx  # Individual game editor with wallet auth
│   ├── marketplace/       # Game marketplace routes
│   │   ├── page.tsx       # Marketplace listing page
│   │   └── [gameId]/page.tsx  # Individual game player page
│   ├── community/         # Community features routes
│   │   ├── page.tsx       # Community hub with open source projects
│   │   └── [gameId]/page.tsx  # Individual community project code view
│   └── layout.tsx         # Root layout with providers
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── canvas-forge/     # Game editor components
│   │   ├── CodeEditor.tsx    # Code editing interface
│   │   ├── Preview.tsx       # Game preview component
│   │   ├── Header.tsx        # Editor header with actions
│   │   └── GameGeneratorDialog.tsx  # AI generation dialog
│   ├── games/            # Built-in game components
│   │   └── tankshooter/  # Tank shooter game
│   │       └── game-canvas.tsx   # Main game component with multiplayer support
│   ├── header-wrapper.tsx      # Layout wrapper with navigation
│   ├── navbar.tsx              # Main navigation component
│   ├── user-games-section.tsx   # Dashboard games display
│   ├── create-game-dialog.tsx   # New game creation modal
│   ├── game-card.tsx           # Individual game card
│   └── game-grid.tsx           # Responsive games grid layout
├── lib/                  # Utilities and configurations
│   ├── wallet/          # Web3 wallet utilities and context
│   │   ├── index.ts     # Main wallet exports
│   │   ├── validation.ts # Wallet address validation
│   │   ├── wallet-context.tsx # React context for wallet state
│   │   └── rainbow-kit-client.ts # RainbowKit configuration
│   ├── actions.ts       # Server actions for database operations
│   ├── models.ts        # MongoDB data models (Game, Checkpoint)
│   ├── mongodb.ts       # Database connection singleton
│   └── chains.ts        # Blockchain network configurations
├── ai/                  # AI flows and Genkit configuration
│   ├── genkit.ts        # Genkit AI configuration
│   ├── dev.ts           # Development server setup
│   └── flows/generate-game-code.ts  # Game code generation flow
├── hooks/               # Custom React hooks
├── public/              # Static assets
└── .kiro/              # Kiro AI assistant configuration
```

## 🔧 Available Scripts

```bash
# Development
npm run dev                 # Start Next.js dev server
npm run genkit:dev         # Start Genkit AI development server
npm run genkit:watch       # Start Genkit with file watching

# Production
npm run build              # Build for production
npm run start              # Start production server

# Code Quality
npm run lint               # Run ESLint
```

## 🏗 Architecture Overview

### Database Models & Type Safety

The application uses a dual-model approach for type safety between server and client:

#### Server Models (Database)
- **`Game`**: Uses MongoDB `ObjectId` for `_id` field
- **`Checkpoint`**: Uses MongoDB `ObjectId` for `_id` field

#### Client Models (Frontend)
- **`GameClient`**: Uses `string` for `_id` field (converted from ObjectId)
- **`CheckpointClient`**: Uses `string` for `_id` field (converted from ObjectId)

This separation ensures type safety when passing data between server actions and React components.

### Server Actions Architecture

All server actions in `lib/actions.ts` follow consistent patterns:

#### Input Validation
- **Zod Schemas**: All inputs validated using Zod schemas
- **Wallet Address Validation**: Uses `WalletAddressSchema` for consistent address normalization
- **Type Safety**: Ensures data integrity before database operations

#### Ownership Verification
- **Wallet-based Access Control**: All operations verify wallet ownership
- **Security First**: Games and checkpoints can only be accessed by their owners
- **Privacy by Default**: All games are private unless explicitly published

#### Error Handling
- **Graceful Failures**: Comprehensive error handling with user-friendly messages
- **Validation Errors**: Detailed field-level error reporting
- **Database Errors**: Proper error logging and user feedback

## 🎨 Design System

### CSS Architecture

The design system is built on modern CSS architecture with Tailwind CSS 4 integration and OKLCH color space:

#### Tailwind CSS 4 Integration
```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-primary: var(--primary);
  --color-accent: var(--accent);
  --radius-lg: var(--radius);
}
```

#### OKLCH Color System
```css
:root {
  /* OKLCH Color Space for superior color management */
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.967 0.001 286.375);
  --accent: oklch(0.967 0.001 286.375);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.92 0.004 286.32);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.92 0.004 286.32);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
}
```

#### Typography System
- **Primary Display**: DotGothic16 for retro gaming aesthetic (applied to body)
- **UI Elements**: Geist Sans for modern, clean interface components
- **Code Display**: Geist Mono for technical content and canvas forge editor
- **Hybrid Approach**: Multiple fonts working together for optimal user experience

#### Visual Effects
- **Glass Morphism**: Backdrop blur effects with translucent backgrounds
- **OKLCH Gradients**: Smooth color transitions without muddy intermediate colors
- **Subtle Shadows**: 1px offset shadows with low opacity for refined depth
- **Modern Animations**: Scale effects, smooth transitions, and entrance animations

## 🎯 Key Components

### HeaderWrapper
Layout wrapper component that provides consistent navigation across pages:
- **Navbar Integration**: Automatically includes the main navigation bar with wallet connection and network switching
- **Layout Consistency**: Ensures all pages have consistent header structure across the platform
- **Simple API**: Takes children as props and wraps them with navigation
- **Usage**: `<HeaderWrapper>{page content}</HeaderWrapper>`
- **Current Usage**: Used in home page, marketplace listing, community hub, editor listing, and tank shooter game
- **Not Used**: Editor detail pages, game player pages, and community code viewer use custom headers for full-screen experiences

### UserGamesSection
Main dashboard component with enhanced visual design:
- **Streamlined Header**: Clean layout with gradient titles and status indicators
- **Checkpoint Analytics**: Smart counter showing total checkpoints across games
- **Enhanced Loading States**: Professional loading UI with progress indicators
- **Responsive Design**: Adaptive layout for all screen sizes

### Canvas Forge Editor
Professional game editing interface:
- **CodeEditor**: Syntax-highlighted editing for HTML, CSS, JavaScript
- **Preview**: Live game preview with responsive canvas
- **Header**: Editor controls with save functionality and navigation back button
- **GameGeneratorDialog**: AI-powered game generation interface

### Tank Shooter Game (GameCanvas)
Professional multiplayer tank shooter game with comprehensive features:

#### Game Modes
- **Multiplayer Mode**: Real-time multiplayer with WebSocket connections
- **Bot Arena Mode**: Single-player against AI-controlled bots
- **Competition Mode**: Free-to-play timed competitions with AI bots

#### Core Features
- **Real-time Combat**: Tank movement with WASD, mouse aiming and shooting
- **Health System**: Dynamic health bars with regeneration mechanics
- **Leveling System**: XP-based progression with damage scaling
- **Leaderboard**: Live rankings showing score, kills, and levels
- **Timer System**: Precise countdown with visual effects for final seconds

#### UI Components
- **HUD Overlay**: Comprehensive heads-up display with stats and timer
- **Chat System**: Real-time messaging with system notifications
- **Upgrade Panel**: Points-based progression system with 8 upgrade categories (Health Regen, Body Damage, Bullet Speed, Bullet Penetration, Bullet Damage, Reload, Movement Speed, Max Health)
- **Sound Controls**: Audio management with volume controls
- **Minimap**: Strategic overview of game area and player positions

#### Competition Features
- **Free to Play**: No entry fees or wallet requirements - completely free gaming experience
- **Competition Structure**: 8 players total (1 human + 7 AI bots) in 3-minute matches
- **Winner Determination**: Based on highest kills, with score as tiebreaker
- **Qualification System**: Minimum kill requirements for recognition (1 kill minimum)
- **Tournament Format**: Timed competitive matches with leaderboard rankings

#### Technical Implementation
- **Canvas Rendering**: Full HTML5 Canvas with game engine integration
- **WebSocket Integration**: Real-time multiplayer communication
- **State Management**: Comprehensive game state with React hooks
- **Performance Optimization**: RequestAnimationFrame-based timer system
- **Responsive Design**: Adaptive UI for different screen sizes

### Wallet Integration
Comprehensive Web3 wallet support:
- **WalletProvider**: React context for wallet state management
- **ConnectWalletButton**: Wallet connection UI with network switching
- **useRequireWallet**: Hook for wallet-protected components
- **Address Validation**: Zod schemas for wallet address validation

### Game Management
Complete game lifecycle management:
- **CreateGameDialog**: New game creation with form validation
- **GameCard**: Individual game display with metadata and status
- **GameGrid**: Responsive grid layout for game collections
- **Checkpoint System**: Version control for game code

### Enhanced Games Library Page
Modern, streamlined games listing interface at `/games`:

#### Visual Design & Layout
- **Animated Backgrounds**: Gradient backgrounds with animated blur effects and floating particles
- **Streamlined Header**: Clean, focused header with gradient title (4xl-5xl responsive) and concise description
- **Glass Morphism Cards**: Professional cards with backdrop blur, translucent backgrounds, and subtle borders
- **Responsive Grid**: 1 column on mobile, 2 on tablet, 3 on desktop with proper spacing and animations

#### Enhanced Game Cards
- **Rich Metadata**: Each card displays comprehensive game information including:
  - **Ratings**: Star ratings with numerical scores (e.g., 4.8/5)
  - **Difficulty Levels**: Visual difficulty indicators (Easy, Medium, Hard)
  - **Player Counts**: Supported player ranges (e.g., "1-8 Players")
  - **Categories**: Game genre badges (Action, Strategy, Puzzle, etc.)
  - **Feature Badges**: Highlight key features like "Multiplayer", "AI Bots", "Real-time Combat"
- **Status Badges**: "New" and "Featured" badges with custom styling and animations
- **Interactive Elements**: 
  - Hover effects with scale transforms and shadow enhancements
  - Play button overlays that appear on hover
  - Smooth color transitions and gradient effects

#### Advanced Card Features
- **Game Screenshots**: Professional game images with aspect-ratio control and gradient overlays (Tank Shooter features `/games/tankshooter.png`)
- **Play Button Overlay**: Animated play button that appears on card hover with backdrop blur
- **Feature Lists**: Organized display of game features with color-coded badges
- **Hover Animations**: Professional scale effects, shadow transitions, and color changes

#### Coming Soon Section
- **Future Games Teaser**: Dedicated section highlighting upcoming AI-generated games
- **Animated Status Indicators**: Pulsing dots showing development status
- **Feature Highlights**: Preview of upcoming features like "AI-Generated Games", "Free to Play", "Multiplayer Ready"

#### Technical Implementation
- **Staggered Animations**: Cards animate in with delays for smooth entrance effects
- **Performance Optimized**: Efficient animations using CSS transforms and transitions
- **Accessibility**: Proper ARIA labels, keyboard navigation, and screen reader support
- **Mobile Responsive**: Touch-friendly interface with appropriate sizing and spacing

## 🌐 Supported Networks

- **Ethereum Mainnet**
- **Polygon**
- **Arbitrum**
- **Base**
- **CrossFi Testnet**
- **Sepolia** (testnet)

## 🔒 Security & Privacy

- **Wallet-Based Authentication**: Secure ownership verification
- **Private by Default**: Games are private unless explicitly shared
- **Data Isolation**: Users can only access their own games
- **Secure Storage**: MongoDB with wallet address validation
- **Input Validation**: Comprehensive Zod schema validation

## 🎮 AI Game Generation

The AI specializes in creating HTML5 Canvas games with:
- **Complete Game Loops**: Uses `requestAnimationFrame` for smooth animation
- **Canvas 2D API**: Professional rendering with proper game architecture
- **Input Handling**: Keyboard and touch controls for cross-platform support
- **Responsive Design**: Games adapt to different screen sizes
- **Modern Patterns**: Clean, maintainable game code structure

### Example Prompts
- "Create a simple breakout game with a paddle and ball"
- "Make a space shooter with moving enemies and power-ups"
- "Build a platformer game with jumping and collision detection"
- "Design a puzzle game with drag-and-drop mechanics"

## 📚 Documentation

### Comprehensive Documentation
- **[Design System](docs/design-system.md)**: Complete design system documentation with OKLCH color space, typography, and component patterns
- **[Tank Shooter Game](docs/tank-shooter-game.md)**: Detailed technical documentation for the built-in multiplayer tank shooter game

### API Documentation
The tank shooter game requires additional API endpoints and components. See the [Tank Shooter Game Documentation](docs/tank-shooter-game.md) for complete implementation details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines
- Follow the existing code style and patterns
- Add tests for new features
- Update documentation for API changes
- Ensure wallet integration works across supported networks
- Test in both light and dark modes
- Test multiplayer functionality with WebSocket connections
- Verify competition mode prize distribution works correctly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)
- AI powered by [Google AI Genkit](https://firebase.google.com/docs/genkit)
- Web3 integration via [RainbowKit](https://www.rainbowkit.com/) and [Wagmi](https://wagmi.sh/)
- UI components from [Radix UI](https://www.radix-ui.com/) and [shadcn/ui](https://ui.shadcn.com/)
- Design system with OKLCH color space and modern CSS architecture