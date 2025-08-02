"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Bot,
  Code,
  Wallet,
  Zap,
  Users,
  Store,
  GitFork,
  Sparkles,
  ArrowRight,
  Play,
  Palette
} from 'lucide-react';
import HeaderWrapper from '@/components/header-wrapper';

export default function Home() {
  return (
    <HeaderWrapper>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />

          <div className="relative mx-auto px-4 py-24 lg:py-32">
            <div className="max-w-5xl mx-auto text-center">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center justify-center mb-8">
                <Badge variant="secondary" className="px-6 py-3 text-sm font-medium bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Sparkles className="h-4 w-4 mr-2 text-primary animate-pulse" />
                  AI-Powered Game Creation Platform
                  <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </Badge>
              </div>

              {/* Enhanced Title */}
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-8 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Jeu Plaza
              </h1>

              {/* Enhanced Subtitle */}
              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                Create stunning browser games with AI assistance. No coding experience required.
                <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">
                  Own your creations with Web3 wallet integration.
                </span>
              </p>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
                <Button size="lg" asChild className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                  <Link href="/editor">
                    <Bot className="h-5 w-5 mr-3" />
                    Start Creating
                    <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild className="text-lg px-10 py-7 border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <Link href="/marketplace">
                    <Play className="h-5 w-5 mr-3" />
                    Play Games
                  </Link>
                </Button>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
                <div className="text-center group">
                  <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
                      AI-Powered
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Game Generation</div>
                    <div className="mt-2 w-full h-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full">
                      <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="text-center group">
                  <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
                      Web3
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Wallet Integration</div>
                    <div className="mt-2 w-full h-1 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-full">
                      <div className="h-full w-4/5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="text-center group">
                  <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
                      Open Source
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Community Driven</div>
                    <div className="mt-2 w-full h-1 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-full">
                      <div className="h-full w-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-0" />

        {/* Enhanced Features Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-transparent to-muted/20" />
          <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              <Badge variant="outline" className="mb-6 px-4 py-2 bg-card/50 backdrop-blur-sm border-border/50">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                Powerful Features
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Everything You Need to Create Games
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                From AI-powered generation to community sharing, we&apos;ve got all the tools
                to bring your game ideas to life with professional quality and ease.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* AI Generation */}
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors duration-500" />
                <CardHeader className="relative z-10 p-8">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Bot className="h-8 w-8 text-blue-500" />
                  </div>
                  <CardTitle className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">AI Game Generation</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Describe your game idea and watch AI create complete HTML, CSS, and JavaScript code instantly with professional game architecture.
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span>Powered by advanced AI</span>
                  </div>
                </CardHeader>
              </Card>

              {/* Code Editor */}
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-colors duration-500" />
                <CardHeader className="relative z-10 p-8">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Code className="h-8 w-8 text-green-500" />
                  </div>
                  <CardTitle className="text-xl font-bold mb-3 group-hover:text-green-600 transition-colors">Built-in Code Editor</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Edit and refine your games with our powerful code editor featuring live preview, syntax highlighting, and intelligent autocomplete.
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Real-time collaboration</span>
                  </div>
                </CardHeader>
              </Card>

              {/* Wallet Integration */}
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors duration-500" />
                <CardHeader className="relative z-10 p-8">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Wallet className="h-8 w-8 text-orange-500" />
                  </div>
                  <CardTitle className="text-xl font-bold mb-3 group-hover:text-orange-600 transition-colors">Web3 Ownership</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Connect your wallet to own and manage your games. Your creations are truly yours with blockchain technology and decentralized storage.
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2 text-sm text-orange-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    <span>Blockchain secured</span>
                  </div>
                </CardHeader>
              </Card>

              {/* Marketplace */}
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors duration-500" />
                <CardHeader className="relative z-10 p-8">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Store className="h-8 w-8 text-purple-500" />
                  </div>
                  <CardTitle className="text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors">Game Marketplace</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Publish your games for others to discover and play. Share your creativity with the world and build your reputation as a game creator.
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2 text-sm text-purple-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span>Global distribution</span>
                  </div>
                </CardHeader>
              </Card>

              {/* Community */}
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors duration-500" />
                <CardHeader className="relative z-10 p-8">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-cyan-500" />
                  </div>
                  <CardTitle className="text-xl font-bold mb-3 group-hover:text-cyan-600 transition-colors">Open Source Community</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Share code, learn from others, and fork games to create your own versions. Collaboration made easy with version control and sharing.
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2 text-sm text-cyan-600">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                    <span>Community driven</span>
                  </div>
                </CardHeader>
              </Card>

              {/* Live Preview */}
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/10 transition-colors duration-500" />
                <CardHeader className="relative z-10 p-8">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-yellow-500" />
                  </div>
                  <CardTitle className="text-xl font-bold mb-3 group-hover:text-yellow-600 transition-colors">Real-time Preview</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    See your changes instantly with live preview. Test your games on both desktop and mobile devices with responsive design testing.
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2 text-sm text-yellow-600">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    <span>Instant feedback</span>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* Enhanced How It Works Section */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-muted/30 via-muted/20 to-muted/30">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4">
            <div className="text-center mb-20">
              <Badge variant="outline" className="mb-6 px-4 py-2 bg-card/50 backdrop-blur-sm border-border/50">
                <Zap className="h-4 w-4 mr-2 text-primary" />
                Simple Process
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Create your first game in just a few simple steps. Our streamlined process makes game development accessible to everyone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connection Lines */}
              <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-primary/30 to-accent/30 transform -translate-y-1/2" />
              <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-accent/30 to-primary/30 transform -translate-y-1/2" />

              {/* Step 1 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-110 border border-primary/20">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                      <Wallet className="h-8 w-8 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    1
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">Connect Wallet</h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  Connect your Web3 wallet to start creating and owning your games. Secure, decentralized, and truly yours.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-primary">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span>Blockchain secured</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-110 border border-accent/20">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg">
                      <Bot className="h-8 w-8 text-accent-foreground" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    2
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">Describe Your Game</h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  Tell our AI what kind of game you want to create and watch the magic happen. From simple concepts to complex mechanics.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-accent">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span>AI powered generation</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-110 border border-green-500/20">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                      <Store className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-primary rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    3
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-green-600 transition-colors">Publish & Share</h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  Publish to marketplace for gaming or community for code sharing. Build your reputation and reach players worldwide.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Global distribution</span>
                </div>
              </div>
            </div>

            {/* Enhanced Process Flow */}
            <div className="mt-20 text-center">
              <div className="inline-flex items-center gap-4 px-8 py-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                  <span>Average time: 5 minutes</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span>No coding required</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  <span>Instant deployment</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Enhanced CTA Section */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />

          <div className="relative max-w-5xl mx-auto px-4">
            <div className="text-center">
              {/* Enhanced Badge */}
              <Badge variant="outline" className="mb-8 px-6 py-3 bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                <Sparkles className="h-4 w-4 mr-2 text-primary animate-pulse" />
                Join the Revolution
                <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </Badge>

              {/* Enhanced Title */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Ready to Create Your First Game?
              </h2>

              {/* Enhanced Description */}
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
                Join thousands of creators building amazing games with AI.
                <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">
                  No coding experience required - just your imagination.
                </span>
              </p>

              {/* Enhanced Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-sm text-muted-foreground">Games Created</div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl font-bold text-accent mb-2">5K+</div>
                  <div className="text-sm text-muted-foreground">Active Creators</div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl font-bold text-green-500 mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Free to Start</div>
                </div>
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" asChild className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                  <Link href="/editor">
                    <Palette className="h-5 w-5 mr-3" />
                    Start Creating Now
                    <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild className="text-lg px-10 py-7 border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <Link href="/community">
                    <GitFork className="h-5 w-5 mr-3" />
                    Explore Community
                  </Link>
                </Button>
              </div>

              {/* Enhanced Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span>Open source & transparent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span>Community supported</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </HeaderWrapper>
  );
}
