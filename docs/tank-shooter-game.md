# Tank Shooter Game Documentation

## Overview

The Tank Shooter Game is a professional multiplayer HTML5 Canvas game built into Jeu Plaza. It demonstrates advanced game development patterns, real-time multiplayer functionality, and provides a completely free-to-play gaming experience with no wallet requirements or entry fees.

## Game Features

### Enhanced Games Section Integration
- **Modern Games Library**: Located at `/games` with professional visual design and enhanced user experience
- **Visual Design**: Animated backgrounds, gradient effects, glass morphism cards, and smooth transitions
- **Hero Section**: Large gradient title with animated badges and comprehensive game statistics dashboard
- **Rich Game Cards**: Professional cards featuring:
  - **Comprehensive Metadata**: Ratings (4.8/5), difficulty levels, player counts, categories, and feature badges
  - **Interactive Elements**: Hover effects, play button overlays, scale transforms, and shadow enhancements
  - **Status Badges**: "New" and "Featured" badges with custom styling and animations
  - **Feature Highlights**: Color-coded badges for "Multiplayer", "AI Bots", "Real-time Combat", "Multiple Modes"
- **Enhanced Tank Shooter Card**: Features comprehensive game information including:
  - **Game Screenshot**: Professional game image at `/games/tankshooter.png` with aspect-ratio control and gradient overlays
  - **Rating**: 4.8/5 star rating with visual indicators
  - **Category**: Action genre with difficulty level (Medium)
  - **Player Support**: "1-8 Players" with multiplayer capabilities
  - **Feature List**: Organized display of key features with color-coded badges
- **Coming Soon Section**: Teaser for future AI-generated games with animated status indicators
- **Direct Access**: Professional "Play Now" buttons with gradient styling and hover animations
- **Mobile Responsive**: Touch-friendly interface with appropriate sizing and spacing

### Game Lobby Interface
- **Professional Game Lobby**: Comprehensive pre-game interface with animated backgrounds and visual effects
- **Player Configuration**: Name input with character limits and real-time validation
- **Battle Mode Selection**: Choose from Auto Select, Multiplayer, Competition, or Bot Arena modes
- **Tank Class Selection**: Multiple tank classes with different stats and abilities
- **Game Mode Selection**: Free For All, Team Deathmatch, and Domination modes
- **Server Status Display**: Live connection status with online player counts and server statistics
- **Free to Play**: No entry fees or wallet requirements - completely free gaming experience

### Core Gameplay
- **Real-time Combat**: Tank movement with WASD controls, mouse aiming and shooting
- **Health System**: Dynamic health bars with automatic regeneration when not shooting (3-second cooldown)
- **Leveling System**: XP-based progression (1000 points per level) with damage scaling (50 + (level-1) * 10)
- **Timer System**: 3-minute matches with precise countdown and visual effects (final 10 seconds show enhanced animations)
- **Cross-platform**: Responsive design supporting both desktop and mobile devices
- **Auto-fire Mode**: Toggle with 'E' key for continuous shooting
- **Fire Rate Limiting**: 300ms cooldown between shots (3.33 shots per second)

### Game Modes

#### 1. Multiplayer Mode
- Real-time multiplayer using WebSocket connections
- Live player synchronization and state management
- Chat system for player communication
- Dynamic leaderboard showing all connected players

#### 2. Bot Arena Mode
- Single-player mode against AI-controlled bots
- Continuous bot spawning for endless gameplay
- Difficulty scaling based on player performance
- Offline gameplay when WebSocket is unavailable

#### 3. Competition Mode
- Timed competitive matches (3 minutes)
- 8-player tournaments (1 human + 7 AI bots)
- Qualification system based on minimum kills
- Free to play with no entry requirements

## Technical Architecture

### Component Structure

```typescript
// Main game component
GameCanvas({
  playerName: string;
  playerAddress: string;
  tankClass: string;
  gameMode: string;
  playMode: "multiplayer" | "bots" | "competition";
  onBackToMenu: () => void;
})
```

### State Management

The game uses React hooks for comprehensive state management:

```typescript
// Core game statistics
const [gameStats, setGameStats] = useState({
  score: number;
  level: number;
  kills: number;
  health: number;
  maxHealth: number;
  isRegenerating: boolean;
});

// Timer system
const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes
const [timerActive, setTimerActive] = useState(false);

// UI state
const [showChat, setShowChat] = useState(false);
const [showUpgrades, setShowUpgrades] = useState(false);
const [showLeaderboard, setShowLeaderboard] = useState(true);
const [showSoundControls, setShowSoundControls] = useState(false);

// Game over handling
const [gameOverData, setGameOverData] = useState<GameOverData | null>(null);
const [isGameOver, setIsGameOver] = useState(false);

// Leaderboard data with tank information
const [leaderboardData, setLeaderboardData] = useState<{
  tanks: Map<string, Tank>;
  playerId: string;
} | undefined>(undefined);

// Chat messages with different types
const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
  {
    id: "welcome",
    playerName: "System",
    message: "Welcome to the game! Use WASD to move and mouse to aim.",
    timestamp: Date.now(),
    type: "system",
  },
]);
```

