"use client";

import { Bot, Download, Share2, Store, Users, Loader2, Save, ArrowLeft, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameGeneratorDialog } from "./GameGeneratorDialog";
import { NFTMintDialog } from "@/components/gamefi/nft-mint-dialog";
import type { GenerateGameCodeOutput } from "@/ai/flows/generate-game-code";
import type { GameClient } from "@/lib/models";
import Link from "next/link";
import { useGameFi, useCrossFiNetwork } from "@/lib/gamefi/gamefi-context";

interface HeaderProps {
  onExport: () => void;
  onShare: () => void;
  onSave: () => void;
  onGenerate: (output: GenerateGameCodeOutput) => void;
  onPublishToMarketplace: () => void;
  onPublishToCommunity: () => void;
  html: string;
  css: string;
  js: string;
  isGameGenerated: boolean;
  gameTitle?: string;
  isSaving?: boolean;
  checkpointCount?: number;
  isPublishedToMarketplace?: boolean;
  isPublishedToCommunity?: boolean;
  onGeneratingChange?: (isGenerating: boolean) => void;
  game?: GameClient;
  onNFTMinted?: (tokenId: string) => void;
}

export function Header({
  onExport,
  onShare,
  onSave,
  onGenerate,
  onPublishToMarketplace,
  onPublishToCommunity,
  html,
  css,
  js,
  isGameGenerated,
  gameTitle,
  isSaving,
  checkpointCount,
  isPublishedToMarketplace,
  isPublishedToCommunity,
  onGeneratingChange,
  game,
  onNFTMinted
}: HeaderProps) {
  const { isCrossFi } = useCrossFiNetwork();
  const { mintGameNFT } = useGameFi();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left Section - Game Info */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* back button */}
          <Link href={"/editor"}>
            <Button
              variant="outline"
              className="border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg font-semibold truncate bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {gameTitle}
            </h1>
            {checkpointCount !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {checkpointCount} checkpoint{checkpointCount !== 1 ? 's' : ''}
                </span>
                {checkpointCount > 0 && (
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                )}
              </div>
            )}
          </div>

          {isSaving && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span className="text-xs font-medium text-primary hidden sm:inline">
                Saving to database...
              </span>
            </div>
          )}
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-1 lg:gap-2">
          {/* Primary Actions */}
          <div className="flex items-center gap-1">
            <GameGeneratorDialog
              onGenerate={onGenerate}
              html={html}
              css={css}
              js={js}
              isGameGenerated={isGameGenerated}
              onGeneratingChange={onGeneratingChange}
            >
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isSaving}
              >
                <Bot className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  {isGameGenerated ? 'Refine' : 'Generate'}
                </span>
              </Button>
            </GameGeneratorDialog>

            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              className="border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-200"
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </div>

          {/* Publishing Actions */}
          <div className="hidden md:flex items-center gap-1 ml-2 pl-2 border-l border-border/40">
            {/* NFT Mint Button - CrossFi only */}
            {isCrossFi && isGameGenerated && game && (
              <NFTMintDialog
                game={game}
                gameCode={{ html, css, javascript: js }}
                onMintSuccess={(tokenId) => {
                  onNFTMinted?.(tokenId);
                }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-purple-500/10 hover:text-purple-600 transition-all duration-200"
                  disabled={isSaving}
                >
                  <Coins className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">Mint NFT</span>
                </Button>
              </NFTMintDialog>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onPublishToMarketplace}
              className={`hover:bg-green-500/10 hover:text-green-600 transition-all duration-200 ${isPublishedToMarketplace ? 'bg-green-500/10 text-green-600 border border-green-500/20' : ''
                }`}
              disabled={!isGameGenerated || isSaving}
            >
              <Store className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">
                {isPublishedToMarketplace ? 'Published' : 'Marketplace'}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onPublishToCommunity}
              className={`hover:bg-blue-500/10 hover:text-blue-600 transition-all duration-200 ${isPublishedToCommunity ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' : ''
                }`}
              disabled={!isGameGenerated || isSaving}
            >
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">
                {isPublishedToCommunity ? 'Published' : 'Community'}
              </span>
            </Button>
          </div>

          {/* Utility Actions */}
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border/40">
            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              className="hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              disabled={isSaving}
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden lg:inline ml-2">Share</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              className="hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              disabled={isSaving}
            >
              <Download className="h-4 w-4" />
              <span className="hidden lg:inline ml-2">Export</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
