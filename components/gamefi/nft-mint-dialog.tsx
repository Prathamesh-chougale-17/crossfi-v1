'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Coins,
  Loader2,
  Zap,
  Star,
  Trophy,
  Users,
  ArrowRight,
  Sparkles,
  Shield,
  Info,
} from 'lucide-react';
import type { GameClient } from '@/lib/models';
import { useWallet } from '@/lib/wallet/wallet-context';

const nftMintSchema = z.object({
  gameTitle: z.string().min(1, 'Game title is required').max(100, 'Title too long'),
  gameDescription: z.string().max(500, 'Description too long').optional(),
  mintingFee: z.string().default('100'), // 100 JEU default minting fee
  royaltyPercentage: z.number().min(1).max(10).default(5), // 5% default royalty
});

type NFTMintFormData = z.infer<typeof nftMintSchema>;

interface NFTMintDialogProps {
  game: GameClient;
  gameCode: {
    html: string;
    css: string;
    javascript: string;
  };
  onMintSuccess?: (tokenId: string) => void;
  children: React.ReactNode;
}

export function NFTMintDialog({
  game,
  gameCode,
  onMintSuccess,
  children,
}: NFTMintDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { normalizedAddress } = useWallet();

  const form = useForm<NFTMintFormData>({
    resolver: zodResolver(nftMintSchema),
    defaultValues: {
      gameTitle: game.name || '',
      gameDescription: game.description || '',
      mintingFee: '100',
      royaltyPercentage: 5,
    },
  });

  const onMint = async (data: NFTMintFormData) => {
    if (!normalizedAddress) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsMinting(true);
    try {
      // Step 1: Upload game code to IPFS
      setCurrentStep(1);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const mockIpfsHash = `QmX${Math.random().toString(36).substring(2, 15)}`;
      
      // Step 2: Generate metadata and upload
      setCurrentStep(2);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const metadata = {
        name: data.gameTitle,
        description: data.gameDescription,
        image: `https://api.dicebear.com/7.x/shapes/svg?seed=${data.gameTitle}`,
        attributes: [
          { trait_type: 'Creator', value: normalizedAddress },
          { trait_type: 'Game Type', value: 'Canvas Game' },
          { trait_type: 'Royalty', value: `${data.royaltyPercentage}%` },
          { trait_type: 'Code Hash', value: mockIpfsHash },
        ],
        properties: {
          files: [
            { uri: `ipfs://${mockIpfsHash}/game.html`, type: 'text/html' },
            { uri: `ipfs://${mockIpfsHash}/game.css`, type: 'text/css' },
            { uri: `ipfs://${mockIpfsHash}/game.js`, type: 'text/javascript' },
          ],
        },
      };
      
      const mockMetadataHash = `QmM${Math.random().toString(36).substring(2, 15)}`;
      
      // Step 3: Mint NFT on blockchain
      setCurrentStep(3);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const mockTokenId = Math.floor(Math.random() * 10000).toString();
      
      toast.success('Game NFT Minted Successfully!', {
        description: `Token ID: ${mockTokenId}`,
        duration: 5000,
      });

      onMintSuccess?.(mockTokenId);
      form.reset();
      setIsOpen(false);
      setCurrentStep(1);
    } catch (error) {
      console.error('Minting error:', error);
      toast.error('Minting Failed', {
        description: 'Please try again later',
      });
    } finally {
      setIsMinting(false);
      setCurrentStep(1);
    }
  };

  const mintingSteps = [
    { step: 1, title: 'Upload to IPFS', description: 'Storing game code on decentralized storage' },
    { step: 2, title: 'Generate Metadata', description: 'Creating NFT metadata and properties' },
    { step: 3, title: 'Mint NFT', description: 'Creating your game NFT on CrossFi blockchain' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Mint Game NFT
          </DialogTitle>
          <DialogDescription>
            Transform your game into an NFT and start earning royalties from plays and forks
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Benefits Overview */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                NFT Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Coins className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="font-medium text-sm">Earn Royalties</div>
                  <div className="text-xs text-muted-foreground">
                    Get paid when others play or fork your game
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="font-medium text-sm">Community Staking</div>
                  <div className="text-xs text-muted-foreground">
                    Others can stake on your game's success
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="font-medium text-sm">Ownership Proof</div>
                  <div className="text-xs text-muted-foreground">
                    Blockchain-verified game ownership
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {!isMinting ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onMint)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="gameTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NFT Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter NFT title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gameDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your game NFT..."
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mintingFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minting Fee</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input {...field} disabled />
                            <Badge className="absolute right-3 top-1/2 -translate-y-1/2">
                              JEU
                            </Badge>
                          </div>
                        </FormControl>
                        <div className="text-xs text-muted-foreground">
                          Platform minting fee (fixed)
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="royaltyPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Royalty Percentage</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              %
                            </span>
                          </div>
                        </FormControl>
                        <div className="text-xs text-muted-foreground">
                          Royalty from plays and forks (1-10%)
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Game Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Game Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Code Size</span>
                      <span className="font-medium">
                        {((gameCode.html.length + gameCode.css.length + gameCode.javascript.length) / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Storage</span>
                      <span className="font-medium">IPFS (Decentralized)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Blockchain</span>
                      <span className="font-medium">CrossFi Network</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Breakdown */}
                <Card className="bg-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      Cost Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Minting Fee</span>
                      <span>100 JEU</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gas Fee (estimated)</span>
                      <span>~5 JEU</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>IPFS Storage</span>
                      <span>Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total Cost</span>
                      <span>~105 JEU</span>
                    </div>
                  </CardContent>
                </Card>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-primary to-accent">
                    <Zap className="h-4 w-4 mr-2" />
                    Mint NFT
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            /* Minting Progress */
            <div className="space-y-6">
              <div className="text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <h3 className="font-semibold text-lg">Minting Your Game NFT</h3>
                <p className="text-muted-foreground">Please wait while we process your NFT...</p>
              </div>

              <div className="space-y-4">
                {mintingSteps.map((stepInfo, index) => (
                  <div key={stepInfo.step} className="flex items-center gap-4">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep > stepInfo.step
                          ? 'bg-green-500 text-white'
                          : currentStep === stepInfo.step
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {currentStep > stepInfo.step ? '✓' : stepInfo.step}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{stepInfo.title}</div>
                      <div className="text-sm text-muted-foreground">{stepInfo.description}</div>
                    </div>
                    {currentStep === stepInfo.step && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                  </div>
                ))}
              </div>

              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-blue-800 dark:text-blue-200">
                        Processing Transaction
                      </div>
                      <div className="text-blue-700 dark:text-blue-300">
                        Your NFT is being created on the CrossFi blockchain. This may take a few moments.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}