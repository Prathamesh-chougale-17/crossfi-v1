import { Suspense } from 'react';
import { UserGamesSection } from '@/components/user-games-section';
import HeaderWrapper from '@/components/header-wrapper';

export default function GamesPage() {
    return (
        <HeaderWrapper>
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">My Games</h1>
                    <p className="text-xl text-muted-foreground">
                        Manage and organize all your AI-generated games
                    </p>
                </div>

                <Suspense fallback={<div className="text-center py-8">Loading your games...</div>}>
                    <UserGamesSection />
                </Suspense>
            </div>
        </div>
        </HeaderWrapper>
    );
}
