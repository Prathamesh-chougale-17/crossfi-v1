"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Preview } from "@/components/canvas-forge/Preview";
import { getPublishedGameById } from "@/lib/actions";
import type { GameClient } from "@/lib/models";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, Clock } from "lucide-react";

export default function MarketplaceGamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;

  const [game, setGame] = React.useState<GameClient | null>(null);
  const [gameCode, setGameCode] = React.useState<{
    html: string;
    css: string;
    javascript: string;
    version: number;
  } | null>(null);
  const [srcDoc, setSrcDoc] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  // Load published game data
  React.useEffect(() => {
    const loadGameData = async () => {
      try {
        setIsLoading(true);

        const gameData = await getPublishedGameById({
          gameId,
          publishedTo: 'marketplace',
        });

        if (!gameData) {
          toast.error("Game not found", {
            description: "This game is not available in the marketplace.",
          });
          router.push("/marketplace");
          return;
        }

        setGame(gameData.game);
        setGameCode(gameData.latestCode);

      } catch (error) {
        console.error("Error loading marketplace game:", error);
        toast.error("Failed to load game", {
          description: "There was an error loading the game.",
        });
        router.push("/marketplace");
      } finally {
        setIsLoading(false);
      }
    };

    loadGameData();
  }, [gameId, router]);

  // Update preview when game code is loaded
  React.useEffect(() => {
    if (gameCode) {
      setSrcDoc(`
        <html>
          <body>${gameCode.html}</body>
          <style>${gameCode.css}</style>
          <script type="module">${gameCode.javascript}</script>
        </html>
      `);
    }
  }, [gameCode]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!game || !gameCode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This game is not available in the marketplace.
          </p>
          <Button onClick={() => router.push("/marketplace")}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/marketplace")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Marketplace
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{game.name}</h1>
                {game.description && (
                  <p className="text-muted-foreground">{game.description}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Game metadata */}
          <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Created by {game.walletAddress.slice(0, 6)}...{game.walletAddress.slice(-4)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Published {game.publishedAt ? new Date(game.publishedAt).toLocaleDateString() : 'Recently'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Version {gameCode.version}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Preview */}
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="h-[600px]">
            <Preview srcDoc={srcDoc} />
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Enjoy playing this game! Visit the community section to see the code and create your own version.
          </p>
        </div>
      </div>
    </div>
  );
}