'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Coins, Loader2, Info, CheckCircle } from 'lucide-react';
import { useGameFi } from '@/lib/gamefi/gamefi-context';
import { useWallet } from '@/lib/wallet/wallet-context';
import { toast } from 'sonner';
import { updateGameTokenization } from '@/lib/actions';

interface TokenizeButtonProps {
  gameId: string;
  gameTitle: string;
  gameDescription?: string;
  isTokenized?: boolean;
  onTokenized?: (tokenId: string) => void;
}

export function TokenizeButton({ 
  gameId, 
  gameTitle, 
  gameDescription,
  isTokenized = false,
  onTokenized 
}: TokenizeButtonProps) {
  const [open, setOpen] = useState(false);
  const [isTokenizing, setIsTokenizing] = useState(false);
  const { mintGameNFT, contracts } = useGameFi();
  const { normalizedAddress } = useWallet();

  const handleTokenize = async () => {
    if (!normalizedAddress || !contracts) {
      toast.error('Wallet connection required');
      return;
    }

    setIsTokenizing(true);
    try {
      // Create metadata for the NFT
      const metadata = {
        name: gameTitle,
        description: gameDescription || `Game created by ${normalizedAddress}`,
        creator: normalizedAddress,
        gameId: gameId,
        createdAt: new Date().toISOString(),
        attributes: [
          {
            trait_type: 'Game Type',
            value: 'AI Generated'
          },
          {
            trait_type: 'Platform',
            value: 'CanvasForge'
          },
          {
            trait_type: 'Creator',
            value: normalizedAddress
          }
        ]
      };
      
      // In production, you would upload to IPFS here
      const ipfsHash = `QmGame${gameId}${Date.now()}`;
      
      // Mint the NFT
      const tokenId = await mintGameNFT(
        gameTitle,
        gameDescription || `Interactive game created with CanvasForge`,
        ipfsHash
      );
      
      // Update the game record with tokenization info
      try {
        await updateGameTokenization({
          gameId: gameId,
          walletAddress: normalizedAddress,
          tokenId: tokenId,
          ipfsHash: ipfsHash
        });
      } catch (dbError) {
        console.error('Error updating game tokenization in database:', dbError);
        // Don't fail the whole process if database update fails
      }
      
      toast.success('Game Tokenized!', {
        description: `Your game is now an NFT with token ID: ${tokenId}`,
      });
      
      // Close dialog and notify parent
      setOpen(false);
      onTokenized?.(tokenId);
      
    } catch (error) {
      console.error('Error tokenizing game:', error);
      toast.error('Tokenization Failed', {
        description: 'There was an error creating the NFT for your game.',
      });
    } finally {
      setIsTokenizing(false);
    }
  };

  if (isTokenized) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <CheckCircle className="h-4 w-4 text-green-500" />
        Tokenized
      </Button>
    );
  }

  if (!contracts) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <Coins className="h-4 w-4" />
        Connect Network
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Coins className="h-4 w-4" />
          Tokenize Game
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Tokenize Your Game
          </DialogTitle>
          <DialogDescription>
            Convert your game into an NFT to enable ownership, royalties, and GameFi features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Game Title:</span>
              <span className="font-medium">{gameTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Creator:</span>
              <span className="font-mono text-xs">{normalizedAddress?.slice(0, 6)}...{normalizedAddress?.slice(-4)}</span>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Tokenization Benefits:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Earn royalties from game plays and forks</li>
                <li>• Enable community staking on your game</li>
                <li>• Tradeable ownership on the marketplace</li>
                <li>• Participate in GameFi governance</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              A small gas fee will be required to mint the NFT. This is a one-time cost and your game will be permanently tokenized.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isTokenizing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleTokenize}
            disabled={isTokenizing}
            className="gap-2"
          >
            {isTokenizing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Minting NFT...
              </>
            ) : (
              <>
                <Coins className="h-4 w-4" />
                Tokenize Game
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}