### Timer System

The game implements a high-precision timer using `requestAnimationFrame`:

```typescript
// Timer reference for performance optimization
const timerRef = useRef<{
  startTime: number;
  endTime: number;
  lastSecondUpdate: number;
  animationFrameId?: number;
}>({
  startTime: Date.now(),
  endTime: Date.now() + 180 * 1000,
  lastSecondUpdate: 180,
});

// Precise timer update function
const updateTimer = () => {
  const now = Date.now();
  const remaining = Math.max(0, timerRef.current.endTime - now);
  const remainingSeconds = Math.ceil(remaining / 1000);

  // Update state only when seconds change
  if (remainingSeconds !== timerRef.current.lastSecondUpdate) {
    timerRef.current.lastSecondUpdate = remainingSeconds;
    setTimeRemaining(remainingSeconds);
  }

  // Continue animation loop
  timerRef.current.animationFrameId = requestAnimationFrame(updateTimer);
};
```

## UI Components

### HUD Overlay
Comprehensive heads-up display showing:
- Real-time countdown timer with visual effects
- Player statistics (level, score, kills, damage)
- Experience progress bar for next level
- Connection status indicators
- Game mode indicators

### Health Bar System
Advanced health visualization using Shadcn Progress component:

```typescript
const healthPercentage = (gameStats.health / gameStats.maxHealth) * 100;

<Progress
  value={Math.max(0, healthPercentage)}
  className={`h-3 ${
    healthPercentage > 75
      ? "bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-green-500"
      : healthPercentage > 50
      ? "bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-green-400"
      : healthPercentage > 25
      ? "bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-orange-400 [&>div]:to-yellow-400"
      : healthPercentage > 0
      ? "bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-orange-400"
      : "bg-gray-700 [&>div]:bg-gray-600"
  }`}
/>
```

### Interactive Panels
- **Chat Panel**: Real-time messaging with system notifications
- **Upgrade Panel**: Points-based progression system with 8 upgrade categories
- **Leaderboard**: Live rankings with score, kills, and levels
- **Sound Controls**: Audio management with volume controls
- **Minimap**: Strategic overview of game area and player positions

### Upgrade System

The game features a comprehensive upgrade system with multiple enhancement categories:

```typescript
interface UpgradeOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  cost: number;
  maxLevel: number;
  currentLevel: number;
}

// Upgrade categories available
const upgrades = [
  {
    id: "health",
    name: "Health Regen",
    description: "Increases health regeneration rate",
    cost: 1,
    maxLevel: 7,
  },
  {
    id: "damage",
    name: "Body Damage", 
    description: "Increases collision damage",
    cost: 1,
    maxLevel: 7,
  },
  {
    id: "bullet-speed",
    name: "Bullet Speed",
    description: "Increases projectile velocity", 
    cost: 1,
    maxLevel: 7,
  },
  {
    id: "bullet-penetration",
    name: "Bullet Penetration",
    description: "Bullets can pierce through objects",
    cost: 1,
    maxLevel: 7,
  },
  {
    id: "bullet-damage", 
    name: "Bullet Damage",
    description: "Increases bullet damage",
    cost: 1,
    maxLevel: 7,
  },
  {
    id: "reload",
    name: "Reload",
    description: "Increases firing rate",
    cost: 1,
    maxLevel: 7,
  },
  {
    id: "movement-speed",
    name: "Movement Speed", 
    description: "Increases tank movement speed",
    cost: 1,
    maxLevel: 7,
  },
  {
    id: "max-health",
    name: "Max Health",
    description: "Increases maximum health",
    cost: 1,
    maxLevel: 7,
  },
];
```

#### Upgrade Points System
- **Point Generation**: Players earn 1 upgrade point per 1000 score points
- **Point Cost**: Each upgrade level costs 1 point
- **Maximum Levels**: All upgrades can be enhanced up to level 7
- **Progress Tracking**: Visual progress bars show current level vs maximum level

#### Upgrade Panel Interface
```typescript
interface UpgradePanelProps {
  playerStats: PlayerStats;
  onUpgrade: (upgradeType: string) => void;
}

// Usage in game
<UpgradePanel 
  playerStats={gameStats}
  onUpgrade={handleUpgrade}
/>
```

