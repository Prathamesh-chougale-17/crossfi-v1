"use client";

import { Loader2, Bot, Sparkles, Code, Database } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface EditorSkeletonProps {
    message?: string;
    showAIIcon?: boolean;
}

export function EditorSkeleton({
    message = "Loading...",
    showAIIcon = false
}: EditorSkeletonProps) {
    return (
        <div className="flex h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20">
            {/* Enhanced Header Skeleton */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
                <div className="flex h-16 items-center justify-between px-4 lg:px-6">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-5 w-40 bg-gradient-to-r from-muted to-muted/50" />
                            <Skeleton className="h-3 w-24 bg-gradient-to-r from-muted/70 to-muted/30" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-20 rounded-md bg-gradient-to-r from-primary/20 to-primary/10" />
                        <Skeleton className="h-8 w-16 rounded-md bg-gradient-to-r from-muted to-muted/50" />
                        <Skeleton className="h-8 w-24 rounded-md bg-gradient-to-r from-muted to-muted/50" />
                        <Skeleton className="h-8 w-24 rounded-md bg-gradient-to-r from-muted to-muted/50" />
                        <Skeleton className="h-8 w-16 rounded-md bg-gradient-to-r from-muted to-muted/50" />
                        <Skeleton className="h-8 w-16 rounded-md bg-gradient-to-r from-muted to-muted/50" />
                    </div>
                </div>
            </header>

            {/* Enhanced Main Content */}
            <main className="flex-grow p-4 pt-2">
                <div className="h-full rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden relative">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
                    </div>

                    {/* Loading Content */}
                    <div className="relative z-10 h-full flex items-center justify-center">
                        <div className="text-center max-w-lg px-8">
                            {/* Icon and Message */}
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <div className="relative">
                                    {showAIIcon ? (
                                        <div className="relative">
                                            <Bot className="h-12 w-12 text-primary animate-pulse" />
                                            <Sparkles className="h-6 w-6 text-accent absolute -top-2 -right-2 animate-spin" />
                                        </div>
                                    ) : message.includes("Saving") ? (
                                        <div className="relative">
                                            <Database className="h-12 w-12 text-primary animate-pulse" />
                                            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <Code className="h-12 w-12 text-primary" />
                                            <Loader2 className="h-6 w-6 text-accent absolute -top-1 -right-1 animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    {message}
                                </div>
                            </div>

                            {/* Context-specific messages */}
                            {showAIIcon && (
                                <div className="space-y-3 text-muted-foreground mb-8">
                                    <p className="text-base font-medium">AI is crafting your game code...</p>
                                    <div className="flex items-center justify-center gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                            <span>Analyzing prompt</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-300" />
                                            <span>Generating code</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-600" />
                                            <span>Optimizing</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {message.includes("Saving") && (
                                <div className="space-y-3 text-muted-foreground mb-8">
                                    <p className="text-base font-medium">Securing your game in the database...</p>
                                    <div className="flex items-center justify-center gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                            <span>Creating checkpoint</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse animation-delay-300" />
                                            <span>Saving metadata</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Enhanced Progress Bar */}
                            <div className="w-full max-w-sm mx-auto">
                                <div className="h-3 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm border border-border/30">
                                    <div className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full relative overflow-hidden"
                                        style={{
                                            animation: 'loading-progress 2.5s ease-in-out infinite',
                                            width: showAIIcon ? '75%' : message.includes("Saving") ? '90%' : '60%'
                                        }}>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-3 font-medium">
                                    {showAIIcon ? 'This may take a few moments...' : 'Almost there!'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`
                @keyframes loading-progress {
                    0% { width: 20%; }
                    50% { width: 85%; }
                    100% { width: 20%; }
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                .animation-delay-300 {
                    animation-delay: 300ms;
                }

                .animation-delay-600 {
                    animation-delay: 600ms;
                }

                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
}