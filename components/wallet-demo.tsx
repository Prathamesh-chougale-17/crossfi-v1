'use client';

import { useWallet, useRequireWallet } from '@/lib/wallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Demo component showing basic wallet functionality
 */
export function WalletDemo() {
  const { address, isConnected, isLoading, connect, disconnect, normalizedAddress } = useWallet();

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading wallet...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Wallet Status</CardTitle>
        <CardDescription>Current wallet connection status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Connected: {isConnected ? 'Yes' : 'No'}</p>
          {address && (
            <>
              <p className="text-sm text-muted-foreground">Address: {address}</p>
              <p className="text-sm text-muted-foreground">Normalized: {normalizedAddress}</p>
            </>
          )}
        </div>
        
        <div className="flex gap-2">
          {!isConnected ? (
            <Button onClick={connect}>Connect Wallet</Button>
          ) : (
            <Button variant="outline" onClick={disconnect}>Disconnect</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Demo component showing wallet-protected content
 */
export function ProtectedWalletDemo() {
  const { address, normalizedAddress } = useRequireWallet();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Protected Content</CardTitle>
        <CardDescription>This content requires wallet connection</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">✅ Wallet is connected!</p>
          <p className="text-sm text-muted-foreground">Address: {address}</p>
          <p className="text-sm text-muted-foreground">Normalized: {normalizedAddress}</p>
          <p className="text-sm text-green-600">You can now access wallet-protected features.</p>
        </div>
      </CardContent>
    </Card>
  );
}