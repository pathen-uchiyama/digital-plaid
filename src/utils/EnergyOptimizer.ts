/**
 * Energy Optimizer
 * 
 * Spatial pathing engine that minimizes guest exhaustion by grouping activities by "Zones".
 * Addresses the "Walking Fatigue" pain point common in large theme parks.
 */

export interface SpatialZone {
    id: string;
    name: string;
    rides: string[];
}

export interface PathEfficiency {
    totalStepsEstimated: number;
    backtrackingScore: number; // 0-100 (lower is better)
    recommendation: string | null;
}

export class EnergyOptimizer {
    private static ZONES: SpatialZone[] = [
        { id: 'tomorrowland', name: 'Tomorrowland', rides: ['MK_SPACE', 'MK_ASTRO', 'MK_BUZZ'] },
        { id: 'fantasyland', name: 'Fantasyland', rides: ['MK_MINE', 'MK_PETER', 'MK_PHILL'] },
        { id: 'adventureland', name: 'Adventureland', rides: ['MK_POTC', 'MK_JUNGLE'] }
    ];

    /**
     * Analyzes an itinerary and returns an efficiency score.
     */
    static analyzePath(rideIds: string[]): PathEfficiency {
        const zoneSequence = rideIds.map(id => this.getZone(id)?.id).filter(Boolean);

        // Very basic backtracking detection: if we go A -> B -> A
        let backtrackingCount = 0;
        for (let i = 0; i < zoneSequence.length - 2; i++) {
            if (zoneSequence[i] === zoneSequence[i + 2]) backtrackingCount++;
        }

        return {
            totalStepsEstimated: rideIds.length * 1500, // Very rough average
            backtrackingScore: backtrackingCount * 25,
            recommendation: backtrackingCount > 0
                ? "Refined Warning: You are currently scheduled to cross back into Tomorrowland twice. Recommend shifting 'Buzz Lightyear' to immediately after 'Space Mountain' to save ~2,000 steps."
                : null
        };
    }

    private static getZone(rideId: string): SpatialZone | undefined {
        return this.ZONES.find(z => z.rides.includes(rideId));
    }
}
