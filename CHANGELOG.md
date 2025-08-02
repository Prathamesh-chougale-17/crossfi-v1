# Changelog

All notable changes to the Jeu Plaza Canvas Game Editor project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **Layout Typography**: Fixed font configuration in `app/layout.tsx` to properly use Architects Daughter font
  - **Font Integration**: Correctly imported and configured `Architects_Daughter` from next/font/google
  - **Variable Assignment**: Proper font variable assignment with `--font-arc-dau` CSS variable
  - **Class Application**: Applied `arcDau.className` to body element for consistent typography
  - **Code Cleanup**: Removed unused font declarations and ensured proper font loading

### Major: Comprehensive Design System Overhaul
- **Modern CSS Architecture**: Complete redesign of the styling system with CSS custom properties and OKLCH color space
  - **OKLCH Color System**: Migrated from HSL to OKLCH color space for perceptual uniformity and better gradients
  - **CSS Custom Properties**: Comprehensive design token system with organized color, typography, and shadow variables
  - **Dark/Light Theme Support**: Seamless theme switching with proper CSS custom property overrides
  - **Sharp Modern Aesthetic**: 0px border radius and 4px offset shadows for contemporary, clean design
  - **Enhanced Shadow System**: Layered shadow effects from subtle (2xs) to dramatic (2xl) with consistent 4px offset
  - **Typography Integration**: Custom font stack with DotGothic16, Abhaya Libre, and Space Mono properly integrated
  - **Tailwind CSS 4 Integration**: Modern `@theme inline` directive for seamless design token integration
  - **Glass Morphism Effects**: Backdrop blur and translucent backgrounds throughout the interface
  - **Responsive Design Tokens**: Consistent spacing, typography, and visual effects across all screen sizes

### Added
- **Design System Documentation**: Comprehensive documentation for the new design system architecture
  - **Technical Guide**: Detailed `docs/design-system.md` with implementation patterns and best practices
  - **Color System**: OKLCH color space benefits, semantic color tokens, and usage examples
  - **Typography System**: Font stack details, usage patterns, and responsive typography guidelines
  - **Shadow System**: Modern shadow design philosophy with consistent 4px offset patterns
  - **Animation Guidelines**: Transition timing, hover effects, and entrance animation patterns
  - **Component Patterns**: Reusable design patterns for glass morphism, gradients, and status indicators
  - **Accessibility Standards**: Color contrast, typography readability, and motion considerations
  - **Development Workflow**: Guidelines for maintaining design system consistency

### Enhanced
- **Visual Design Language**: Elevated visual design across the entire platform
  - **Color Palette**: Vibrant OKLCH-based colors with better contrast and accessibility
  - **Modern Shadows**: Sharp, high-contrast shadows with consistent offset for depth hierarchy
  - **Typography Hierarchy**: Improved text scaling and font usage for better readability
  - **Interactive Elements**: Enhanced hover states, focus rings, and transition effects
  - **Status Indicators**: Animated pulse dots and gradient badges for live status display
  - **Card Design**: Glass morphism cards with backdrop blur and gradient overlays
  - **Button System**: Consistent button styling with proper hover and focus states

### Fixed
- **Code Cleanup**: Removed unused imports from `lib/actions.ts` to improve code quality and reduce bundle size
  - **Import Optimization**: Removed unused `Game` and `Checkpoint` imports that were causing TypeScript warnings
  - **Type Consistency**: Actions now properly use only the required client-safe interfaces (`GameClient`, `CheckpointClient`)
  - **Bundle Size**: Reduced unnecessary imports to optimize build output
  - **Code Quality**: Cleaner import statements following established patterns

### Major: Community Hub Implementation
- **Dedicated Community Platform**: New `/community` page for exploring open source games and collaborating with developers
  - **Developer-Focused Interface**: Professional hero section with community-focused messaging and developer statistics
  - **Open Source Project Discovery**: Real-time search and filtering specifically for community-published games
  - **Code Exploration Features**: Prominent "View Code" buttons and clear indicators for forkable projects
  - **Community Statistics**: Live display of open source projects count, code availability, and community engagement metrics
  - **Developer Attribution**: Proper creator credit with wallet address display (truncated format: first 6 + last 4 characters)
  - **Project Metadata**: Publication dates, open source status, and collaboration indicators
  - **Enhanced Empty States**: Community-specific messaging encouraging developers to share their first project
  - **Visual Design**: Glass morphism cards with developer-themed blue/green color schemes and code-focused icons
  - **Responsive Layout**: Mobile-first design optimized for code project browsing and collaboration
  - **Integration**: Seamless integration with publishing system to show community-published games vs marketplace games

