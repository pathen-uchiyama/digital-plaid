import { ItineraryStep } from '../types';

export interface DiningLeadTime {
    restaurantId: string;
    leadMins: number; // How long from order to fulfillment
    lastUpdated: string;
}

export class MobileOrderWatchdog {
    private static leadTimes: Record<string, DiningLeadTime> = {
        'docking_bay_7': { restaurantId: 'docking_bay_7', leadMins: 25, lastUpdated: new Date().toISOString() },
        'woodys_lunchbox': { restaurantId: 'woodys_lunchbox', leadMins: 40, lastUpdated: new Date().toISOString() },
        'caseys_corner': { restaurantId: 'caseys_corner', leadMins: 15, lastUpdated: new Date().toISOString() },
    };

    /**
     * Calculates the "Order Now" window for a given meal step.
     * Returns the number of minutes until the user SHOULD place their order.
     */
    static getOrderWindow(step: ItineraryStep): number | null {
        if (step.step_type !== 'food') return null;

        const restaurantId = step.id; // Mocking ID as restaurantId
        const leadTime = this.leadTimes[restaurantId]?.leadMins || 20; // Default 20m
        const targetTime = new Date(step.planned_start).getTime();
        const currentTime = Date.now();

        const orderTime = targetTime - (leadTime * 60000);
        const minsUntilOrder = Math.floor((orderTime - currentTime) / 60000);

        return minsUntilOrder;
    }

    /**
     * Returns a Hunger Guard alert if the order window is closing (within 10 mins).
     */
    static getHungerGuardAlert(step: ItineraryStep): string | null {
        const minsUntilOrder = this.getOrderWindow(step);
        if (minsUntilOrder !== null && minsUntilOrder <= 10 && minsUntilOrder > 0) {
            return `Hunger Guard: Place your ${step.step_name} order in ${minsUntilOrder}m to eat on schedule!`;
        }
        if (minsUntilOrder !== null && minsUntilOrder <= 0) {
            return `Hunger Guard: PLACE ORDER FOR ${step.step_name} NOW. Kitchen lead-time is peaking!`;
        }
        return null;
    }

    /**
     * Suggests a "Snack Cluster" based on current location (mocked).
     */
    static getSnackClusterNudge(currentLocation: string): string | null {
        if (currentLocation.includes('Tomorrowland')) {
            return "Snack Cluster: Near Cosmic Ray's? The Cheshire Cat Tail is a 2-min walk and a fan favorite.";
        }
        if (currentLocation.includes('Galaxy')) {
            return "Snack Cluster: Near Ronto Roasters? The Ronto Wrap is the perfect mid-morning protein boost.";
        }
        return null;
    }
}
