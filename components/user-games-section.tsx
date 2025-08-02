'use client';

import { useEffect, useState } from 'react';
import { GameClient } from '@/lib/models';
import { GameGrid } from './game-grid';
import { CreateGameDialog } from './create-game-dialog';
import { useWallet } from '@/lib/wallet/wallet-context';
import { getUserGames, getGameCheckpoints } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Gamepad2, Loader2, Wallet, Sparkles, AlertCircle } from 'lucide-react';

export function UserGamesSection() {
  const { isConnected, isLoading: walletLoading, normalizedAddress, connect } = useWallet();
  const [games, setGames] = useState<GameClient[]>([]);
  const [checkpointCounts, setCheckpointCounts] = useState<Record<string, number>>({});
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserGames = async () => {
    if (!normalizedAddress) return;

    setIsLoadingGames(true);
    setError(null);

    try {
      const userGames = await getUserGames({ walletAddress: normalizedAddress });
      setGames(userGames);

      // Load checkpoint counts for each game
      const counts: Record<string, number> = {};
      await Promise.all(
        userGames.map(async (game) => {
          if (game._id) {
            try {
              const checkpoints = await getGameCheckpoints({
                gameId: game._id.toString(),
                walletAddress: normalizedAddress,
              });
              counts[game._id.toString()] = checkpoints.length;
            } catch (error) {
              console.error(`Error loading checkpoints for game ${game._id}:`, error);
              counts[game._id.toString()] = 0;
            }
          }
        })
      );
      setCheckpointCounts(counts);
    } catch (error) {
      console.error('Error loading user games:', error);
      setError('Failed to load your games. Please try again.');
    } finally {
      setIsLoadingGames(false);
    }
  };

  useEffect(() => {
    if (isConnected && normalizedAddress) {
      loadUserGames();
    }
  }, [isConnected, normalizedAddress]);

  const handleGameCreated = () => {
    // Reload games when a new game is created
    loadUserGames();
  };

  // Show loading state while wallet is connecting
  if (walletLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Connecting to Wallet</h3>
          <p className="text-muted-foreground">Please wait while we establish a secure connection...</p>
        </div>
      </div>
    );
  }

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="max-w-md w-full">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Connect Your Wallet
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Connect your wallet to create and manage your games. Your games will be securely stored and associated with your wallet address.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Secure blockchain storage</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>AI-powered game creation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Cross-platform compatibility</span>
              </div>
            </div>
            <Button onClick={connect} size="lg" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200">
              <Wallet className="h-5 w-5 mr-2" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while games are loading
  if (isLoadingGames) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Loading Your Games</h3>
          <p className="text-muted-foreground">Fetching your game collection and progress data...</p>
          <div className="w-full max-w-xs mx-auto mt-4">
            <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="max-w-md w-full">
          <div className="bg-card/50 backdrop-blur-sm border border-destructive/20 rounded-2xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-destructive/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-destructive">Something went wrong</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">{error}</p>
            <Button
              onClick={loadUserGames}
              variant="outline"
              className="border-destructive/20 hover:bg-destructive/5 hover:border-destructive/40 transition-all duration-200"
            >
              <Loader2 className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no games
  if (games.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="max-w-lg w-full">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
              <Gamepad2 className="h-10 w-10 text-primary" />
              <Sparkles className="h-5 w-5 text-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Ready to Create Your First Game?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              You haven&apos;t created any games yet. Use our AI-powered game generator to build amazing HTML5 Canvas games in minutes!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-sm">
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <span className="text-muted-foreground text-center">Describe your game idea</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">2</span>
                </div>
                <span className="text-muted-foreground text-center">AI generates the code</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <span className="text-muted-foreground text-center">Play & customize</span>
              </div>
            </div>

            <CreateGameDialog onGameCreated={handleGameCreated} />
          </div>
        </div>
      </div>
    );
  }

  // Show games grid
  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground">
              {games.length} game{games.length !== 1 ? 's' : ''} created
            </p>
            {games.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-600 font-medium">Active</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {games.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">
                {Object.values(checkpointCounts).reduce((sum, count) => sum + count, 0)} total checkpoints
              </span>
            </div>
          )}
          <CreateGameDialog onGameCreated={handleGameCreated} />
        </div>
      </div>

      {/* Games Grid with Enhanced Container */}
      <div className="relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        </div>

        <div className="relative z-10">
          <GameGrid games={games} checkpointCounts={checkpointCounts} />
        </div>
      </div>
    </div>
  );
}