### Major: Enhanced Marketplace Experience
- **Modern Marketplace Interface**: Complete redesign of the marketplace page with professional visual design and enhanced user experience
  - **Professional Hero Section**: Enhanced hero with animated backgrounds, gradient overlays, and modern typography (5xl-7xl responsive titles)
  - **Real-time Search**: Instant game filtering by name and description with debounced input and result counters
  - **Enhanced Game Cards**: Professional card design with hover effects, gradient overlays, and animated status indicators
  - **Glass Morphism Design**: Translucent cards with backdrop blur effects, subtle shadows, and modern visual hierarchy
  - **Live Statistics**: Real-time display of published games count, active community metrics, and platform status indicators
  - **Contextual Empty States**: Different messaging for search results vs no published games with engaging call-to-action buttons
  - **Responsive Layout**: Seamless adaptation from mobile to desktop with proper spacing, grid layouts, and touch-friendly interactions
  - **Visual Enhancements**: Staggered card animations, hover scale transforms, and animated background elements
  - **Search State Management**: Maintains search query state with proper filtering and URL handling

### Enhanced
- **Button Component UX**: Added `cursor-pointer` to button variants for improved user interaction feedback
  - **Visual Feedback**: All buttons now consistently show pointer cursor on hover
  - **User Experience**: Better interaction affordance across all button variants (default, outline, secondary, etc.)
  - **Consistency**: Ensures uniform cursor behavior throughout the application interface

### Fixed
- **GameCard Component Cleanup**: Removed unused imports and improved code formatting in GameCard component
  - **Import Optimization**: Removed unused `Button` import and cleaned up icon imports to eliminate TypeScript warnings
  - **Code Formatting**: Fixed indentation and code structure for better readability
  - **UI Refinement**: Commented out "New" badge for recently updated games to streamline the interface
  - **Performance**: Reduced bundle size by removing unnecessary imports
- **GameCard Component Type Consistency**: Updated `GameCard` component to use `GameClient` interface instead of `Game` for proper client-side ObjectId handling
  - **Component Props**: Fixed `GameCardProps.game` type from `Game` to `GameClient`
  - **Type Safety**: Ensures consistency with server actions that return client-safe objects with string IDs
  - **API Alignment**: Aligns with the established pattern of using `*Client` interfaces for client-side components
- **Type Consistency**: Fixed `getUserGames` return type from `Game[]` to `GameClient[]` for proper client-side ObjectId handling
  - **Client-Safe Objects**: Ensures all game data returned to client has string IDs instead of MongoDB ObjectIds
  - **Type Safety**: Maintains consistency with other client-facing server actions (`getGameById`, `createGame`)
  - **API Consistency**: Aligns with the established pattern of using `*Client` interfaces for client-side data
  - **Component Compatibility**: Fixes TypeScript errors in `UserGamesSection` and `GameGrid` components
- **Type Consistency**: Fixed `getGameCheckpoints` return type from `Checkpoint[]` to `CheckpointClient[]` for proper client-side ObjectId handling
  - **Client-Safe Objects**: Ensures all checkpoint data returned to client has string IDs instead of MongoDB ObjectIds
  - **Type Safety**: Maintains consistency with other client-facing server actions
  - **API Consistency**: Aligns with the established pattern of using `*Client` interfaces for client-side data
- **saveCodeChanges ObjectId Conversion**: Fixed `saveCodeChanges` function to properly convert MongoDB ObjectId to string for client consumption
  - **Client Compatibility**: Ensures returned checkpoint data has string `_id` field instead of ObjectId
  - **Type Safety**: Maintains consistency with `CheckpointClient` interface requirements
  - **API Consistency**: Aligns with other server actions that return client-safe objects

### Enhanced
- **Header Component State Management**: Added `onGeneratingChange` callback prop to Header component for improved AI generation state coordination
  - **Parent-Child Communication**: Header can now notify parent components when AI generation starts/stops
  - **Coordinated Loading States**: Enables synchronized loading UI across editor interface
  - **Better User Feedback**: Allows parent components to show appropriate loading states during AI generation
  - **State Synchronization**: Keeps generation state consistent between Header and parent components

### Major: Canvas-First Game Generation
- **Canvas-Focused AI System**: Complete overhaul to specialize in HTML5 Canvas game development
  - **Canvas-First Architecture**: All games now rendered on a single `<canvas>` element with proper 2D context usage
  - **Professional Game Loop**: AI implements `requestAnimationFrame` loops for smooth 60fps animation
  - **Canvas 2D API Mastery**: Proper use of drawing commands (`ctx.fillRect()`, `ctx.fillText()`, etc.), transformations, and rendering optimizations
  - **Visual Polish**: Modern, visually attractive games with vibrant colors, particle effects, and smooth animations
  - **No External Dependencies**: Pure HTML, CSS, JavaScript - no external game engines (p5.js, Phaser) or libraries
  - **Responsive Canvas**: Canvas resizes to fit container while maintaining aspect ratio
  - **Complete Game Experience**: Start screens, game-over states, and HTML UI overlays for mobile controls
  - **Clean JSON Output**: AI now returns structured JSON instead of markdown-formatted code blocks

