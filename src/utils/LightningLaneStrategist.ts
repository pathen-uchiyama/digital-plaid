import { ItineraryStep, Guest, Preference } from '../types';

export interface LightningLaneWindow {
    id: string;
    ride_id: string;
    start_time: string;
    end_time: string;
    is_booked: boolean;
}

export class LightningLaneStrategist {
    /**
     * Identifies the best next Lightning Lane to book based on "Must-Do" preferences
     * and sensory state of the group.
     */
    static getOptimalBooking(
        mustDos: string[],
        currentItinerary: ItineraryStep[],
        bookedLLs: LightningLaneWindow[]
    ): string | null {
        // Find must-dos that aren't in the itinerary yet and aren't booked
        const pendingMustDos = mustDos.filter(id =>
            !currentItinerary.some(step => step.id === id) &&
            !bookedLLs.some(ll => ll.ride_id === id)
        );

        return pendingMustDos.length > 0 ? pendingMustDos[0] : null;
    }

    /**
     * Calculates the "Optimal Window" for a specific ride based on historical wait times
     * (Mock implementation for prototype)
     */
    static getWindowBadge(rideId: string): string | null {
        const highDemand = ['MK_SPACE', 'MK_7DMT', 'MK_TRON'];
        if (highDemand.includes(rideId)) {
            return "High Value LL Opportunity";
        }
        return "Optimal LL Window: 14:00+";
    }

    /**
     * Determines if a Lightning Lane should be prioritized over standby 
     * based on sensory needs. (e.g. if the queue is loud/hot, use LL to skip).
     */
    static shouldPrioritizeLLForSensory(ride: ItineraryStep, guests: Guest[]): boolean {
        const hasSensoryNeeds = guests.some(g => g.sensory_sensitivities && g.sensory_sensitivities.length > 0);
        return hasSensoryNeeds && (ride.sensory_tags?.includes('Loud') || ride.intensity === 'High');
    }
}
