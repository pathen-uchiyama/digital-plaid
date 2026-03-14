import { ItineraryStep, BookingRequest, Guest } from '../types';
class AutoBookingManager {
    private activeRequests: Map<string, BookingRequest> = new Map();
    private rideCountGoal: 'max' | 'relaxed' = 'relaxed';

    setRideCountGoal(goal: 'max' | 'relaxed') {
        this.rideCountGoal = goal;
        console.log(`[AutoBooking] Goal set to: ${goal}`);
    }

    /**
     * Registers a new "Set and Forget" request.
     */
    registerRequest(
        rideId: string,
        rideName: string,
        window: BookingRequest['targetTimeWindow'],
        splitAllowed: boolean = false
    ): void {
        this.activeRequests.set(rideId, {
            id: `hunt_${Date.now()}_${rideId}`,
            rideId,
            rideName,
            targetTimeWindow: window,
            status: 'Searching',
            splitAllowed
        });
        console.log(`[AutoBooking] Registered Strategic Hunt for ${rideName} (${window})`);

        // Simulating background success for the demo
        setTimeout(() => {
            this.simulateBookingSuccess(rideId);
        }, 15000);
    }

    private simulateBookingSuccess(rideId: string) {
        const req = this.activeRequests.get(rideId);
        if (req) {
            // Strategic Simulation: Split Party Detection
            const partySize = 6; // Mock party size
            const slotsFound = Math.random() > 0.5 ? partySize : partySize / 2;

            if (slotsFound < partySize && !req.splitAllowed) {
                req.status = 'On Hold';
                req.reason = `Found ${slotsFound} slots, but required ${partySize}. Party integrity priority active.`;
                this.activeRequests.set(rideId, req);
                console.log(`[AutoBooking] HOLD: Split party detected for ${req.rideName}`);
                return;
            }

            req.status = 'Booked';
            this.activeRequests.set(rideId, req);
            console.log(`[AutoBooking] SUCCESS: Booked ${req.rideName}`);
        }
    }

    getRequests(): BookingRequest[] {
        return Array.from(this.activeRequests.values());
    }

    isSearching(rideId: string): boolean {
        return this.activeRequests.get(rideId)?.status === 'Searching';
    }

    isBooked(rideId: string): boolean {
        return this.activeRequests.get(rideId)?.status === 'Booked';
    }

    /**
     * Invisible Sniper: Silently churns an existing booking for better times.
     */
    startInvisibleSniper(rideId: string, currentItinerary: ItineraryStep[], guests: Guest[]): void {
        const req = this.activeRequests.get(rideId);
        if (!req || req.status !== 'Booked') return;

        console.log(`[Sniper] Initiating Invisible Churn for ${req.rideName} (Goal: ${this.rideCountGoal})...`);

        // Simulate finding a better time (e.g., 6 hours earlier)
        setTimeout(() => {
            const betterTime = new Date(); // Mocking an earlier slot
            betterTime.setHours(betterTime.getHours() + 2); // 2 hours from now

            // MOCKED: Backend will run actual blackout checks.
            const conflict = false;
            if (conflict) {
                console.log(`[Sniper] ABORT: Found better time but ${conflict}`);
                return;
            }

            console.log(`[Sniper] TARGET ACQUIRED: Moved ${req.rideName} up by 4 hours.`);
            // In a real app, this would update the actual MDX reservation
        }, 8000);
    }
}

export const autoBookingEngine = new AutoBookingManager();
