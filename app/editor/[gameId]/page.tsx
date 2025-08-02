"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Header } from "@/components/canvas-forge/Header";
import { CodeEditor } from "@/components/canvas-forge/CodeEditor";
import { Preview } from "@/components/canvas-forge/Preview";
import { EditorSkeleton } from "@/components/canvas-forge/EditorSkeleton";
// import { LoadingPreview } from "@/components/canvas-forge/LoadingPreview";
import { useRequireWallet } from "@/lib/wallet/wallet-context";
import { getGameById, getGameCheckpoints, generateGameWithCheckpoint, publishGame, unpublishGame, saveCodeChanges } from "@/lib/actions";
import type { GenerateGameCodeOutput } from "@/ai/flows/generate-game-code";
import type { CheckpointClient, GameClient } from "@/lib/models";
import { toast } from "sonner";
import { Bot, Loader2 } from "lucide-react";

const defaultHtml = `<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Game</title>
</head>
<body>
  <div id="game-container">
    <h1>Welcome to your new game!</h1>
    <p>Use the AI generator to create your game code.</p>
  </div>
</body>
</html>`;

const defaultCss = `body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

#game-container {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

p {
  font-size: 1.2em;
  opacity: 0.9;
}`;

const defaultJs = `console.log('Welcome to your new game!');

// Add your game logic here
document.addEventListener('DOMContentLoaded', function() {
  console.log('Game initialized');
});`;