### Enhanced
- **AI Game Generation System**: Major overhaul of the AI flow with strict quality controls and professional standards
  - **Self-contained Games**: Generated games require no external dependencies, libraries, or assets
  - **Cross-platform Support**: Automatic keyboard (desktop) and touch (mobile) controls implementation
  - **Browser Compatibility**: Ensures games work across all major browsers without errors
  - **Enhanced Prompts**: More detailed and structured prompts for canvas-specific game development
  - **Error Handling**: Improved error handling and validation in the AI generation flow

### Fixed
- **Auto-generation Issue**: Removed unwanted auto-generation behavior where games were automatically updated on every editor page visit
- **Manual Save Control**: Games now only update when users explicitly request generation through the AI dialog

### Removed
- **Auto-save Functionality**: Removed automatic checkpoint creation every 10 seconds to prevent unwanted AI generation
- **Automatic Code Updates**: Code changes no longer trigger automatic AI generation or checkpoint saving

### Fixed
- **Data Model Consistency**: Fixed inconsistent property naming between Game and GameClient interfaces (WalletAddress → walletAddress)
- **Type Safety**: Resolved TypeScript errors in server actions related to ObjectId/string type mismatches
- **Database Operations**: Fixed checkpoint and game operations to properly handle ObjectId/string conversions
- **Interface Completeness**: Added missing `currentCheckpointId` property to GameClient interface
- **Model Separation**: Properly separated database models (using ObjectId) from client models (using string IDs)

### Added
- **Game-specific Editor Route**: New `/editor/[gameId]` route for individual game editing with wallet-based ownership verification
- **Enhanced Game Management**: Complete CRUD operations for games with wallet address validation
- **Checkpoint System**: Version control system for game code with automatic checkpoint creation
- **Live Preview**: Real-time game preview with 500ms debouncing for smooth editing experience
- **Export & Share**: Export games as standalone HTML files or share via encoded URLs
- **Wallet-based Ownership**: All games and checkpoints are associated with wallet addresses for privacy and security
- **GameGrid Component**: Responsive grid layout for displaying user games (1-4 columns based on screen size)
- **Enhanced Server Actions**: Comprehensive API for game and checkpoint management with Zod validation
- **Enhanced Header Component**: Editor header with publishing controls, status indicators, and prepared save functionality
  - **Publishing Controls**: Separate buttons for marketplace and community publishing with visual status feedback
  - **Status Indicators**: Green indicators for marketplace publishing, blue for community publishing
  - **Prepared Save Features**: Icons and props ready for save status display and checkpoint count
  - **Responsive Design**: Consistent styling with hover effects and accessibility support

### Changed
- **Game Creation Flow**: Games now redirect to game-specific editor (`/games/[gameId]`) instead of general editor
- **Editor Interface**: Enhanced header with game title, save status, and checkpoint count display
- **AI Integration**: `generateGameWithCheckpoint` function now supports automatic checkpoint saving
- **Database Models**: Extended Game and Checkpoint models with wallet address fields and privacy settings
- **Navigation**: GameCard components now link to game-specific editors instead of general editor

### Enhanced
- **Wallet Integration**: Improved wallet context with `useRequireWallet` hook for protected routes
- **Error Handling**: Comprehensive error handling for unauthorized access and invalid game IDs
- **Loading States**: Better loading indicators for wallet connection, game loading, and save operations
- **User Experience**: Empty states, loading spinners, and toast notifications for better user feedback

### Technical Improvements
- **TypeScript**: Enhanced type safety with proper interfaces for Game and Checkpoint models
- **Server Actions**: All database operations now include wallet address validation and ownership checks
- **Code Organization**: Better separation of concerns with dedicated components for game management
- **Performance**: Debounced auto-save and preview updates to reduce unnecessary operations

### Security
- **Ownership Verification**: All game and checkpoint operations verify wallet ownership before execution
- **Input Validation**: Zod schemas for all server action inputs to prevent invalid data
- **Private by Default**: Games are created as private and only accessible by the owner's wallet address

## [Previous Versions]

### Legacy Features (Pre-wallet Integration)
- Basic game editor with HTML/CSS/JavaScript editing
- AI-powered game code generation using Google AI (Genkit)
- Real-time preview functionality
- Export and share capabilities via URL encoding
- Responsive design with resizable panels

---

## Migration Notes

### For Developers
- The general `/editor` route still exists for backward compatibility but lacks wallet integration
- New games should be created through the dashboard and will automatically use the wallet-integrated editor
- Server actions now require wallet address parameters for all game-related operations

### For Users
- Existing shared URLs from the legacy editor will still work
- New games require wallet connection and will be private by default
- Games created before wallet integration may need to be recreated for full feature access