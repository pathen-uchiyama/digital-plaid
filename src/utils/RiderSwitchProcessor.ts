import { Guest, ItineraryStep } from '../types';

export class RiderSwitchProcessor {
    static processStep(
        step: ItineraryStep,
        guests: Guest[],
        heightRequirementCm: number
    ): ItineraryStep[] {
        const tooShort = guests.filter(g => g.height_cm < heightRequirementCm);

        if (tooShort.length === 0) return [step];

        // Create Double-Blocks
        const blockA: ItineraryStep = {
            ...step,
            id: `${step.id}_A`,
            step_name: `${step.step_name} (Group 1)`,
            notes: `Parent 1 + Tall Kids. Parent 2 waits with ${tooShort.map(g => g.name).join(', ')}.`,
        };

        const blockB: ItineraryStep = {
            ...step,
            id: `${step.id}_B`,
            step_name: `${step.step_name} (Group 2 - Swap)`,
            notes: `Parent 2 + Tall Kids (again!). Parent 1 waits.`,
        };

        // Low-wait "Nudges" during blocks
        const waitingActivity: ItineraryStep = {
            id: `${step.id}_Waiting`,
            trip_id: step.trip_id,
            park_id: step.park_id,
            step_name: 'Nearby Low-Wait Activity',
            step_type: 'break',
            planned_start: step.planned_start,
            status: 'pending',
            is_pivot: true,
            notes: 'Suggested: Nearby playground, snack, or characters.',
        };

        return [blockA, waitingActivity, blockB];
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
