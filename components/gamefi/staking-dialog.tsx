'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ethers } from 'ethers';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Coins,
  TrendingUp,
  Users,
  Calculator,
  Info,
  Loader2,
  Zap,
  Target,
  Award,
} from 'lucide-react';
import type { GameNFT, StakingInfo, TokenBalance } from '@/lib/gamefi/types';
import { GameFiContracts } from '@/lib/gamefi/contracts';
import { useWallet } from '@/lib/wallet/wallet-context';

const stakingSchema = z.object({
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    'Amount must be a positive number'
  ),
});

type StakingFormData = z.infer<typeof stakingSchema>;

interface StakingDialogProps {
  game: GameNFT;
  stakingInfo: StakingInfo;
  tokenBalance: TokenBalance;
  onStakeSuccess?: (tokenId: string, amount: string) => void;
  children: React.ReactNode;
}

export function StakingDialog({
  game,
  stakingInfo,
  tokenBalance,
  onStakeSuccess,
  children,
}: StakingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [activeTab, setActiveTab] = useState('stake');
  const [estimatedRewards, setEstimatedRewards] = useState('0');
  const { normalizedAddress } = useWallet();

  const form = useForm<StakingFormData>({
    resolver: zodResolver(stakingSchema),
    defaultValues: {
      amount: '',
    },
  });

  const watchedAmount = form.watch('amount');

  // Calculate estimated rewards based on amount
  useEffect(() => {
    if (watchedAmount && !isNaN(parseFloat(watchedAmount))) {
      const amount = parseFloat(watchedAmount);
      const estimatedAPY = stakingInfo.apy / 100;
      const dailyReward = (amount * estimatedAPY) / 365;
      setEstimatedRewards(dailyReward.toFixed(4));
    } else {
      setEstimatedRewards('0');
    }
  }, [watchedAmount, stakingInfo.apy]);

  const onStake = async (data: StakingFormData) => {
    if (!normalizedAddress) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsStaking(true);
    try {
      // In a real implementation, you'd use the GameFiContracts class
      // This is a simplified version for demonstration
      const amountWei = ethers.utils.parseEther(data.amount);
      
      // Simulate staking transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast.success('Tokens Staked Successfully!', {
        description: `Staked ${data.amount} JEU on ${game.gameTitle}`,
      });

      onStakeSuccess?.(game.tokenId, data.amount);
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Staking error:', error);
      toast.error('Staking Failed', {
        description: 'Please try again later',
      });
    } finally {
      setIsStaking(false);
    }
  };

  const onUnstake = async () => {
    if (!normalizedAddress) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsUnstaking(true);
    try {
      // Simulate unstaking transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast.success('Tokens Unstaked Successfully!', {
        description: 'Rewards have been claimed automatically',
      });

      onStakeSuccess?.(game.tokenId, '0');
      setIsOpen(false);
    } catch (error) {
      console.error('Unstaking error:', error);
      toast.error('Unstaking Failed', {
        description: 'Please try again later',
      });
    } finally {
      setIsUnstaking(false);
    }
  };

  const availableBalance = ethers.utils.formatEther(tokenBalance.availableBalance || '0');
  const userStaked = ethers.utils.formatEther(stakingInfo.userStaked || '0');
  const totalStaked = ethers.utils.formatEther(stakingInfo.totalStaked || '0');
  const pendingRewards = ethers.utils.formatEther(stakingInfo.pendingRewards || '0');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Stake on {game.gameTitle}
          </DialogTitle>
          <DialogDescription>
            Support this game and earn rewards from its success
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Game and Staking Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  Your Position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Staked</span>
                  <span className="font-medium">{parseFloat(userStaked).toFixed(2)} JEU</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Share</span>
                  <span className="font-medium">{stakingInfo.userShare.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pending Rewards</span>
                  <span className="font-medium text-green-600">
                    {parseFloat(pendingRewards).toFixed(4)} JEU
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Pool Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Staked</span>
                  <span className="font-medium">{parseFloat(totalStaked).toFixed(2)} JEU</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">APY</span>
                  <span className="font-medium text-green-600">{stakingInfo.apy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Game Score</span>
                  <span className="font-medium">{game.gameScore.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Indicators */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-500" />
                Game Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{game.totalPlays.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Plays</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{game.totalForks}</div>
                  <div className="text-xs text-muted-foreground">Forks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {parseFloat(totalStaked).toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground">JEU Staked</div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Staking Progress</span>
                  <span>{((parseFloat(totalStaked) / 100000) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(parseFloat(totalStaked) / 100000) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  Target: 100,000 JEU for maximum rewards
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Staking Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stake">Stake Tokens</TabsTrigger>
              <TabsTrigger value="unstake">Unstake</TabsTrigger>
            </TabsList>

            <TabsContent value="stake" className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onStake)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount to Stake</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="0.0"
                              type="number"
                              step="0.01"
                              min="0"
                              max={availableBalance}
                              {...field}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Badge variant="secondary">JEU</Badge>
                            </div>
                          </div>
                        </FormControl>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Available: {parseFloat(availableBalance).toFixed(2)} JEU</span>
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            className="h-auto p-0"
                            onClick={() => form.setValue('amount', availableBalance)}
                          >
                            Max
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Reward Estimation */}
                  {watchedAmount && !isNaN(parseFloat(watchedAmount)) && (
                    <Card className="bg-muted/30">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Calculator className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-sm">Estimated Rewards</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Daily</div>
                            <div className="font-medium text-green-600">
                              {estimatedRewards} JEU
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Monthly</div>
                            <div className="font-medium text-green-600">
                              {(parseFloat(estimatedRewards) * 30).toFixed(4)} JEU
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <Info className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Estimates based on current APY and game performance
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isStaking || !watchedAmount}>
                      {isStaking ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Staking...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Stake Tokens
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="unstake" className="space-y-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Your Staking Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Currently Staked</span>
                          <span className="font-medium">{parseFloat(userStaked).toFixed(4)} JEU</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Unclaimed Rewards</span>
                          <span className="font-medium text-green-600">
                            {parseFloat(pendingRewards).toFixed(4)} JEU
                          </span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-medium">
                            <span>Total Withdrawable</span>
                            <span>
                              {(parseFloat(userStaked) + parseFloat(pendingRewards)).toFixed(4)} JEU
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-orange-600 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium text-orange-800 dark:text-orange-200">
                            Unstaking Notice
                          </div>
                          <div className="text-orange-700 dark:text-orange-300">
                            When you unstake, all pending rewards will be automatically claimed.
                            This action cannot be undone.
                          </div>
                        </div>
                      </div>
                    </div>
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
                <Button
                  variant="destructive"
                  onClick={onUnstake}
                  disabled={isUnstaking || parseFloat(userStaked) === 0}
                >
                  {isUnstaking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Unstaking...
                    </>
                  ) : (
                    'Unstake All'
                  )}
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}