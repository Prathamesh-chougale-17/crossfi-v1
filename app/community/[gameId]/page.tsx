"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { CodeEditor } from "@/components/canvas-forge/CodeEditor";
import { Preview } from "@/components/canvas-forge/Preview";
import { getPublishedGameById, forkCommunityGame } from "@/lib/actions";
import { useRequireWallet } from "@/lib/wallet/wallet-context";
import type { GameClient } from "@/lib/models";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, Clock, GitFork, Code } from "lucide-react";

export default function CommunityGamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;

  const { normalizedAddress, shouldShowConnectPrompt } = useRequireWallet();

  const [game, setGame] = React.useState<GameClient | null>(null);
  const [gameCode, setGameCode] = React.useState<{
    html: string;
    css: string;
    javascript: string;
    version: number;
  } | null>(null);
  const [srcDoc, setSrcDoc] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isForking, setIsForking] = React.useState(false);

  // Load published game data
  React.useEffect(() => {
    const loadGameData = async () => {
      try {
        setIsLoading(true);

        const gameData = await getPublishedGameById({
          gameId,
          publishedTo: 'community',
        });

        if (!gameData) {
          toast.error("Game not found", {
            description: "This game is not available in the community.",
          });
          router.push("/community");
          return;
        }

        setGame(gameData.game);
        setGameCode(gameData.latestCode);

      } catch (error) {
        console.error("Error loading community game:", error);
        toast.error("Failed to load game", {
          description: "There was an error loading the game.",
        });
        router.push("/community");
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

  const handleForkGame = async () => {
    if (!normalizedAddress || !game) {
      toast.error("Wallet Required", {
        description: "Please connect your wallet to fork this game.",
      });
      return;
    }

    if (game.walletAddress === normalizedAddress) {
      toast.info("Cannot Fork Own Game", {
        description: "You cannot fork your own game. You can edit it directly in the editor.",
      });
      return;
    }

    try {
      setIsForking(true);

      const forkedGame = await forkCommunityGame({
        originalGameId: gameId,
        walletAddress: normalizedAddress,
      });

      toast.success("Game Forked Successfully!", {
        description: "You can now edit your own version of this game.",
      });

      // Navigate to the editor for the forked game
      router.push(`/editor/${forkedGame._id}`);

    } catch (error) {
      console.error("Error forking game:", error);
      toast.error("Fork Failed", {
        description: "There was an error creating your fork of this game.",
      });
    } finally {
      setIsForking(false);
    }
  };

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
            This game is not available in the community.
          </p>
          <Button onClick={() => router.push("/community")}>
            Back to Community
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex h-16 items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/community")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Community
          </Button>
          
          <div className="flex items-center gap-2">
            <Code className="h-8 w-8 text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]" />
            <div>
              <h1 className="text-xl font-bold tracking-tighter text-gray-100">
                {game.name}
              </h1>
              {game.description && (
                <p className="text-sm text-muted-foreground">{game.description}</p>
              )}
            </div>
          </div>
          
          {/* Game metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground border-l border-border pl-4">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{game.walletAddress.slice(0, 6)}...{game.walletAddress.slice(-4)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{game.publishedAt ? new Date(game.publishedAt).toLocaleDateString() : 'Recently'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>v{gameCode.version}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!shouldShowConnectPrompt && normalizedAddress && game.walletAddress !== normalizedAddress && (
            <Button 
              onClick={handleForkGame} 
              disabled={isForking}
              className="flex items-center gap-2"
            >
              <GitFork className="h-4 w-4" />
              {isForking ? 'Forking...' : 'Fork & Edit'}
            </Button>
          )}
          
          {shouldShowConnectPrompt && (
            <Button variant="outline" size="sm">
              Connect Wallet to Fork
            </Button>
          )}
        </div>
      </header>

      {/* Code and Preview */}
      <main className="flex-grow p-4 pt-0">
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={33}>
                <CodeEditor 
                  language="HTML" 
                  value={gameCode.html} 
                  onChange={() => {}} // Read-only
                  readOnly={true}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={33}>
                <CodeEditor 
                  language="CSS" 
                  value={gameCode.css} 
                  onChange={() => {}} // Read-only
                  readOnly={true}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={34}>
                <CodeEditor 
                  language="JavaScript" 
                  value={gameCode.javascript} 
                  onChange={() => {}} // Read-only
                  readOnly={true}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <Preview srcDoc={srcDoc} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}