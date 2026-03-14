import { SpatialZone, EnergyOptimizer } from './EnergyOptimizer';

export interface RouteRecommendation {
    rideId: string;
    rideName: string;
    transitTimeMinutes: number;
    penalty: number; // 0-100 (higher is worse)
    reason: string | null;
    recommendedSequence?: string[];
}

export class RoutingEngine {
    private static TRANSIT_MATRIX: Record<string, Record<string, number>> = {
        'tomorrowland': { 'tomorrowland': 5, 'fantasyland': 12, 'adventureland': 22, 'mainstreet': 10 },
        'fantasyland': { 'tomorrowland': 12, 'fantasyland': 5, 'adventureland': 15, 'mainstreet': 15 },
        'adventureland': { 'tomorrowland': 22, 'fantasyland': 15, 'adventureland': 5, 'mainstreet': 10 },
        'mainstreet': { 'tomorrowland': 10, 'fantasyland': 15, 'adventureland': 10, 'mainstreet': 5 }
    };

    /**
     * Calculates the "Transit Penalty" for a potential booking.
     */
    static evaluateTransit(currentRideId: string, targetRideId: string): RouteRecommendation {
        const currentZone = this.getZone(currentRideId);
        const targetZone = this.getZone(targetRideId);

        if (!currentZone || !targetZone) {
            return {
                rideId: targetRideId,
                rideName: 'Unknown',
                transitTimeMinutes: 15,
                penalty: 0,
                reason: null
            };
        }

        const transitTime = this.TRANSIT_MATRIX[currentZone.id]?.[targetZone.id] || 15;
        let penalty = 0;
        let reason: string | null = null;

        // "Ping-Pong" Rule: High penalty for cross-park transits (> 20 mins)
        if (transitTime > 20) {
            penalty = 50;
            reason = "High Transit Penalty: Location is on the opposite side of the park. This might cause 'Ping-Pong' fatigue.";
        } else if (transitTime > 10) {
            penalty = 20;
            reason = "Moderate Transit: Requires a cross-land walk.";
        }

        return {
            rideId: targetRideId,
            rideName: 'Target Ride',
            transitTimeMinutes: transitTime,
            penalty,
            reason
        };
    }

    /**
     * Clusters a list of ride IDs into geographic groups to minimize walking.
     */
    static clusterByZone(rideIds: string[]): Record<string, string[]> {
        const clusters: Record<string, string[]> = {};

        rideIds.forEach(id => {
            const zone = this.getZone(id);
            const zoneId = zone?.id || 'unknown';
            if (!clusters[zoneId]) clusters[zoneId] = [];
            clusters[zoneId].push(id);
        });

        return clusters;
    }

    /**
     * Re-orders an itinerary to prioritize geographic proximity.
     */
    static optimizeForProximity(rideIds: string[]): string[] {
        const clusters = this.clusterByZone(rideIds);
        const optimized: string[] = [];

        // Priority order for "The Sweep" (Start at Main Street, rotate clockwise)
        const zoneOrder = ['mainstreet', 'adventureland', 'fantasyland', 'tomorrowland'];

        zoneOrder.forEach(zoneId => {
            if (clusters[zoneId]) {
                optimized.push(...clusters[zoneId]);
            }
        });

        // Add any unknown zones at the end
        if (clusters['unknown']) {
            optimized.push(...clusters['unknown']);
        }

        return optimized;
    }

    private static getZone(rideId: string): SpatialZone | undefined {
        // Re-using the zones defined in EnergyOptimizer
        const zones = (EnergyOptimizer as any).ZONES;
        return zones.find((z: any) => z.rides.includes(rideId));
    }
}
