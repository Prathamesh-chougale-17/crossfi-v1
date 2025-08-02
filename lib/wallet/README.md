# Wallet Authentication Utilities

This module provides comprehensive wallet authentication utilities for the Canvas Game Editor, including validation, context management, and route protection.

## Features

- ✅ Wallet address validation with Zod schemas
- ✅ React context for wallet state management
- ✅ Hooks for wallet authentication requirements
- ✅ Higher-order components for route protection
- ✅ Integration with RainbowKit and Wagmi

## Usage

### Basic Wallet State

```tsx
import { useWallet } from '@/lib/wallet';

function MyComponent() {
  const { address, isConnected, isLoading, connect, disconnect } = useWallet();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}
```

### Protected Components

```tsx
import { useRequireWallet } from '@/lib/wallet';

function ProtectedComponent() {
  const { address, shouldShowConnectPrompt, promptConnection } = useRequireWallet();

  if (shouldShowConnectPrompt) {
    return (
      <div>
        <p>Please connect your wallet</p>
        <button onClick={promptConnection}>Connect</button>
      </div>
    );
  }

  return <div>Protected content for {address}</div>;
}
```

### Higher-Order Component Protection

```tsx
import { withWalletRequired } from '@/lib/wallet';

const MyProtectedComponent = withWalletRequired(({ data }) => {
  return <div>This component requires wallet connection</div>;
});
```

### Wallet Address Validation

```tsx
import { validateWalletAddress, isValidWalletAddress } from '@/lib/wallet';

// Validate an address
const result = validateWalletAddress('0x1234...');
if (result.success) {
  console.log('Valid address:', result.data); // Normalized to lowercase
}

// Quick validation check
if (isValidWalletAddress(address)) {
  // Address is valid
}
```

### Server Action Integration

```tsx
import { normalizeWalletAddress } from '@/lib/wallet';

export async function createGame(name: string, walletAddress: string) {
  try {
    const normalizedAddress = normalizeWalletAddress(walletAddress);
    // Use normalizedAddress in database operations
  } catch (error) {
    throw new Error('Invalid wallet address');
  }
}
```

## API Reference

### Hooks

#### `useWallet()`
Returns the current wallet state and connection utilities.

#### `useRequireWallet(options?)`
Hook for components that require wallet connection.

Options:
- `redirectOnDisconnect?: boolean` - Whether to redirect when wallet disconnects
- `showLoadingState?: boolean` - Whether to show loading state

### Components

#### `WalletProvider`
Context provider that manages wallet state. Already integrated in the main providers.

#### `withWalletRequired(Component, options?)`
HOC that wraps a component with wallet requirement logic.

### Validation

#### `WalletAddressSchema`
Zod schema for wallet address validation.

#### `validateWalletAddress(address: string)`
Validates and normalizes a wallet address.

#### `isValidWalletAddress(address: string)`
Quick boolean check for address validity.

#### `normalizeWalletAddress(address: string)`
Normalizes address to lowercase or throws error.

## Requirements Satisfied

This implementation satisfies the following requirements:

- **Requirement 1.3**: Wallet authentication checks integrated with existing components
- **Requirement 1.4**: Proper error handling for unauthorized access attempts

## Integration

The wallet utilities are automatically available throughout the app via the `WalletProvider` in `components/providers.tsx`. No additional setup is required.

### Game Editor Integration

The new game-specific editor (`/games/[gameId]`) uses `useRequireWallet` to ensure proper authentication:

```tsx
// In app/games/[gameId]/page.tsx
const { normalizedAddress, shouldShowConnectPrompt } = useRequireWallet();

// Verify game ownership before loading
const gameData = await getGameById({
  gameId,
  walletAddress: normalizedAddress,
});
```

This ensures that users can only access and edit games they own, providing secure wallet-based ownership verification.