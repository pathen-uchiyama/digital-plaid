/**
 * Best Spot & Viewing Location Database
 * 
 * Curated repository of "Golden Seats" and prime viewing areas for the Castle Companion guide.
 */

export interface ViewingInsight {
    entityId: string;
    name: string;
    type: 'Ride' | 'Show' | 'Parade';
    bestSpot: string;
    refinedRationale: string;
}

export const BEST_SPOT_DATABASE: Record<string, ViewingInsight> = {
    'soarin_epcot': {
        entityId: 'soarin_epcot',
        name: 'Soarin\' Around the World',
        type: 'Ride',
        bestSpot: 'B1 (Center Top)',
        refinedRationale: 'Row 1 ensures no dangling feet enter your FOV, and Section B is the dead-center horizon line.'
    },
    'festival_of_fantasy_parade': {
        entityId: 'festival_of_fantasy_parade',
        name: 'Festival of Fantasy',
        type: 'Parade',
        bestSpot: 'Hall of Champions (2nd Floor)',
        refinedRationale: 'Provides an elevated, uncrowded view of the floats and avoids the Liberty Square heat.'
    },
    'mickey_phillharmagic': {
        entityId: 'mickey_phillharmagic',
        name: 'Mickey\'s PhilharMagic',
        type: 'Show',
        bestSpot: 'Back 1/3, Center',
        refinedRationale: 'The 3D effects are optimized for the rear-center projection cone to avoid distortion.'
    },
    'main_street_photo_angle': {
        entityId: 'main_street_photo_angle',
        name: 'Main Street Secret Angle',
        type: 'Show', // Categorized as Show for mapping to "Magic Moments"
        bestSpot: 'Sleepy Hollow Bridge',
        refinedRationale: 'Skip the Main Street hub crowd. This angle provides a clear Castle shot with zero tourists in your background frame.'
    }
};

export class BestSpotDatabase {
    static getInsight(entityId: string): ViewingInsight | null {
        return BEST_SPOT_DATABASE[entityId] || null;
    }
}
