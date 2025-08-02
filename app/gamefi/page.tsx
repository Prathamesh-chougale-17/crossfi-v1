'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Coins,
  TrendingUp,
  Users,
  BarChart3,
  Vote,
  Star,
  Trophy,
  Gamepad2,
  Zap,
  Shield,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import HeaderWrapper from '@/components/header-wrapper';
import { PlayToEarnTracker } from '@/components/gamefi/play-to-earn-tracker';
import { RoyaltyDashboard } from '@/components/gamefi/royalty-dashboard';
import { AnalyticsDashboard } from '@/components/gamefi/analytics-dashboard';
import { GovernancePanel } from '@/components/gamefi/governance-panel';
import { useGameFi } from '@/lib/gamefi/gamefi-context';
import { useWallet } from '@/lib/wallet/wallet-context';
import { useCrossFiNetwork } from '@/lib/gamefi/gamefi-context';

export default function GameFiDashboard() {
  const { normalizedAddress } = useWallet();
  const { isCrossFi, networkName } = useCrossFiNetwork();
  const {
    tokenBalance,
    portfolioSummary,
    userGames,
    isLoadingBalance,
    isLoadingGames,
    isLoadingPortfolio,
    refreshBalance,
    refreshUserGames,
    refreshPortfolio,
  } = useGameFi();

  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock data for demonstration
  const mockTokenBalance = tokenBalance || {
    balance: '15000',
    lockedBalance: '5000',
    availableBalance: '10000',
    totalEarned: '3250',
    playToEarnTotal: '1200',
    stakingTotal: '1500',
    royaltyTotal: '550',
  };

  const mockUserGames = userGames.length > 0 ? userGames : [
    {
      tokenId: '1',
      creator: normalizedAddress || '',
      owner: normalizedAddress || '',
      gameTitle: 'Tank Battle Arena',
      gameDescription: 'Epic multiplayer tank battles',
      ipfsHash: 'QmExample1',
      tokenURI: '',
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      totalPlays: 1250,
      totalForks: 8,
      totalStaked: '25000',
      isActive: true,
      gameScore: 8750,
    },
    {
      tokenId: '2',
      creator: normalizedAddress || '',
      owner: normalizedAddress || '',
      gameTitle: 'Puzzle Master',
      gameDescription: 'Mind-bending puzzle challenges',
      ipfsHash: 'QmExample2',
      tokenURI: '',
      createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
      totalPlays: 890,
      totalForks: 3,
      totalStaked: '12000',
      isActive: true,
      gameScore: 6420,
    },
  ];

  if (!normalizedAddress) {
    return (
      <HeaderWrapper>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <div className="container mx-auto px-4 py-16">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="h-16 w-16 text-muted-foreground mb-6" />
                <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="text-muted-foreground text-center mb-6">
                  Connect your wallet to access the GameFi features including NFT minting, 
                  staking, play-to-earn rewards, and governance voting.
                </p>
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
                  <Coins className="h-5 w-5 mr-2" />
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </HeaderWrapper>
    );
  }

  if (!isCrossFi) {
    return (
      <HeaderWrapper>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <div className="container mx-auto px-4 py-16">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Zap className="h-16 w-16 text-orange-500 mb-6" />
                <h2 className="text-2xl font-bold mb-4">Switch to CrossFi Network</h2>
                <p className="text-muted-foreground text-center mb-6">
                  GameFi features are only available on the CrossFi network. 
                  Please switch your wallet to CrossFi to access tokenization, 
                  staking, and governance features.
                </p>
                <div className="text-sm text-muted-foreground mb-6">
                  Current network: <Badge variant="outline">{networkName}</Badge>
                </div>
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500">
                  <Zap className="h-5 w-5 mr-2" />
                  Switch to CrossFi
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </HeaderWrapper>
    );
  }

  return (
    <HeaderWrapper>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                  GameFi Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage your game assets, earnings, and community participation
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                  <Coins className="h-3 w-3 mr-1" />
                  CrossFi Network
                </Badge>
                <Button onClick={() => window.location.href = '/editor'}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Game
                </Button>
              </div>
            </div>

            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Coins className="h-4 w-4 text-primary" />
                    Total Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {parseFloat(mockTokenBalance.balance).toLocaleString()} JEU
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {parseFloat(mockTokenBalance.lockedBalance).toLocaleString()} locked in staking
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Total Earned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {parseFloat(mockTokenBalance.totalEarned).toLocaleString()} JEU
                  </div>
                  <div className="text-xs text-muted-foreground">All-time earnings</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4 text-blue-500" />
                    My Games
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{mockUserGames.length}</div>
                  <div className="text-xs text-muted-foreground">NFT games owned</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    Community Rank
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">#42</div>
                  <div className="text-xs text-muted-foreground">Top 5% creators</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="royalties">Royalties</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="governance">Governance</TabsTrigger>
              <TabsTrigger value="rewards">P2E Rewards</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => window.location.href = '/editor'}
                    >
                      <Plus className="h-5 w-5" />
                      <span>Create Game</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => window.location.href = '/marketplace'}
                    >
                      <Star className="h-5 w-5" />
                      <span>Browse Marketplace</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => window.location.href = '/community'}
                    >
                      <Users className="h-5 w-5" />
                      <span>Join Community</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => toast.info('Coming soon!')}
                    >
                      <Trophy className="h-5 w-5" />
                      <span>Competitions</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: 'Game NFT Minted', game: 'Tank Battle Arena', amount: '+500 JEU', time: '2 hours ago', type: 'mint' },
                      { action: 'Royalty Earned', game: 'Puzzle Master', amount: '+25.5 JEU', time: '6 hours ago', type: 'royalty' },
                      { action: 'Staking Reward', game: 'Racing Challenge', amount: '+12.3 JEU', time: '1 day ago', type: 'staking' },
                      { action: 'Play-to-Earn', game: 'Tank Shooter', amount: '+8.7 JEU', time: '1 day ago', type: 'play' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            activity.type === 'mint' ? 'bg-blue-500/20 text-blue-600' :
                            activity.type === 'royalty' ? 'bg-green-500/20 text-green-600' :
                            activity.type === 'staking' ? 'bg-purple-500/20 text-purple-600' :
                            'bg-orange-500/20 text-orange-600'
                          }`}>
                            {activity.type === 'mint' ? <Plus className="h-4 w-4" /> :
                             activity.type === 'royalty' ? <Coins className="h-4 w-4" /> :
                             activity.type === 'staking' ? <TrendingUp className="h-4 w-4" /> :
                             <Gamepad2 className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="font-medium">{activity.action}</div>
                            <div className="text-sm text-muted-foreground">{activity.game}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">{activity.amount}</div>
                          <div className="text-xs text-muted-foreground">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="royalties">
              <RoyaltyDashboard 
                games={mockUserGames}
                onClaimRoyalties={(gameId) => {
                  toast.success(`Royalties claimed for game ${gameId}!`);
                  refreshBalance();
                }}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard 
                games={mockUserGames}
                timeframe={selectedTimeframe}
                onTimeframeChange={setSelectedTimeframe}
              />
            </TabsContent>

            <TabsContent value="governance">
              <GovernancePanel
                tokenBalance={mockTokenBalance}
                userVotingPower={mockTokenBalance.balance}
                onVote={(proposalId, support, votingPower) => {
                  toast.success(`Vote cast on proposal ${proposalId}!`);
                }}
                onCreateProposal={(proposal) => {
                  toast.success('Proposal created successfully!');
                }}
              />
            </TabsContent>

            <TabsContent value="rewards">
              <PlayToEarnTracker 
                tokenBalance={mockTokenBalance}
                onClaimRewards={() => {
                  toast.success('Rewards claimed!');
                  refreshBalance();
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </HeaderWrapper>
  );
}