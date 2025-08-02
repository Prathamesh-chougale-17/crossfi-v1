'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  Users,
  Gamepad2,
  Star,
  Trophy,
  Target,
  Zap,
  DollarSign,
  Activity,
  Eye,
  GitFork,
} from 'lucide-react';
import type { GameNFT, GameMetrics } from '@/lib/gamefi/types';

interface AnalyticsData {
  totalGames: number;
  totalPlayers: number;
  totalPlays: number;
  totalEarnings: string;
  totalStaked: string;
  avgRating: number;
  topGenres: Array<{ name: string; count: number }>;
  growthRate: number;
  retentionRate: number;
}

interface AnalyticsDashboardProps {
  games: GameNFT[];
  timeframe: '7d' | '30d' | '90d' | '1y';
  onTimeframeChange?: (timeframe: '7d' | '30d' | '90d' | '1y') => void;
}

export function AnalyticsDashboard({ 
  games, 
  timeframe, 
  onTimeframeChange 
}: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalGames: 0,
    totalPlayers: 0,
    totalPlays: 0,
    totalEarnings: '0',
    totalStaked: '0',
    avgRating: 0,
    topGenres: [],
    growthRate: 0,
    retentionRate: 0,
  });

  const [gameMetrics, setGameMetrics] = useState<Record<string, GameMetrics>>({});
  const [selectedMetric, setSelectedMetric] = useState<'plays' | 'revenue' | 'staking' | 'ratings'>('plays');

  // Mock data generation - in real implementation, this would come from API
  useEffect(() => {
    const mockData: AnalyticsData = {
      totalGames: games.length,
      totalPlayers: Math.floor(Math.random() * 10000) + 1000,
      totalPlays: games.reduce((sum, game) => sum + game.totalPlays, 0),
      totalEarnings: (Math.random() * 100000 + 10000).toFixed(2),
      totalStaked: (Math.random() * 500000 + 50000).toFixed(2),
      avgRating: +(Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
      topGenres: [
        { name: 'Action', count: Math.floor(Math.random() * 20) + 5 },
        { name: 'Puzzle', count: Math.floor(Math.random() * 15) + 3 },
        { name: 'Strategy', count: Math.floor(Math.random() * 12) + 2 },
        { name: 'Adventure', count: Math.floor(Math.random() * 10) + 1 },
      ],
      growthRate: +(Math.random() * 50 + 10).toFixed(1), // 10-60% growth
      retentionRate: +(Math.random() * 40 + 50).toFixed(1), // 50-90% retention
    };

    setAnalyticsData(mockData);

    // Generate metrics for each game
    const metrics: Record<string, GameMetrics> = {};
    games.forEach(game => {
      metrics[game.tokenId] = {
        tokenId: game.tokenId,
        dailyPlays: Math.floor(Math.random() * 100),
        weeklyPlays: Math.floor(Math.random() * 500),
        monthlyPlays: Math.floor(Math.random() * 2000),
        totalPlays: game.totalPlays,
        averageScore: Math.floor(Math.random() * 10000),
        averagePlayTime: Math.floor(Math.random() * 300) + 60,
        retentionRate: Math.random() * 100,
        forkRate: Math.random() * 10,
        stakingRatio: Math.random() * 50,
        trending: Math.random() > 0.7,
        category: ['rising', 'stable', 'declining'][Math.floor(Math.random() * 3)] as any,
      };
    });
    setGameMetrics(metrics);
  }, [games, timeframe]);

  const getMetricIcon = (metric: typeof selectedMetric) => {
    switch (metric) {
      case 'plays':
        return <Gamepad2 className="h-4 w-4" />;
      case 'revenue':
        return <DollarSign className="h-4 w-4" />;
      case 'staking':
        return <TrendingUp className="h-4 w-4" />;
      case 'ratings':
        return <Star className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getMetricColor = (metric: typeof selectedMetric) => {
    switch (metric) {
      case 'plays':
        return 'text-blue-600';
      case 'revenue':
        return 'text-green-600';
      case 'staking':
        return 'text-purple-600';
      case 'ratings':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={timeframe} onValueChange={onTimeframeChange}>
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
          
          <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as any)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plays">Game Plays</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="staking">Staking</SelectItem>
              <SelectItem value="ratings">Ratings</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="sm">
          <Activity className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Gamepad2 className="h-4 w-4 text-blue-500" />
              Total Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalGames}</div>
            <div className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 5) + 1} this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              Active Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.totalPlayers)}</div>
            <div className="text-xs text-green-600">
              +{analyticsData.growthRate}% growth
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(+analyticsData.totalEarnings)} JEU</div>
            <div className="text-xs text-muted-foreground">Platform earnings</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              Total Staked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(+analyticsData.totalStaked)} JEU</div>
            <div className="text-xs text-muted-foreground">Community staking</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="games" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="games" className="space-y-4">
          {/* Game Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {getMetricIcon(selectedMetric)}
                Game Performance by {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {games.slice(0, 10).map((game, index) => {
                  const metrics = gameMetrics[game.tokenId];
                  if (!metrics) return null;

                  let value = 0;
                  let unit = '';
                  
                  switch (selectedMetric) {
                    case 'plays':
                      value = metrics.totalPlays;
                      unit = 'plays';
                      break;
                    case 'revenue':
                      value = Math.random() * 1000 + 100;
                      unit = 'JEU';
                      break;
                    case 'staking':
                      value = Math.random() * 10000 + 1000;
                      unit = 'JEU staked';
                      break;
                    case 'ratings':
                      value = Math.random() * 2 + 3;
                      unit = '★';
                      break;
                  }

                  return (
                    <div key={game.tokenId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{game.gameTitle}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-4">
                            <span>{metrics.totalPlays.toLocaleString()} plays</span>
                            <span>{game.totalForks} forks</span>
                            {metrics.trending && (
                              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getMetricColor(selectedMetric)}`}>
                          {selectedMetric === 'ratings' ? value.toFixed(1) : formatNumber(Math.floor(value))}
                        </div>
                        <div className="text-xs text-muted-foreground">{unit}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Avg. Session Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 min</div>
                <div className="text-xs text-muted-foreground">Per game session</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  Retention Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.retentionRate}%</div>
                <div className="text-xs text-green-600">7-day retention</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Avg. Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.avgRating}★</div>
                <div className="text-xs text-muted-foreground">Community rating</div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Performance by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.topGenres.map((genre, index) => (
                  <div key={genre.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${
                        index === 0 ? 'bg-green-500' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-purple-500' : 'bg-gray-400'
                      }`} />
                      <span className="font-medium">{genre.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{genre.count} games</span>
                      <Badge variant="outline" className="text-xs">
                        {((genre.count / analyticsData.totalGames) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          {/* Community Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Community Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Stakers</span>
                  <span className="font-medium">{formatNumber(Math.floor(Math.random() * 1000) + 100)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Forks</span>
                  <span className="font-medium">{games.reduce((sum, game) => sum + game.totalForks, 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Community Games</span>
                  <span className="font-medium">{Math.floor(analyticsData.totalGames * 0.3)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Stake/Game</span>
                  <span className="font-medium">{formatNumber(+analyticsData.totalStaked / analyticsData.totalGames)} JEU</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Creator Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Creators</span>
                  <span className="font-medium">{Math.floor(analyticsData.totalGames * 0.8)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Games/Creator</span>
                  <span className="font-medium">{(analyticsData.totalGames / Math.floor(analyticsData.totalGames * 0.8)).toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Royalties</span>
                  <span className="font-medium">{formatNumber(+analyticsData.totalEarnings * 0.05)} JEU</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Revenue/Game</span>
                  <span className="font-medium">{formatNumber(+analyticsData.totalEarnings / analyticsData.totalGames)} JEU</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Contributors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Top Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-medium">0x{Math.random().toString(16).substr(2, 8)}...</div>
                        <div className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 5) + 1} games • {Math.floor(Math.random() * 1000) + 100} plays
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-primary">
                        {(Math.random() * 500 + 100).toFixed(0)} JEU
                      </div>
                      <div className="text-xs text-muted-foreground">earned</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Trending Games */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Trending Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {games.filter((_, index) => index < 5).map((game, index) => {
                  const metrics = gameMetrics[game.tokenId];
                  if (!metrics) return null;

                  return (
                    <div key={game.tokenId} className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-yellow-500 text-white">
                          #{index + 1}
                        </Badge>
                        <div>
                          <div className="font-medium">{game.gameTitle}</div>
                          <div className="text-sm text-muted-foreground">
                            +{Math.floor(Math.random() * 50) + 10}% increase in plays
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-yellow-600">
                          {formatNumber(metrics.dailyPlays)} plays
                        </div>
                        <div className="text-xs text-muted-foreground">today</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Market Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Market Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Growth Trends</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">New games this week</span>
                      <span className="font-medium text-green-600">+{Math.floor(Math.random() * 10) + 3}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Player growth</span>
                      <span className="font-medium text-green-600">+{analyticsData.growthRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue growth</span>
                      <span className="font-medium text-green-600">+{Math.floor(Math.random() * 30) + 15}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Popular Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Multiplayer games</span>
                      <span className="font-medium">{Math.floor(analyticsData.totalGames * 0.4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">P2E enabled</span>
                      <span className="font-medium">{Math.floor(analyticsData.totalGames * 0.6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stakeable games</span>
                      <span className="font-medium">{Math.floor(analyticsData.totalGames * 0.8)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}