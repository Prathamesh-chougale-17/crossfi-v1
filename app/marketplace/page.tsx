"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getPublishedGames } from "@/lib/actions";
import type { GameClient } from "@/lib/models";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Calendar,
  Play,
  Search,
  Filter,
  Star,
  Gamepad2,
  Sparkles,
  TrendingUp,
  Clock,
  Users
} from "lucide-react";
import { toast } from "sonner";
import HeaderWrapper from "@/components/header-wrapper";

export default function Marketplace() {
  const router = useRouter();
  const [games, setGames] = React.useState<GameClient[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredGames, setFilteredGames] = React.useState<GameClient[]>([]);

  React.useEffect(() => {
    const loadMarketplaceGames = async () => {
      try {
        setIsLoading(true);
        const publishedGames = await getPublishedGames({
          publishedTo: 'marketplace',
          limit: 50,
        });
        setGames(publishedGames);
        setFilteredGames(publishedGames);
      } catch (error) {
        console.error("Error loading marketplace games:", error);
        toast.error("Failed to load games", {
          description: "There was an error loading marketplace games.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMarketplaceGames();
  }, []);

  React.useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredGames(games);
    } else {
      const filtered = games.filter(game =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.description && game.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredGames(filtered);
    }
  }, [searchQuery, games]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Enhanced Loading State */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

          <div className="relative container mx-auto px-4 py-16">
            {/* Loading Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center mb-6">
                <Badge variant="secondary" className="px-6 py-3 text-sm font-medium bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
                  <Gamepad2 className="h-4 w-4 mr-2 text-primary animate-pulse" />
                  Game Marketplace
                  <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </Badge>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Marketplace
              </h1>
            </div>

            {/* Loading Animation */}
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
                  <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Loading Amazing Games</h3>
                <p className="text-muted-foreground">Discovering the best community creations...</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-200"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-400"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <HeaderWrapper>
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />

        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center justify-center mb-6">
              <Badge variant="secondary" className="px-6 py-3 text-sm font-medium bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <Gamepad2 className="h-4 w-4 mr-2 text-primary animate-pulse" />
                Game Marketplace
                <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </Badge>
            </div>

            {/* Enhanced Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Marketplace
            </h1>

            {/* Enhanced Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              Discover and play amazing games created by our community.
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">
                No code shown - just pure gaming fun!
              </span>
            </p>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-500">{games.length}</span>
                </div>
                <div className="text-sm text-muted-foreground font-medium">Published Games</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-500">Active</span>
                </div>
                <div className="text-sm text-muted-foreground font-medium">Community</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <span className="text-2xl font-bold text-purple-500">Free</span>
                </div>
                <div className="text-sm text-muted-foreground font-medium">To Play</div>
              </div>
            </div>
          </div>

          {/* Enhanced Search Section */}
          <div className="max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search games by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl focus:shadow-xl transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Badge variant="outline" className="bg-card/50 backdrop-blur-sm border-border/50">
                  <Filter className="h-3 w-3 mr-1" />
                  {filteredGames.length}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Games Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-transparent to-muted/20" />

        <div className="relative container mx-auto px-4">
          {filteredGames.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Gamepad2 className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  {searchQuery ? "No Games Found" : "No Games Published Yet"}
                </h2>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  {searchQuery
                    ? `No games match "${searchQuery}". Try a different search term or browse all games.`
                    : "Be the first to publish a game to the marketplace! Create a game and publish it from the editor."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {searchQuery ? (
                    <Button
                      variant="outline"
                      onClick={() => setSearchQuery("")}
                      className="px-8 py-6 text-lg bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Clear Search
                    </Button>
                  ) : null}
                  <Button
                    onClick={() => router.push("/editor")}
                    className="px-8 py-6 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Create Your First Game
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {searchQuery ? `Search Results for "${searchQuery}"` : "Featured Games"}
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} available
                  </p>
                </div>
                <Badge variant="outline" className="px-4 py-2 bg-card/50 backdrop-blur-sm border-border/50">
                  <Clock className="h-4 w-4 mr-2" />
                  Recently Updated
                </Badge>
              </div>

              {/* Enhanced Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGames.map((game, index) => (
                  <Card
                    key={game._id}
                    className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50 animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Card Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />

                    <CardHeader className="relative z-10 pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300 truncate">
                            {game.name}
                          </CardTitle>
                          {game.description && (
                            <CardDescription className="text-base leading-relaxed line-clamp-2 group-hover:text-foreground/80 transition-colors duration-300">
                              {game.description}
                            </CardDescription>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => router.push(`/marketplace/${game._id}`)}
                          className="flex-shrink-0 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Play
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
                      {/* Game Stats */}
                      <div className="flex items-center justify-between text-sm mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                          <User className="h-4 w-4" />
                          <span className="font-medium">
                            {game.walletAddress.slice(0, 6)}...{game.walletAddress.slice(-4)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {game.publishedAt
                              ? new Date(game.publishedAt).toLocaleDateString()
                              : 'Recently'
                            }
                          </span>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span>Ready to play</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More Section */}
              {games.length >= 50 && (
                <div className="text-center mt-16">
                  <div className="inline-flex items-center gap-4 px-8 py-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                      <span>Showing {filteredGames.length} games</span>
                    </div>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span>More games coming soon</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
    </HeaderWrapper>
  );
}