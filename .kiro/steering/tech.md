# Technology Stack

## Framework & Runtime
- **Next.js 15.4.5** with App Router
- **React 19.1.0** with TypeScript 5
- **Node.js** runtime

## Web3 & Wallet Integration
- **RainbowKit 2.2.8** - Wallet connection UI
- **Wagmi 2.16.0** - React hooks for Ethereum
- **Viem 2.33.1** - TypeScript interface for Ethereum

## AI & Code Generation
- **Google AI Genkit 1.15.5** - AI flow orchestration
- **Firebase Genkit** - AI model integration
- Custom flows for HTML5 Canvas game code generation
- Canvas-first AI prompts with game loop and 2D rendering focus

## Database & Storage
- **MongoDB 6.18.0** - Primary database
- Wallet-based ownership model
- Game and checkpoint collections

## UI & Styling
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Next Themes** - Dark/light mode support

## Form & Validation
- **React Hook Form 7.61.1** - Form management
- **Zod 4.0.14** - Schema validation
- **Hookform Resolvers** - Form validation integration

## Development Tools
- **ESLint 9** with Next.js config
- **TypeScript** with strict mode
- Path aliases (`@/*` → `./`)

## Common Commands

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

## Environment Setup
- Requires `.env.local` for configuration
- MongoDB connection string required
- Google AI API keys for Genkit