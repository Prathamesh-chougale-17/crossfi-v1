# Project Structure

## Root Directory Organization

```
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
├── lib/                    # Utility functions and configurations
├── ai/                     # AI flows and Genkit configuration
├── hooks/                  # Custom React hooks
├── public/                 # Static assets
└── .kiro/                  # Kiro AI assistant configuration
```

## App Router Structure (`app/`)
- **`page.tsx`** - Home page with user games section
- **`layout.tsx`** - Root layout with providers
- **`games/`** - Game-related pages
  - **`editor/page.tsx`** - Game editor interface
  - **`page.tsx`** - Games listing page
- **`marketplace/page.tsx`** - Game marketplace
- **`community/page.tsx`** - Community features

## Component Organization (`components/`)
- **`ui/`** - Base UI components (shadcn/ui)
- **`canvas-forge/`** - Game editor specific components
  - **`CodeEditor.tsx`** - Code editing interface
  - **`Preview.tsx`** - Game preview component
  - **`Header.tsx`** - Editor header
  - **`GameGeneratorDialog.tsx`** - AI game generation dialog
- **Wallet components** - Web3 wallet integration
- **Navigation** - `navbar.tsx` for site navigation

## Library Structure (`lib/`)
- **`wallet/`** - Web3 wallet utilities and context
  - **`index.ts`** - Main wallet exports
  - **`validation.ts`** - Wallet address validation
  - **`wallet-context.tsx`** - React context for wallet state
  - **`rainbow-kit-client.ts`** - RainbowKit configuration
- **`models.ts`** - MongoDB data models (Game, Checkpoint)
- **`actions.ts`** - Server actions for database operations
- **`mongodb.ts`** - Database connection
- **`chains.ts`** - Blockchain network configurations

## AI Integration (`ai/`)
- **`genkit.ts`** - Genkit AI configuration
- **`dev.ts`** - Development server setup
- **`flows/`** - AI flow definitions
  - **`generate-game-code.ts`** - Game code generation flow

## Naming Conventions
- **Files**: kebab-case for components (`user-games-section.tsx`)
- **Components**: PascalCase exports (`UserGamesSection`)
- **Utilities**: camelCase functions
- **Constants**: UPPER_SNAKE_CASE
- **Database collections**: lowercase (`games`, `checkpoints`)

## Import Patterns
- Use `@/` path alias for absolute imports
- Group imports: external libraries, then internal modules
- Prefer named exports over default exports for utilities