The upgrade panel features:
- **Compact Design**: 80-unit width with scrollable content
- **Visual Indicators**: Purple-themed UI with progress bars
- **Point Display**: Shows available upgrade points in header badge
- **Interactive Buttons**: Plus icons for purchasing upgrades
- **Level Progress**: Individual progress bars for each upgrade category

## WebSocket Integration

### Connection Management

The game uses a simplified WebSocket hook optimized for offline-first gameplay:

```typescript
const { socket, isConnected, sendMessage, lastMessage, disconnect } = useWebSocket();

// Connection state tracking
useEffect(() => {
  // Connection status tracking without notifications
}, [isConnected, playMode]);

// Message handling
if (socket) {
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    // Handle different message types
    switch (data.type) {
      case "chatMessage":
        setChatMessages(prev => [...prev, data.message]);
        break;
      case "playerUpdate":
        gameEngine.handleServerMessage(data);
        break;
      case "gameState":
        updateGameState(data);
        break;
    }
  };
}
```

#### WebSocket Hook Features

- **Offline-First Design**: Gracefully falls back to offline mode when connection fails
- **Simplified Connection**: Single connection attempt with immediate fallback
- **Message Parsing**: Automatic JSON parsing with error handling
- **Graceful Cleanup**: Proper cleanup on component unmount
- **Type Safety**: Full TypeScript support with proper interfaces

#### Hook Interface

```typescript
interface UseWebSocketReturn {
    socket: WebSocket | null;
    isConnected: boolean;
    sendMessage: (message: WebSocketMessage) => void;
    lastMessage: WebSocketMessage | null;
    disconnect: () => void;
}
```

### Message Types

```typescript
// Chat message
{
  type: "chat";
  message: string;
  playerName: string;
  playerId: string;
}

// Player upgrade
{
  type: "upgrade";
  upgradeType: string;
  playerId: string;
}

// Game state update
{
  type: "gameState";
  tanks: Tank[];
  projectiles: Projectile[];
  timestamp: number;
}
```

## Competition Mode

### Configuration

```typescript
const competitionConfig = {
  playerCount: 8,       // 8 players (1 human + 7 bots)
  minKillsForRecognition: 1,  // Minimum 1 kill required for recognition
  duration: 180,        // 3 minutes
  isFreeToPlay: true,   // No entry fees required
};
```

### Competition Results

The game provides comprehensive competition results and statistics:

```typescript
const handleCompetitionEnd = (winner: string, playerStats: PlayerStats) => {
  const competitionResults = {
    winner: winner,
    playerPerformance: {
      kills: playerStats.kills,
      score: playerStats.score,
      survivalTime: playerStats.survivalTime,
      qualified: playerStats.kills >= competitionConfig.minKillsForRecognition
    },
    leaderboard: getCompetitionLeaderboard(),
    duration: competitionConfig.duration
  };

  // Display results to player
  showCompetitionResults(competitionResults);
};
```

## Game Engine Integration

### Required Dependencies

The game requires several components, some of which are implemented and others that need to be created:

#### Implemented Components ✅
```typescript
// Core game engine (implemented)
import { GameEngine } from '@/lib/game-engine';
import { getSoundManager } from '@/lib/sound-manager';

// UI components (implemented)
import { ChatPanel } from '@/components/games/tankshooter/chat-panel';
import { UpgradePanel } from '@/components/games/tankshooter/upgrade-panel';
import { Leaderboard } from '@/components/games/tankshooter/leaderboard';
import { GameOverScreen } from '@/components/games/tankshooter/game-over-screen';
import { Minimap } from '@/components/games/tankshooter/minimap';
import { SoundControlPanel } from '@/components/games/tankshooter/sound-control-panel';

// Custom hooks (implemented)
import { useWebSocket } from '@/hooks/use-websocket';
```

#### Optional Components for Enhanced Features ⚠️
The Tank Shooter game is fully functional as-is, but can optionally integrate with additional components for enhanced features:

```typescript
// Optional analytics components
import { usePlayerStatsQuery } from '@/components/analytics/player-stats';
import { AppHeader } from '@/components/app-header';

// Optional utilities for enhanced features
// These can provide: player statistics, leaderboards, achievements
```

