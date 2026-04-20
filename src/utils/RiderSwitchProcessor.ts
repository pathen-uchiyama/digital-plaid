import { Guest, ItineraryStep, Ride } from '../types';

export class RiderSwitchProcessor {
    /**
     * Process a ride step for Rider Switch (Child Swap).
     * 
     * @param step          The ride itinerary step
     * @param guests        All guests in the party
     * @param heightRequirementCm  Manual height requirement in cm (legacy)
     * @param rideMetadata  Optional backend-enriched ride data. When provided,
     *                      auto-detects height requirement and ride duration.
     */
    static processStep(
        step: ItineraryStep,
        guests: Guest[],
        heightRequirementCm: number,
        rideMetadata?: Ride
    ): ItineraryStep[] {
        // Use backend height data if available (convert inches → cm)
        const effectiveHeightCm = rideMetadata?.heightRequirement
            ? Math.round(rideMetadata.heightRequirement * 2.54)
            : heightRequirementCm;

        const tooShort = guests.filter(g => g.height_cm < effectiveHeightCm);

        if (tooShort.length === 0) return [step];

        // Estimate ride duration from metadata or use default
        const rideDurationMins = rideMetadata?.durationMinutes ?? 20;
        const landmark = rideMetadata?.landmark;

        // Create Double-Blocks
        const blockA: ItineraryStep = {
            ...step,
            id: `${step.id}_A`,
            step_name: `${step.step_name} (Group 1)`,
            duration_mins: rideDurationMins,
            notes: `Parent 1 + Tall Kids. Parent 2 waits with ${tooShort.map(g => g.name).join(', ')}.`,
        };

        const blockB: ItineraryStep = {
            ...step,
            id: `${step.id}_B`,
            step_name: `${step.step_name} (Group 2 - Swap)`,
            duration_mins: rideDurationMins,
            notes: `Parent 2 + Tall Kids (again!). Parent 1 waits.`,
        };

        // Low-wait "Nudges" during blocks — use landmark for proximity-aware suggestions
        const waitingActivity: ItineraryStep = {
            id: `${step.id}_Waiting`,
            trip_id: step.trip_id,
            park_id: step.park_id,
            step_name: landmark
                ? `Nearby Activity in ${landmark}`
                : 'Nearby Low-Wait Activity',
            step_type: 'break',
            planned_start: step.planned_start,
            status: 'pending',
            is_pivot: true,
            notes: landmark
                ? `Suggested: Explore ${landmark} — look for characters, playground, or snack stands nearby.`
                : 'Suggested: Nearby playground, snack, or characters.',
        };

        return [blockA, waitingActivity, blockB];
    }

    /**
     * Auto-detect rides needing Rider Switch from backend metadata.
     * Returns ride names that have height requirements and hasRiderSwitch = true.
     */
    static getRiderSwitchRides(rides: Ride[], guests: Guest[]): Ride[] {
        const shortestGuestCm = Math.min(...guests.map(g => g.height_cm));
        return rides.filter(r => {
            if (!r.heightRequirement) return false;
            const reqCm = Math.round(r.heightRequirement * 2.54);
            return shortestGuestCm < reqCm && r.hasRiderSwitch !== false;
        });
    }

    static validateParentHandOff(
        stepA: ItineraryStep,
        stepB: ItineraryStep,
        numToddlers: number
    ): boolean {
        // If there's only one toddler, Parent A and Parent B cannot both be on DIFFERENT rides at the same time.
        // This validates that the scheduler hasn't created a logic loop where no one is watching the child.
        if (numToddlers === 1) {
            const startA = new Date(stepA.planned_start).getTime();
            const endA = startA + (stepA.planned_wait || 0 + 20) * 60000; // rough dur
            const startB = new Date(stepB.planned_start).getTime();

            if (startB < endA) return false; // Conflict!
        }
        return true;
    }
}
