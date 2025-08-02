# Design Document

## Overview

The current auto-generation issue stems from the game editor page automatically triggering AI generation on every visit, rather than only when explicitly requested by the user. The problem occurs because the system doesn't properly distinguish between loading existing game data and generating new content. This design addresses the issue by clearly separating data loading operations from AI generation operations and ensuring that AI generation only occurs through explicit user interaction with the GameGeneratorDialog.

## Architecture

### Current Problem Analysis

The issue is located in the `app/editor/[gameId]/page.tsx` file where the game loading logic may be inadvertently triggering AI generation. The current flow has these problematic patterns:

1. **Unclear separation**: The system doesn't clearly separate "loading existing data" from "generating new data"
2. **Auto-generation triggers**: There may be code paths that automatically call AI generation functions during the loading process
3. **State management confusion**: The `isGameGenerated` state and related logic may be causing unintended generation calls

### Proposed Solution Architecture

The solution involves implementing a clear separation of concerns:

1. **Data Loading Layer**: Pure data retrieval operations that never trigger AI generation
2. **AI Generation Layer**: Explicit AI generation that only occurs through user interaction
3. **State Management Layer**: Clear state tracking that prevents accidental generation triggers
4. **User Interface Layer**: Clear visual feedback for all operations

## Components and Interfaces

### Modified GameEditorPage Component

**Purpose**: Main editor page that loads existing games without triggering AI generation

**Key Changes**:
- Remove any automatic AI generation calls from the loading process
- Ensure `loadGameData` function only retrieves existing data
- Separate auto-save functionality from AI generation
- Add proper state management to prevent accidental generation

**Interface**:
```typescript
interface GameEditorPageState {
  game: Game | null;
  checkpoints: Checkpoint[];
  html: string;
  css: string;
  js: string;
  srcDoc: string;
  isGameGenerated: boolean;
  isLoading: boolean;
  isSaving: boolean;
  // New state to track generation explicitly
  isGenerating: boolean;
}
```

### Enhanced GameGeneratorDialog Component

**Purpose**: The only component that should trigger AI generation

**Key Changes**:
- Ensure this is the exclusive entry point for AI generation
- Add proper loading states during generation
- Provide clear success/error feedback
- Prevent multiple simultaneous generation requests

**Interface**:
```typescript
interface GameGeneratorDialogProps {
  onGenerate: (output: GenerateGameCodeOutput) => Promise<void>;
  children: React.ReactNode;
  html: string;
  css: string;
  js: string;
  isGameGenerated: boolean;
  // New prop to prevent generation during other operations
  disabled?: boolean;
}
```

### Refactored Actions Layer

**Purpose**: Clear separation between data operations and AI operations

**Key Changes**:
- Ensure `getGameById` and `getGameCheckpoints` never trigger AI generation
- Modify auto-save functionality to only save data, not generate new content
- Create explicit generation-only functions that are only called from the dialog

**New Function Signatures**:
```typescript
// Pure data operations (no AI generation)
function loadGameData(gameId: string, walletAddress: string): Promise<GameLoadResult>
function saveCodeChanges(gameId: string, walletAddress: string, code: GameCode): Promise<void>

// Explicit AI generation operations (only called from dialog)
function generateGameFromPrompt(input: GenerateGameInput): Promise<GenerateGameOutput>
function refineGameFromPrompt(input: RefineGameInput): Promise<GenerateGameOutput>
```

## Data Models

### GameLoadResult Interface

```typescript
interface GameLoadResult {
  game: Game;
  checkpoints: Checkpoint[];
  latestCode: {
    html: string;
    css: string;
    javascript: string;
  } | null;
}
```

### GameCode Interface

```typescript
interface GameCode {
  html: string;
  css: string;
  javascript: string;
}
```

## Error Handling

### Loading Errors
- **Game not found**: Redirect to games list with error message
- **Permission denied**: Show access denied message
- **Network errors**: Show retry option with error details

### Generation Errors
- **AI service unavailable**: Show error in dialog, keep dialog open for retry
- **Invalid prompt**: Show validation error in dialog
- **Generation timeout**: Show timeout error with retry option

### Auto-save Errors
- **Save failures**: Log error but don't show user notification (to avoid spam)
- **Permission errors**: Show notification and disable auto-save
- **Network errors**: Queue saves for retry when connection restored

## Testing Strategy

### Unit Tests
1. **GameEditorPage Component**:
   - Test that loading existing games never triggers AI generation
   - Test that auto-save only saves data without generation
   - Test proper state management during loading and editing

2. **GameGeneratorDialog Component**:
   - Test that generation only occurs when dialog is submitted
   - Test proper loading states during generation
   - Test error handling for generation failures

3. **Actions Layer**:
   - Test that data loading functions never call AI generation
   - Test that auto-save functions only save data
   - Test that generation functions are only called explicitly

### Integration Tests
1. **End-to-End Game Loading**:
   - Test visiting existing game doesn't trigger generation
   - Test refreshing page doesn't trigger generation
   - Test navigating between games doesn't trigger generation

2. **Explicit Generation Flow**:
   - Test opening dialog and submitting prompt generates code
   - Test generation creates new checkpoint
   - Test generation updates game state correctly

3. **Auto-save Functionality**:
   - Test manual code edits trigger auto-save
   - Test auto-save doesn't trigger generation
   - Test auto-save preserves manual changes

### Manual Testing Scenarios
1. **Visit existing game**: Verify no unexpected generation occurs
2. **Refresh game editor**: Verify game loads with same code
3. **Edit code manually**: Verify auto-save works without generation
4. **Use AI dialog**: Verify generation only occurs when prompted
5. **Network interruption**: Verify graceful handling of failures

## Implementation Phases

### Phase 1: Fix Core Loading Issue
- Remove any AI generation calls from the game loading process
- Ensure `loadGameData` function only retrieves existing data
- Test that visiting games doesn't trigger generation

### Phase 2: Separate Manual Save from Generation
- Remove auto-save functionality that was triggering AI generation
- Implement manual save functionality through `handleSave` function
- Add `saveCodeChanges` server action for saving code without AI generation
- Test that manual edits can be saved without triggering generation

### Phase 3: Enhance User Feedback
- Add proper loading states to distinguish between loading and generating
- Improve error messages for different types of failures
- Add visual indicators for auto-save status

### Phase 4: Testing and Validation
- Implement comprehensive test suite
- Perform manual testing of all scenarios
- Validate that generation only occurs through explicit user action