**Example Implementation for Optional Components:**
```typescript
// components/analytics/player-stats.ts
export function usePlayerStatsQuery(playerName: string) {
  // Implement player statistics tracking
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

// components/app-header.tsx
export function AppHeader({ links }: { links: any[] }) {
  return (
    <header className="w-full bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Tank Shooter</h1>
        {/* Add navigation and player stats */}
      </div>
    </header>
  );
}

// Optional analytics functions
export function trackPlayerPerformance(playerName: string, gameStats: GameStats) {
  // Track player performance for leaderboards and achievements
  console.log(`Player ${playerName} scored ${gameStats.score} points`);
}

export function getGlobalLeaderboard() {
  // Return global leaderboard data
  return [
    { name: "TankMaster", score: 45230, kills: 23 },
    { name: "BulletStorm", score: 38940, kills: 19 }
  ];
}
```

### Game Engine Interface

```typescript
interface GameEngineOptions {
  playerName: string;
  tankClass: string;
  gameMode: string;
  sendMessage?: (message: any) => void;
  enableBots: boolean;
  onStatsUpdate: (stats: GameStats) => void;
  onGameOver: (data: GameOverData) => void;
  isCompetitionMode?: boolean;
  competitionDuration?: number;
}

class GameEngine {
  constructor(canvas: HTMLCanvasElement, options: GameEngineOptions);
  
  start(): void;
  stop(): void;
  restart(): void;
  handleResize(): void;
  handleServerMessage(data: any): void;
  upgradePlayer(upgradeType: string): void;
  getPlayerId(): string;
  getGameState(): GameState;
  getMultiplayerTanks(): Map<string, Tank>;
  getCompetitionParticipants(): Map<string, Tank>;
}
```

## Performance Optimizations

### Timer Optimization
- Uses `requestAnimationFrame` for smooth 60fps updates
- State updates only when values change to prevent unnecessary re-renders
- Cleanup of animation frames on component unmount

### Memory Management
- Proper cleanup of WebSocket connections
- Game engine disposal on component unmount
- Event listener cleanup for resize and keyboard events

### State Management
- Separate refs for values that shouldn't trigger re-renders
- Optimized dependency arrays in useEffect hooks
- Memoized callback functions to prevent recreation

## Controls

### Desktop Controls
- **WASD**: Tank movement
- **Mouse**: Aim and shoot
- **E**: Toggle auto-fire mode
- **Enter**: Open chat
- **Escape**: Exit game (when game over)

### Mobile Controls
- **Touch Controls**: On-screen buttons for movement and shooting
- **Responsive Canvas**: Adapts to different screen sizes
- **Touch Gestures**: Tap to shoot, drag to move

## Error Handling

### Connection Errors
```typescript
// WebSocket connection handling
useEffect(() => {
  // Connection status tracking without notifications
}, [isConnected, playMode]);
```

### Game Engine Errors
```typescript
const initializeGame = useCallback(() => {
  try {
    // Game initialization logic
  } catch (error) {
    console.error("Game initialization error:", error);
  }
}, [dependencies]);
```

### API Errors
```typescript
// Prize claiming error handling
catch (error) {
  console.error("Error claiming prize:", error);
  toast.error("Failed to claim prize", {
    description: "Network error - please try again later",
    duration: 5000,
  });
}
```

## Testing Considerations

### Unit Testing
- Test timer system accuracy
- Validate state management logic
- Test WebSocket message handling
- Verify prize calculation logic

### Integration Testing
- Test multiplayer synchronization
- Validate competition mode flow
- Test prize distribution API
- Verify game engine integration

### Performance Testing
- Monitor frame rate during gameplay
- Test with multiple concurrent players
- Validate memory usage over time
- Test on different device types

## Deployment Requirements

### Environment Variables
```env
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8080
PRIZE_DISTRIBUTION_PRIVATE_KEY=your_blockchain_private_key
PRIZE_DISTRIBUTION_RPC_URL=your_blockchain_rpc_url
```

### WebSocket Server
- Deploy WebSocket server for multiplayer functionality
- Handle player synchronization and state management
- Implement message broadcasting and room management

### Blockchain Integration
- Deploy smart contracts for prize distribution
- Set up wallet for automated prize payments
- Implement transaction monitoring and confirmation

## Future Enhancements

### Planned Features
- **Tournament System**: Multi-round competitions with brackets
- **Spectator Mode**: Watch ongoing games without participating
- **Replay System**: Record and playback game sessions
- **Custom Maps**: User-generated game environments
- **Team Battles**: Cooperative multiplayer modes
- **Achievement System**: Unlock rewards for gameplay milestones

### Technical Improvements
- **WebRTC Integration**: Peer-to-peer multiplayer for reduced latency
- **Advanced AI**: Machine learning-based bot behavior
- **Mobile App**: Native mobile version with enhanced touch controls
- **VR Support**: Virtual reality gameplay experience