export default function GameEditorPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;

  const { normalizedAddress, shouldShowConnectPrompt } = useRequireWallet();

  const [game, setGame] = React.useState<GameClient | null>(null);
  const [checkpoints, setCheckpoints] = React.useState<CheckpointClient[]>([]);
  const [html, setHtml] = React.useState(defaultHtml);
  const [css, setCss] = React.useState(defaultCss);
  const [js, setJs] = React.useState(defaultJs);
  const [srcDoc, setSrcDoc] = React.useState("");
  const [isGameGenerated, setIsGameGenerated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Load game data on mount
  React.useEffect(() => {
    if (!normalizedAddress || shouldShowConnectPrompt) return;

    const loadGameData = async () => {
      try {
        setIsLoading(true);

        // Load game details
        const gameData = await getGameById({
          gameId,
          walletAddress: normalizedAddress,
        });

        if (!gameData) {
          toast.error("Game not found", {
            description: "The game doesn't exist or you don't have access to it.",
          });
          router.push("/editor");
          return;
        }

        setGame(gameData);

        // Load checkpoints
        const checkpointsData = await getGameCheckpoints({
          gameId,
          walletAddress: normalizedAddress,
        });

        setCheckpoints(checkpointsData);

        // Load the latest checkpoint if available
        if (checkpointsData.length > 0) {
          const latestCheckpoint = checkpointsData[0]; // Already sorted by version desc
          setHtml(latestCheckpoint.html);
          setCss(latestCheckpoint.css);
          setJs(latestCheckpoint.javascript);
          setIsGameGenerated(true);
        }

      } catch (error) {
        console.error("Error loading game data:", error);
        toast.error("Failed to load game", {
          description: "There was an error loading the game data.",
        });
        router.push("/editor");
      } finally {
        setIsLoading(false);
      }
    };

    loadGameData();
  }, [gameId, normalizedAddress, shouldShowConnectPrompt, router]);

  // Update preview when code changes
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script type="module">${js}</script>
        </html>
      `);
    }, 500);

    return () => clearTimeout(handler);
  }, [html, css, js]);



  const handleExport = () => {
    const content = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${game?.name || 'CanvasForge Export'}</title>
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          ${js}
        </script>
      </body>
      </html>
    `;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${game?.name || 'game'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Game Exported!", {
      description: "Your game has been exported successfully.",
    });
  };

  const handleShare = () => {
    const data = { html, css, js };
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}/editor#${encoded}`;
    navigator.clipboard.writeText(url);
    toast.success("Game Shared!", {
      description: "Share this link with others to collaborate on the game.",
    });
  };

  const handleSave = async () => {
    if (!normalizedAddress || !game) return;

    try {
      setIsSaving(true);

      // Save the current code changes as a checkpoint
      await saveCodeChanges({
        gameId,
        walletAddress: normalizedAddress,
        html,
        css,
        javascript: js,
      });

      // Refresh checkpoints list
      const updatedCheckpoints = await getGameCheckpoints({
        gameId,
        walletAddress: normalizedAddress,
      });
      setCheckpoints(updatedCheckpoints);

      toast.success("Game Saved!", {
        description: "Your code changes have been saved as a new checkpoint.",
      });

    } catch (error) {
      console.error("Error saving game:", error);
      toast.error("Save Failed", {
        description: "There was an error saving your code changes.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async (output: GenerateGameCodeOutput) => {
    if (!normalizedAddress || !game) return;

    try {
      setIsSaving(true);

      // Generate and auto-save the new code
      const result = await generateGameWithCheckpoint({
        prompt: output.description || "AI Generated Game",
        previousHtml: html,
        previousCss: css,
        previousJs: js,
        gameId,
        walletAddress: normalizedAddress,
        saveAsCheckpoint: true,
      });

      setHtml(result.html);
      setCss(result.css);
      setJs(result.javascript);
      setIsGameGenerated(true);

      // Refresh checkpoints list
      const updatedCheckpoints = await getGameCheckpoints({
        gameId,
        walletAddress: normalizedAddress,
      });
      setCheckpoints(updatedCheckpoints);

      toast.success("Game Generated & Saved!", {
        description: "Your game has been generated and automatically saved.",
      });

    } catch (error) {
      console.error("Error generating game:", error);
      toast.error("Generation Failed", {
        description: "There was an error generating the game code.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishToMarketplace = async () => {
    if (!normalizedAddress || !game) return;

    try {
      if (game.publishedToMarketplace) {
        // Unpublish from marketplace
        const success = await unpublishGame({
          gameId,
          walletAddress: normalizedAddress,
          unpublishFrom: 'marketplace',
        });

        if (success) {
          setGame(prev => prev ? { ...prev, publishedToMarketplace: false } : null);
          toast.success("Game Unpublished!", {
            description: "Your game has been removed from the marketplace.",
          });
        }
      } else {
        // Publish to marketplace
        const success = await publishGame({
          gameId,
          walletAddress: normalizedAddress,
          publishTo: 'marketplace',
        });

        if (success) {
          setGame(prev => prev ? {
            ...prev,
            publishedToMarketplace: true,
            publishedAt: prev.publishedAt || new Date()
          } : null);
          toast.success("Game Published to Marketplace!", {
            description: "Your game is now visible to all users in the marketplace.",
          });
        }
      }
    } catch (error) {
      console.error("Error publishing to marketplace:", error);
      toast.error("Publishing Failed", {
        description: "There was an error publishing your game to the marketplace.",
      });
    }
  };

  const handlePublishToCommunity = async () => {
    if (!normalizedAddress || !game) return;

    try {
      if (game.publishedToCommunity) {
        // Unpublish from community
        const success = await unpublishGame({
          gameId,
          walletAddress: normalizedAddress,
          unpublishFrom: 'community',
        });

        if (success) {
          setGame(prev => prev ? { ...prev, publishedToCommunity: false } : null);
          toast.success("Game Unpublished!", {
            description: "Your game has been removed from the community.",
          });
        }
      } else {
        // Publish to community
        const success = await publishGame({
          gameId,
          walletAddress: normalizedAddress,
          publishTo: 'community',
        });

        if (success) {
          setGame(prev => prev ? {
            ...prev,
            publishedToCommunity: true,
            publishedAt: prev.publishedAt || new Date()
          } : null);
          toast.success("Game Published to Community!", {
            description: "Your game is now visible in the community with code showcase.",
          });
        }
      }
    } catch (error) {
      console.error("Error publishing to community:", error);
      toast.error("Publishing Failed", {
        description: "There was an error publishing your game to the community.",
      });
    }
  };

  // Show wallet connection prompt
  if (shouldShowConnectPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Wallet Connection Required
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Connect your wallet to access the AI-powered game editor and manage your creations securely.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Secure wallet-based ownership</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>AI-powered game generation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Version control & checkpoints</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Loading Game Editor
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Preparing your workspace and loading game data...
            </p>
            <div className="w-full max-w-xs mx-auto">
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show full skeleton during generation or saving
  if (isGenerating || isSaving) {
    const message = isGenerating ? "AI Generating Game..." : "Saving to Database...";
    return <EditorSkeleton message={message} showAIIcon={isGenerating} />;
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <Header
        onExport={handleExport}
        onShare={handleShare}
        onSave={handleSave}
        onGenerate={handleGenerate}
        onPublishToMarketplace={handlePublishToMarketplace}
        onPublishToCommunity={handlePublishToCommunity}
        html={html}
        css={css}
        js={js}
        isGameGenerated={isGameGenerated}
        gameTitle={game?.name || 'New Game'}
        isSaving={isSaving}
        checkpointCount={checkpoints.length}
        isPublishedToMarketplace={game?.publishedToMarketplace}
        isPublishedToCommunity={game?.publishedToCommunity}
        onGeneratingChange={setIsGenerating}
      />
      <main className="flex-grow p-4 pt-2">
        <div className="h-full rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full bg-card/80 backdrop-blur-sm">
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel defaultSize={33} minSize={20}>
                    <div className="h-full border-b border-border/30">
                      <CodeEditor language="HTML" value={html} onChange={setHtml} />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={33} minSize={20}>
                    <div className="h-full border-b border-border/30">
                      <CodeEditor language="CSS" value={css} onChange={setCss} />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={34} minSize={20}>
                    <div className="h-full">
                      <CodeEditor language="JavaScript" value={js} onChange={setJs} />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full bg-card/80 backdrop-blur-sm border-l border-border/30">
                <Preview srcDoc={srcDoc} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </main>
    </div>
  );
}