'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Coins,
  TrendingUp,
  Users,
  GitFork,
  Play,
  Calendar,
  Download,
  Eye,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';
import type { GameNFT, RoyaltyInfo } from '@/lib/gamefi/types';

interface RoyaltyData {
  gameId: string;
  gameName: string;
  totalEarned: string;
  playEarnings: string;
  forkEarnings: string;
  stakingRewards: string;
  pendingAmount: string;
  totalPlays: number;
  totalForks: number;
  monthlyTrend: number;
  lastClaimed: string;
}

interface RoyaltyDashboardProps {
  games: GameNFT[];
  onClaimRoyalties?: (gameId: string) => void;
}

export function RoyaltyDashboard({ games, onClaimRoyalties }: RoyaltyDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isClaimingAll, setIsClaimingAll] = useState(false);
  const [claimingGameId, setClaimingGameId] = useState<string | null>(null);

  // Mock royalty data - in real implementation, this would come from props or API
  const royaltyData: RoyaltyData[] = games.map((game, index) => ({
    gameId: game.tokenId,
    gameName: game.gameTitle,
    totalEarned: (Math.random() * 1000 + 100).toFixed(2),
    playEarnings: (Math.random() * 500 + 50).toFixed(2),
    forkEarnings: (Math.random() * 300 + 20).toFixed(2),
    stakingRewards: (Math.random() * 200 + 10).toFixed(2),
    pendingAmount: (Math.random() * 50 + 5).toFixed(2),
    totalPlays: Math.floor(Math.random() * 1000 + 100),
    totalForks: Math.floor(Math.random() * 50 + 5),
    monthlyTrend: (Math.random() - 0.5) * 50,
    lastClaimed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  const totalEarnings = royaltyData.reduce((sum, data) => sum + parseFloat(data.totalEarned), 0);
  const totalPending = royaltyData.reduce((sum, data) => sum + parseFloat(data.pendingAmount), 0);
  const totalPlays = royaltyData.reduce((sum, data) => sum + data.totalPlays, 0);
  const totalForks = royaltyData.reduce((sum, data) => sum + data.totalForks, 0);

  const handleClaimRoyalties = async (gameId: string) => {
    setClaimingGameId(gameId);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onClaimRoyalties?.(gameId);
    } catch (error) {
      console.error('Error claiming royalties:', error);
    } finally {
      setClaimingGameId(null);
    }
  };

  const handleClaimAll = async () => {
    setIsClaimingAll(true);
    try {
      // Simulate claiming all pending royalties
      await new Promise((resolve) => setTimeout(resolve, 3000));
      royaltyData.forEach((data) => {
        if (parseFloat(data.pendingAmount) > 0) {
          onClaimRoyalties?.(data.gameId);
        }
      });
    } catch (error) {
      console.error('Error claiming all royalties:', error);
    } finally {
      setIsClaimingAll(false);
    }
  };

  if (royaltyData.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Coins className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Games Published</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Mint your games as NFTs to start earning royalties from plays, forks, and community staking.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Coins className="h-4 w-4 text-green-500" />
              Total Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalEarnings.toFixed(2)} JEU
            </div>
            <div className="text-xs text-muted-foreground">All-time earnings</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalPending.toFixed(2)} JEU
            </div>
            <div className="text-xs text-muted-foreground">Ready to claim</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Play className="h-4 w-4 text-purple-500" />
              Total Plays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalPlays.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Across all games</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GitFork className="h-4 w-4 text-orange-500" />
              Total Forks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {totalForks}
            </div>
            <div className="text-xs text-muted-foreground">Community forks</div>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="1y">1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          {totalPending > 0 && (
            <Button onClick={handleClaimAll} disabled={isClaimingAll}>
              {isClaimingAll ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Claiming...
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4 mr-2" />
                  Claim All ({totalPending.toFixed(2)} JEU)
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Games Royalty Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Game Royalties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {royaltyData.map((data) => (
              <div
                key={data.gameId}
                className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{data.gameName}</h3>
                      <Badge variant="outline" className="text-xs">
                        #{data.gameId}
                      </Badge>
                      {data.monthlyTrend > 0 && (
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          +{data.monthlyTrend.toFixed(1)}%
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Total Earned</div>
                        <div className="font-medium">{data.totalEarned} JEU</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Plays</div>
                        <div className="font-medium">{data.totalPlays.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Forks</div>
                        <div className="font-medium">{data.totalForks}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Last Claimed</div>
                        <div className="font-medium">
                          {new Date(data.lastClaimed).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-primary mb-1">
                      {data.pendingAmount} JEU
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">Pending</div>
                    <Button
                      size="sm"
                      onClick={() => handleClaimRoyalties(data.gameId)}
                      disabled={
                        parseFloat(data.pendingAmount) === 0 || 
                        claimingGameId === data.gameId ||
                        isClaimingAll
                      }
                    >
                      {claimingGameId === data.gameId ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          Claiming...
                        </>
                      ) : (
                        'Claim'
                      )}
                    </Button>
                  </div>
                </div>

                <Separator className="my-3" />

                {/* Earnings Breakdown */}
                <div className="space-y-3">
                  <div className="text-sm font-medium">Earnings Breakdown</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Play className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Play Rewards</span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {data.playEarnings} JEU
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {((parseFloat(data.playEarnings) / parseFloat(data.totalEarned)) * 100).toFixed(1)}% of total
                      </div>
                    </div>

                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <GitFork className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">Fork Fees</span>
                      </div>
                      <div className="text-lg font-bold text-orange-600">
                        {data.forkEarnings} JEU
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {((parseFloat(data.forkEarnings) / parseFloat(data.totalEarned)) * 100).toFixed(1)}% of total
                      </div>
                    </div>

                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Staking Share</span>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {data.stakingRewards} JEU
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {((parseFloat(data.stakingRewards) / parseFloat(data.totalEarned)) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Top Performing Games</h4>
              <div className="space-y-2">
                {royaltyData
                  .sort((a, b) => parseFloat(b.totalEarned) - parseFloat(a.totalEarned))
                  .slice(0, 3)
                  .map((data, index) => (
                    <div key={data.gameId} className="flex items-center gap-3">
                      <div className="h-6 w-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{data.gameName}</div>
                        <div className="text-xs text-muted-foreground">
                          {data.totalPlays.toLocaleString()} plays
                        </div>
                      </div>
                      <div className="text-sm font-medium text-primary">
                        {data.totalEarned} JEU
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Earnings Trends</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average per game</span>
                  <span className="font-medium">
                    {(totalEarnings / royaltyData.length).toFixed(2)} JEU
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Best performing genre</span>
                  <span className="font-medium">Action Games</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. plays per fork</span>
                  <span className="font-medium">
                    {totalForks > 0 ? Math.floor(totalPlays / totalForks) : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}