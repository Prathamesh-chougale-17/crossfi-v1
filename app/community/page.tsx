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
  Code, 
  GitFork, 
  Search, 
  Filter, 
  // Star, 
  Users, 
  Sparkles,
  // TrendingUp,
  Clock,
  BookOpen,
  Heart,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import HeaderWrapper from "@/components/header-wrapper";

export default function Community() {
  const router = useRouter();
  const [games, setGames] = React.useState<GameClient[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredGames, setFilteredGames] = React.useState<GameClient[]>([]);

  React.useEffect(() => {
    const loadCommunityGames = async () => {
      try {
        setIsLoading(true);
        const publishedGames = await getPublishedGames({
          publishedTo: 'community',
          limit: 50,
        });
        setGames(publishedGames);
        setFilteredGames(publishedGames);
      } catch (error) {
        console.error("Error loading community games:", error);
        toast.error("Failed to load games", {
          description: "There was an error loading community games.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCommunityGames();
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
      <HeaderWrapper>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          
          <div className="relative container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center mb-6">
                <Badge variant="secondary" className="px-6 py-3 text-sm font-medium bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
                  <Users className="h-4 w-4 mr-2 text-primary animate-pulse" />
                  Developer Community
                  <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </Badge>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Community
              </h1>
            </div>

            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
                  <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Loading Community Projects</h3>
                <p className="text-muted-foreground">Discovering open source games and code...</p>
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
      </HeaderWrapper>
    );
  }

  return (
    <HeaderWrapper>
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />

        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <Badge variant="secondary" className="px-6 py-3 text-sm font-medium bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <Users className="h-4 w-4 mr-2 text-primary animate-pulse" />
                Developer Community
                <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </Badge>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Community
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              Connect with developers, explore open source code, and fork games to create your own versions.
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">
                Learn, collaborate, and build together!
              </span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-500">{games.length}</span>
                </div>
                <div className="text-sm text-muted-foreground font-medium">Open Source Projects</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <GitFork className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-500">Forkable</span>
                </div>
                <div className="text-sm text-muted-foreground font-medium">Code Available</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-2xl font-bold text-red-500">Open</span>
                </div>
                <div className="text-sm text-muted-foreground font-medium">Source Community</div>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search community projects by name or description..."
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

      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-transparent to-muted/20" />
        
        <div className="relative container mx-auto px-4">
          {filteredGames.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  {searchQuery ? "No Projects Found" : "No Games Shared Yet"}
                </h2>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  {searchQuery 
                    ? `No projects match "${searchQuery}". Try a different search term or browse all projects.`
                    : "Be the first to share a game with the community! Create a game and publish it from the editor."
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
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {searchQuery ? `Search Results for "${searchQuery}"` : "Community Projects"}
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredGames.length} project{filteredGames.length !== 1 ? 's' : ''} available for exploration
                  </p>
                </div>
                <Badge variant="outline" className="px-4 py-2 bg-card/50 backdrop-blur-sm border-border/50">
                  <Clock className="h-4 w-4 mr-2" />
                  Recently Shared
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGames.map((game, index) => (
                  <Card 
                    key={game._id} 
                    className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50 animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors duration-500" />
                    
                    <CardHeader className="relative z-10 pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300 truncate">
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
                          onClick={() => router.push(`/community/${game._id}`)}
                          className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                        >
                          <Code className="h-4 w-4 mr-1" />
                          View Code
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
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

                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                            <GitFork className="h-3 w-3 mr-1" />
                            Open Source
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          <span>Code available</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>Viewable</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          <span>Forkable</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>MIT License</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {games.length >= 50 && (
                <div className="text-center mt-16">
                  <div className="inline-flex items-center gap-4 px-8 py-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                      <span>Showing {filteredGames.length} projects</span>
                    </div>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span>More projects coming soon</span>
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