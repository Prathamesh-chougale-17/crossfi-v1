'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Coins,
  Trophy,
  Star,
  TrendingUp,
  Zap,
  Clock,
  Target,
  Award,
  Gift,
  Calendar,
  Users,
  Gamepad2,
} from 'lucide-react';
import type { TokenBalance } from '@/lib/gamefi/types';

interface PlayToEarnStats {
  todayEarnings: string;
  weeklyEarnings: string;
  monthlyEarnings: string;
  totalEarnings: string;
  gamesPlayed: number;
  averageScore: number;
  bestStreak: number;
  currentStreak: number;
  multiplier: number;
  nextRewardThreshold: number;
  currentXP: number;
  level: number;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  category: 'play' | 'score' | 'streak' | 'social';
}

interface PlayToEarnTrackerProps {
  tokenBalance: TokenBalance;
  onClaimRewards?: () => void;
}

export function PlayToEarnTracker({ tokenBalance, onClaimRewards }: PlayToEarnTrackerProps) {
  const [stats, setStats] = useState<PlayToEarnStats>({
    todayEarnings: '12.5',
    weeklyEarnings: '87.3',
    monthlyEarnings: '340.7',
    totalEarnings: '1,247.8',
    gamesPlayed: 23,
    averageScore: 8750,
    bestStreak: 12,
    currentStreak: 3,
    multiplier: 1.25,
    nextRewardThreshold: 50,
    currentXP: 1340,
    level: 7,
  });

  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([
    {
      id: '1',
      title: 'Daily Player',
      description: 'Play 5 different games',
      reward: '10',
      progress: 3,
      maxProgress: 5,
      isCompleted: false,
      category: 'play',
    },
    {
      id: '2',
      title: 'High Scorer',
      description: 'Achieve a score above 10,000',
      reward: '15',
      progress: 0,
      maxProgress: 1,
      isCompleted: false,
      category: 'score',
    },
    {
      id: '3',
      title: 'Streak Master',
      description: 'Maintain a 5-game winning streak',
      progress: 3,
      maxProgress: 5,
      reward: '25',
      isCompleted: false,
      category: 'streak',
    },
    {
      id: '4',
      title: 'Community Helper',
      description: 'Stake on 3 different games',
      reward: '20',
      progress: 1,
      maxProgress: 3,
      isCompleted: false,
      category: 'social',
    },
  ]);

  const [recentRewards, setRecentRewards] = useState([
    { game: 'Tank Shooter', amount: '5.2', time: '2 hours ago', type: 'play' },
    { game: 'Puzzle Master', amount: '3.8', time: '4 hours ago', type: 'play' },
    { game: 'Racing Game', amount: '7.1', time: '6 hours ago', type: 'play' },
    { game: 'Daily Challenge', amount: '10.0', time: '1 day ago', type: 'challenge' },
  ]);

  const levelProgress = (stats.currentXP % 100) / 100 * 100;
  const nextLevelXP = (stats.level * 100) - (stats.currentXP % 100);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'play':
        return <Gamepad2 className="h-4 w-4" />;
      case 'score':
        return <Target className="h-4 w-4" />;
      case 'streak':
        return <Zap className="h-4 w-4" />;
      case 'social':
        return <Users className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'play':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'score':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'streak':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'social':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Player Level and XP */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Level {stats.level}
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {stats.multiplier}x Multiplier
                  </Badge>
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {stats.currentXP.toLocaleString()} XP • {nextLevelXP} XP to next level
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {parseFloat(tokenBalance.playToEarnTotal || '0').toFixed(1)} JEU
              </div>
              <div className="text-sm text-muted-foreground">Total Earned</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level Progress</span>
              <span>{levelProgress.toFixed(0)}%</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="earnings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="space-y-4">
          {/* Earnings Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-green-500" />
                Earnings Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.todayEarnings}</div>
                  <div className="text-xs text-muted-foreground">Today</div>
                  <div className="text-xs text-green-600">+{Math.floor(Math.random() * 20) + 5}% from yesterday</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.weeklyEarnings}</div>
                  <div className="text-xs text-muted-foreground">This Week</div>
                  <div className="text-xs text-green-600">JEU earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.monthlyEarnings}</div>
                  <div className="text-xs text-muted-foreground">This Month</div>
                  <div className="text-xs text-green-600">Monthly target: 400 JEU</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.totalEarnings}</div>
                  <div className="text-xs text-muted-foreground">All Time</div>
                  <div className="text-xs text-green-600">Total earned</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Performance Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold">{stats.gamesPlayed}</div>
                  <div className="text-xs text-muted-foreground">Games Played</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{stats.averageScore.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Avg Score</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600">{stats.bestStreak}</div>
                  <div className="text-xs text-muted-foreground">Best Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{stats.currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Current Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Rewards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Recent Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRewards.map((reward, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
                        {reward.type === 'play' ? (
                          <Gamepad2 className="h-4 w-4 text-primary" />
                        ) : (
                          <Gift className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{reward.game}</div>
                        <div className="text-xs text-muted-foreground">{reward.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">+{reward.amount} JEU</div>
                      <Badge variant="outline" className="text-xs">
                        {reward.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          {/* Daily Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Daily Challenges
                <Badge variant="secondary" className="ml-auto">
                  Resets in 18h 42m
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      challenge.isCompleted
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                        : 'bg-muted/30 border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={getCategoryColor(challenge.category)}>
                          {getCategoryIcon(challenge.category)}
                        </Badge>
                        <div>
                          <div className="font-medium text-sm">{challenge.title}</div>
                          <div className="text-xs text-muted-foreground">{challenge.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-primary">+{challenge.reward} JEU</div>
                        {challenge.isCompleted ? (
                          <Badge className="bg-green-500 text-white text-xs">
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            {challenge.progress}/{challenge.maxProgress}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.maxProgress}</span>
                      </div>
                      <Progress
                        value={(challenge.progress / challenge.maxProgress) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bonus Multipliers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Active Multipliers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium text-sm">Streak Bonus</div>
                      <div className="text-xs text-muted-foreground">{stats.currentStreak} game streak</div>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500 text-white">+25% XP</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-sm">Level Bonus</div>
                      <div className="text-xs text-muted-foreground">Level {stats.level} rewards</div>
                    </div>
                  </div>
                  <Badge className="bg-purple-500 text-white">+{((stats.level - 1) * 5)}% Rewards</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const activity = Math.floor(Math.random() * 100);
                    return (
                      <div key={day} className="text-center">
                        <div className="text-xs text-muted-foreground mb-2">{day}</div>
                        <div
                          className={`h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                            activity > 70
                              ? 'bg-green-500 text-white'
                              : activity > 40
                              ? 'bg-yellow-500 text-white'
                              : activity > 0
                              ? 'bg-orange-500 text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {activity > 0 ? activity : '—'}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-muted rounded-full" />
                    <span>No activity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-orange-500 rounded-full" />
                    <span>Low</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span>High</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: 'First Steps', description: 'Played your first game', date: '2 days ago', reward: '5 JEU' },
                  { title: 'Rising Star', description: 'Reached level 5', date: '1 week ago', reward: '25 JEU' },
                  { title: 'Community Supporter', description: 'Staked on 10 games', date: '2 weeks ago', reward: '50 JEU' },
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-primary text-sm">{achievement.reward}</div>
                      <div className="text-xs text-muted-foreground">{achievement.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}