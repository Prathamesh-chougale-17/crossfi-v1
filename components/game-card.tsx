'use client';

import { GameClient } from '@/lib/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Clock, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

interface GameCardProps {
  game: GameClient;
  checkpointCount?: number;
}

export function GameCard({ game, checkpointCount = 0 }: GameCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(date);
  };

  const isRecentlyUpdated = () => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(game.updatedAt).getTime()) / (1000 * 60 * 60));
    return diffInHours < 24;
  };

  return (
    <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 transform hover:scale-[1.02] hover:border-primary/20">
      <Link href={`/editor/${game._id}`}>
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-xl group-hover:bg-accent/10 transition-colors duration-500" />

        <CardHeader className="relative z-10 pb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {game.name}
              </CardTitle>
            </div>

            {/* Status Badges */}
            <div className="flex flex-col gap-2 shrink-0">
              {/* {isRecentlyUpdated() && (
                <Badge variant="secondary" className="text-xs px-2 py-1 bg-green-500/10 text-green-600 border-green-500/20">
                  <Sparkles className="h-3 w-3 mr-1" />
                  New
                </Badge>
              )} */}

              {(game.publishedToMarketplace || game.publishedToCommunity) && (
                <Badge variant="secondary" className="text-xs px-2 py-1 bg-blue-500/10 text-blue-600 border-blue-500/20">
                  <Gamepad2 className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 group-hover:bg-muted/50 transition-colors duration-300">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{checkpointCount}</span>
                <span className="text-xs text-muted-foreground">Checkpoint{checkpointCount !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 group-hover:bg-muted/50 transition-colors duration-300">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{getRelativeTime(game.updatedAt)}</span>
                <span className="text-xs text-muted-foreground">Updated</span>
              </div>
            </div>
          </div>

          {/* Creation Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Created {formatDate(game.createdAt)}</span>
            {isRecentlyUpdated() && (
              <div className="ml-auto flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-600 font-medium">Active</span>
              </div>
            )}
          </div>

          {game.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {game.description}
            </p>
          )}

          {/* Publishing Status */}
          {(game.publishedToMarketplace || game.publishedToCommunity) && (
            <div className="flex items-center justify-center gap-4 pt-2 text-xs">
              {game.publishedToMarketplace && (
                <div className="flex items-center gap-1 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Marketplace</span>
                </div>
              )}
              {game.publishedToCommunity && (
                <div className="flex items-center gap-1 text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span>Community</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}