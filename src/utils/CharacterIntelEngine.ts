/**
 * Character Intelligence Engine
 * 
 * Monitors the real-time map for character sightings and flags "Rare" or "High-Density" moments.
 */

export interface CharacterSighting {
    id: string;
    name: string;
    location: string;
    rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
    estimatedWait: number;
}

export class CharacterIntelEngine {
    private static RARE_THRESHOLD = 0.95;

    /**
     * Pulls sightings from the MDE GraphQL endpoint and tags them by rarity score.
     */
    static async scanForSightings(): Promise<CharacterSighting[]> {
        // Mocking the detection of a rare sighting
        return [
            { id: '1', name: 'Mickey Mouse', location: 'Town Hall', rarity: 'Common', estimatedWait: 45 },
            { id: '2', name: 'Max Goof', location: 'Main Street (Pop-up)', rarity: 'Rare', estimatedWait: 10 },
            { id: '3', name: 'Phineas & Ferb', location: 'Epcot Entrance', rarity: 'Legendary', estimatedWait: 15 }
        ];
    }

    /**
     * Determines if a sighting justifies a "Refined Pivot" push notification.
     */
    static shouldAlert(sighting: CharacterSighting, userLocation: string): boolean {
        if (sighting.rarity === 'Legendary') return true;
        if (sighting.rarity === 'Rare' && sighting.estimatedWait < 20) return true;
        return false;
    }
}
