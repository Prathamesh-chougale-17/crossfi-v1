'use client';

import { GameClient } from '@/lib/models';
import { GameCard } from './game-card';

interface GameGridProps {
  games: GameClient[];
  checkpointCounts?: Record<string, number>;
}

export function GameGrid({ games, checkpointCounts = {} }: GameGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameCard
          key={game._id?.toString()}
          game={game}
          checkpointCount={checkpointCounts[game._id?.toString() || ''] || 0}
        />
      ))}
    </div>
  );
}