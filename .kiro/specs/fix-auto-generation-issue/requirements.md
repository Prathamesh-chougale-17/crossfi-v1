# Requirements Document

## Introduction

The game editor currently has an unwanted auto-generation behavior where games are automatically updated/regenerated on every visit to the editor page, even when the user hasn't provided any prompt. This creates a poor user experience as users expect games to only update when they explicitly request generation or refinement through the AI dialog. The system should only generate or update game code when the user explicitly provides a prompt through the GameGeneratorDialog component.

## Requirements

### Requirement 1

**User Story:** As a game creator, I want my games to remain unchanged when I visit the editor, so that I can continue working on the same version without unexpected modifications.

#### Acceptance Criteria

1. WHEN a user visits the game editor page THEN the system SHALL load the existing game code without triggering any AI generation
2. WHEN a user navigates to an existing game THEN the system SHALL display the last saved checkpoint code exactly as it was saved
3. WHEN a user refreshes the game editor page THEN the system SHALL NOT automatically regenerate or modify the game code

### Requirement 2

**User Story:** As a game creator, I want to control when my game code is generated or updated, so that I can make intentional changes rather than having unexpected modifications.

#### Acceptance Criteria

1. WHEN a user wants to generate new game code THEN the system SHALL only generate code when the user explicitly submits a prompt through the GameGeneratorDialog
2. WHEN a user wants to refine existing game code THEN the system SHALL only modify code when the user provides specific feedback through the AI dialog
3. WHEN a user opens the GameGeneratorDialog and submits a prompt THEN the system SHALL generate/update the code and save it as a new checkpoint

### Requirement 3

**User Story:** As a game creator, I want clear visual feedback about when code generation is happening, so that I understand when the system is processing my requests.

#### Acceptance Criteria

1. WHEN the system is generating game code THEN the system SHALL show a loading state in the GameGeneratorDialog
2. WHEN code generation is complete THEN the system SHALL show a success message and close the dialog
3. WHEN code generation fails THEN the system SHALL show an error message and keep the dialog open for retry

### Requirement 4

**User Story:** As a game creator, I want the auto-save functionality to work correctly without triggering unwanted generation, so that my manual edits are preserved without causing AI regeneration.

#### Acceptance Criteria

1. WHEN a user manually edits HTML, CSS, or JavaScript code THEN the system SHALL auto-save the changes without triggering AI generation
2. WHEN the auto-save functionality runs THEN the system SHALL only save the current code state without calling AI generation functions
3. WHEN a user makes manual code changes THEN the system SHALL preserve those changes and not overwrite them with AI-generated content