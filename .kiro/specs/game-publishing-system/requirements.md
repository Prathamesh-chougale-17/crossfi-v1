# Requirements Document

## Introduction

This feature enables users to publish their games to two different visibility modes: Marketplace and Community. The Marketplace allows users to share games for public play without exposing the source code, while the Community mode showcases games with visible code that others can fork and modify in their own versions.

## Requirements

### Requirement 1

**User Story:** As a game creator, I want to publish my game to the marketplace, so that other users can discover and play my game without seeing the source code.

#### Acceptance Criteria

1. WHEN a user clicks "Make it to Marketplace" THEN the system SHALL create a marketplace entry for the game
2. WHEN a game is published to marketplace THEN the system SHALL make the game publicly visible to all users
3. WHEN users view a marketplace game THEN the system SHALL show only the game preview without code editors
4. WHEN a game is in marketplace THEN the system SHALL allow any user to play the game
5. IF a game is already in marketplace THEN the system SHALL update the existing marketplace entry
6. WHEN publishing to marketplace THEN the system SHALL use the latest checkpoint as the published version

### Requirement 2

**User Story:** As a game creator, I want to publish my game to the community, so that other developers can see my code, learn from it, and create their own versions.

#### Acceptance Criteria

1. WHEN a user clicks "Make it to Community" THEN the system SHALL create a community showcase entry for the game
2. WHEN a game is published to community THEN the system SHALL make the game and its source code publicly visible
3. WHEN users view a community game THEN the system SHALL display both the game preview and the source code
4. WHEN viewing community games THEN users SHALL be able to see HTML, CSS, and JavaScript code
5. WHEN viewing community games THEN users SHALL NOT be able to edit the original code directly
6. WHEN a game is in community THEN the system SHALL provide a "Fork" option for other users
7. WHEN publishing to community THEN the system SHALL use the latest checkpoint as the published version

### Requirement 3

**User Story:** As a user browsing community games, I want to fork interesting games, so that I can create my own version and modify the code.

#### Acceptance Criteria

1. WHEN a user clicks "Fork" on a community game THEN the system SHALL create a new game in the user's account
2. WHEN forking a game THEN the system SHALL copy the HTML, CSS, and JavaScript code to the new game
3. WHEN forking a game THEN the system SHALL set the user as the owner of the forked game
4. WHEN a game is forked THEN the system SHALL create an initial checkpoint with the copied code
5. WHEN forking THEN the system SHALL redirect the user to the editor for their new forked game
6. WHEN forking THEN the system SHALL maintain a reference to the original game for attribution

### Requirement 4

**User Story:** As a game creator, I want to manage my published games, so that I can update or remove them from public visibility.

#### Acceptance Criteria

1. WHEN a user republishes a game THEN the system SHALL update the published version with the latest checkpoint
2. WHEN a user wants to unpublish THEN the system SHALL provide options to remove from marketplace or community
3. WHEN a game is unpublished THEN the system SHALL make it private and accessible only to the owner
4. WHEN viewing published games THEN the system SHALL show publication status in the game editor
5. IF a game has no checkpoints THEN the system SHALL prevent publishing until code is generated

### Requirement 5

**User Story:** As a user, I want to browse marketplace and community games, so that I can discover and play interesting games created by others.

#### Acceptance Criteria

1. WHEN accessing marketplace THEN the system SHALL display all published marketplace games
2. WHEN accessing community THEN the system SHALL display all published community games
3. WHEN browsing games THEN the system SHALL show game title, creator, and preview thumbnail
4. WHEN browsing games THEN the system SHALL provide search and filtering capabilities
5. WHEN clicking on a marketplace game THEN the system SHALL open a play-only view
6. WHEN clicking on a community game THEN the system SHALL open a view with code and fork option
7. WHEN browsing THEN the system SHALL show game popularity metrics (play count, fork count)

### Requirement 6

**User Story:** As a system, I want to track game analytics, so that creators can see how their games are performing and users can discover popular content.

#### Acceptance Criteria

1. WHEN a game is played THEN the system SHALL increment the play count
2. WHEN a game is forked THEN the system SHALL increment the fork count
3. WHEN displaying games THEN the system SHALL show relevant metrics (plays, forks, creation date)
4. WHEN a creator views their game THEN the system SHALL show detailed analytics
5. WHEN sorting games THEN the system SHALL provide options to sort by popularity, recency, or alphabetically