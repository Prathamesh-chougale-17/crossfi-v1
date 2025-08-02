import HeaderWrapper from "@/components/header-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    Users,
    Trophy,
    Zap,
    Star,
    Play,
    Sparkles,
    Target
} from "lucide-react";

const availablegames = [
    {
        name: "Tank Shooter",
        description: "Epic multiplayer tank battle arena with bot opponents and real-time combat",
        longDescription: "Engage in intense tank warfare with multiple game modes, customizable tanks, and strategic gameplay. Battle against bot opponents or challenge other players in this action-packed arena.",
        url: "/games/tankshooter",
        image: "/games/tankshooter.png",
        category: "Action",
        players: "1-8 Players",
        difficulty: "Medium",
        features: ["Multiplayer", "Bot Opponents", "Real-time Combat", "Multiple Modes"],
        rating: 4.8,
        isNew: true,
        isFeatured: true
    },
];

const Games = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <HeaderWrapper>
                <div className="relative overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />

                    <div className="relative mx-auto py-16">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                                Games
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Play exciting games built for entertainment and fun.
                            </p>
                        </div>

                        <Separator className="my-0" />

                        {/* Games Grid Section */}
                        <div className="py-16 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-transparent to-muted/20" />

                            <div className="relative px-4">
                                {/* Section Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-3xl font-bold mb-2">Featured Games</h2>
                                        <p className="text-muted-foreground">
                                            Hand-picked games for the best experience
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="px-4 py-2 bg-card/50 backdrop-blur-sm border-border/50">
                                        <Trophy className="h-4 w-4 mr-2" />
                                        Premium Quality
                                    </Badge>
                                </div>

                                {/* Compact Games Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {availablegames.map((game, index) => (
                                        <Card
                                            key={game.name}
                                            className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-card/50 backdrop-blur-sm border-border/50 animate-in fade-in slide-in-from-bottom-4"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            {/* Card Background Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Badges */}
                                            <div className="absolute top-3 left-3 z-20 flex gap-1">
                                                {game.isNew && (
                                                    <Badge className="bg-green-500/90 text-white border-green-400/50 shadow-md text-xs px-2 py-0.5">
                                                        <Sparkles className="h-2.5 w-2.5 mr-1" />
                                                        New
                                                    </Badge>
                                                )}
                                                {game.isFeatured && (
                                                    <Badge className="bg-purple-500/90 text-white border-purple-400/50 shadow-md text-xs px-2 py-0.5">
                                                        <Star className="h-2.5 w-2.5 mr-1" />
                                                        Featured
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Game Image */}
                                            <div className="relative rounded-t-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 aspect-[4/3]">
                                                <Image
                                                    src={game.image || "/placeholder.svg"}
                                                    alt={game.name}
                                                    fill
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                                                {/* Play Button Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="bg-primary/90 backdrop-blur-sm rounded-full p-3 shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                                        <Play className="h-5 w-5 text-white" />
                                                    </div>
                                                </div>
                                            </div>

                                            <CardHeader className="relative z-10 p-4 pb-2">
                                                <div className="flex items-start justify-between mb-2">
                                                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300 line-clamp-1">
                                                        {game.name}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0 ml-2">
                                                        <Star className="h-3.5 w-3.5 fill-current" />
                                                        <span className="text-xs font-medium">{game.rating}</span>
                                                    </div>
                                                </div>

                                                <CardDescription className="text-sm leading-relaxed group-hover:text-foreground/80 transition-colors duration-300 line-clamp-2">
                                                    {game.description}
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent className="relative z-10 p-4 pt-0">
                                                {/* Game Info */}
                                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3.5 w-3.5" />
                                                        <span>{game.players}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Target className="h-3.5 w-3.5" />
                                                        <span>{game.difficulty}</span>
                                                    </div>
                                                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                                        {game.category}
                                                    </Badge>
                                                </div>

                                                {/* Features */}
                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {game.features.slice(0, 3).map((feature) => (
                                                        <Badge
                                                            key={feature}
                                                            variant="outline"
                                                            className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                                                        >
                                                            {feature}
                                                        </Badge>
                                                    ))}
                                                    {game.features.length > 3 && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground border-muted/50"
                                                        >
                                                            +{game.features.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <Link href={game.url} className="w-full">
                                                    <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] group/btn text-sm py-2">
                                                        <Play className="h-3.5 w-3.5 mr-2 group-hover/btn:animate-pulse" />
                                                        Play Now
                                                        <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                                                    </Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Coming Soon Section */}
                                <div className="mt-16 text-center">
                                    <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-lg">
                                        <div className="flex items-center justify-center mb-4">
                                            <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-full p-4">
                                                <Zap className="h-8 w-8 text-primary" />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">More Games Coming Soon!</h3>
                                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                            We&apos;re working on exciting new games. Stay tuned for more amazing experiences!
                                        </p>
                                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                                <span>New Games</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                <span>Free to Play</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                                <span>Multiplayer Ready</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </HeaderWrapper>
        </div>
    );
};

export default Games;