'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Loader2, Coins, Info } from 'lucide-react';
import { createGame } from '@/lib/actions';
import { useWallet } from '@/lib/wallet/wallet-context';
import { useGameFi } from '@/lib/gamefi/gamefi-context';

const createGameSchema = z.object({
  name: z.string().min(1, 'Game name is required').max(100, 'Game name must be less than 100 characters'),
  description: z.string().optional(),
  tokenizeGame: z.boolean().default(false),
});

type CreateGameFormData = z.infer<typeof createGameSchema>;

interface CreateGameDialogProps {
  onGameCreated?: () => void;
}

export function CreateGameDialog({ onGameCreated }: CreateGameDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const router = useRouter();
  const { normalizedAddress } = useWallet();
  const { mintGameNFT, contracts } = useGameFi();

  const form = useForm<CreateGameFormData>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      name: '',
      description: '',
      tokenizeGame: false,
    },
  });

  const onSubmit = async (data: CreateGameFormData) => {
    if (!normalizedAddress) {
      console.error('No wallet address available');
      return;
    }

    setIsLoading(true);
    try {
      // Create the game first
      const game = await createGame({
        name: data.name,
        walletAddress: normalizedAddress,
        description: data.description || undefined,
      });

      let tokenId = null;
      
      // If user wants to tokenize, mint NFT
      if (data.tokenizeGame && contracts) {
        try {
          setIsMinting(true);
          
          // Create IPFS metadata (simplified - in production use actual IPFS)
          const metadata = {
            name: data.name,
            description: data.description || `Game created by ${normalizedAddress}`,
            creator: normalizedAddress,
            gameId: game._id,
            createdAt: new Date().toISOString(),
          };
          
          const ipfsHash = `QmGame${game._id}`; // Simplified IPFS hash
          
          // Mint the NFT
          tokenId = await mintGameNFT(
            data.name,
            data.description || `Game created by ${normalizedAddress}`,
            ipfsHash
          );
          
          console.log('Game tokenized with NFT ID:', tokenId);
        } catch (mintError) {
          console.error('Error minting NFT:', mintError);
          // Continue even if minting fails - game is still created
        } finally {
          setIsMinting(false);
        }
      }

      // Reset form and close dialog
      form.reset();
      setOpen(false);

      // Notify parent component
      onGameCreated?.();

      // Navigate to the game-specific editor
      router.push(`/editor/${game._id}`);
    } catch (error) {
      console.error('Error creating game:', error);
      // You could add toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-12">
          <Plus className="h-5 w-5" />
          Create New Game
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Game</DialogTitle>
          <DialogDescription>
            Give your game a name and optional description to get started.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter game name..."
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your game idea..."
                      className="min-h-20"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tokenizeGame"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <FormLabel className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-primary" />
                        Tokenize as NFT
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Create an NFT for ownership and royalties
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading || !contracts}
                      />
                    </FormControl>
                  </div>
                  
                  {field.value && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Your game will be minted as an NFT, enabling royalties from plays, forks, and staking.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {!contracts && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Connect to a supported network to enable tokenization.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || isMinting}>
                {(isLoading || isMinting) && <Loader2 className="h-4 w-4 animate-spin" />}
                {isMinting ? 'Minting NFT...' : isLoading ? 'Creating...' : 'Create Game'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}