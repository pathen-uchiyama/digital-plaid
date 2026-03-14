import { CharacterIntelEngine } from './CharacterIntelEngine';

class FindAndSeekEngine {
    private scores: Record<string, number> = {};

    awardPoints(guestId: string, secretId: string) {
        if (!this.scores[guestId]) this.scores[guestId] = 0;
        this.scores[guestId] += 50;
        console.log(`[FindAndSeek] Awarded 50 pts to ${guestId} for discovering ${secretId}`);
    }

    getPoints(guestId: string): number {
        return this.scores[guestId] || 0;
    }

    async scanNearbySecrets(parkId: string): Promise<string[]> {
        // Mock scan for nearby secrets
        return ['Mickey\'s Hidden House', 'Walt\'s Inspiration Bridge'];
    }

    reset() {
        this.scores = {};
    }

    /**
     * Line Trivia: Text-only engagement for long waits (Phase 56)
     */
    getLineTrivia(rideId: string): string {
        const trivia: Record<string, string[]> = {
            'MK_SPACE': [
                "The 'Post-Show' used to feature a moving sidewalk—an early version of the PeopleMover tech!",
                "Look closely at the meteorites; one is shaped like a classic Mickey.",
                "The sleek white architecture was inspired by the 1960s 'Googie' style."
            ],
            'MK_POTC': [
                "The auctioneer's wink was the first complex facial movement ever achieved by an animatronic.",
                "Walt actually wanted this to be a walk-through wax museum originally!",
                "The chess-playing skeletons are trapped in a perpetual stalemate."
            ],
            'MK_HAUNTED': [
                "The 'Doom Buggies' use a technology called Omnimover to keep the line moving constantly.",
                "That's real dust! Imagineering used a special dust-blower to make the ballroom look authentic.",
                "The raven appears in almost every major scene; it was originally meant to be the narrator."
            ]
        };

        const rideTrivia = trivia[rideId] || [
            "Did you know the park uses 'smellitzers' to pump specific scents into the air?",
            "Every brick on Main Street is slightly smaller on higher floors to make the buildings look taller.",
            "There are tunnels (Utilidors) beneath your feet right now!"
        ];

        return rideTrivia[Math.floor(Math.random() * rideTrivia.length)];
    }
}

export const findAndSeekStore = new FindAndSeekEngine();
