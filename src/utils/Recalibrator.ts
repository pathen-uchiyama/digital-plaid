import { ItineraryStep, Guest, StepType } from '../types';
import { RefinedCoach } from './ConciergeCoach';

export interface PivotDecision {
    originalStep: ItineraryStep;
    suggestedStep: Partial<ItineraryStep>;
    reason: string;
    benefit: string;
    longGame: string;
}

export class Recalibrator {
    static evaluatePivot(
        currentStep: ItineraryStep,
        allSteps: ItineraryStep[],
        nearbyOptions: ItineraryStep[], // Potential pivots (Like-to-Does, Characters, Snacks)
        currentTime: Date,
        isRaining: boolean = false
    ): PivotDecision | null {
        const hour = currentTime.getHours();
        const isPeakHeat = hour >= 13 && hour <= 16;

        // 1. Check if we actually need a pivot
        const waitSpike = (currentStep.actual_wait || 0) - (currentStep.planned_wait || 0) > 20;
        const status = currentStep.status as string;
        const isDown = status === 'down' || status === 'DOWN';
        const isEarlyClosed = status === 'EARLY_CLOSE' || status === 'early_close';
        const isNotYetOpen = status === 'LATE_OPEN' || status === 'NOT_YET_OPEN' || status === 'not_yet_open';
        const needsPivot = isDown || isEarlyClosed || isNotYetOpen || waitSpike;

        if (!needsPivot && !isRaining) return null;

        // 2. Proximity Search for "Like-to-Do" or Characters nearby
        let suggested = nearbyOptions.find(opt => {
            if (isRaining || isPeakHeat) {
                // Prioritize indoor/AC/Shows/Food
                return opt.step_type === 'show' || opt.step_type === 'snack' || opt.step_type === 'food';
            }
            return opt.step_type === 'ride' || opt.step_type === 'character';
        });

        // Default to a comfort pivot if nothing else found
        if (!suggested) {
            suggested = {
                id: 'snack_pivot_1',
                trip_id: currentStep.trip_id,
                park_id: currentStep.park_id,
                step_name: 'Gaston\'s Tavern (Comfort Pivot)',
                step_type: 'snack',
                planned_start: currentTime.toISOString(),
                status: 'pending',
                is_pivot: true,
                notes: 'Perfect mid-afternoon energy boost and escape from the elements.'
            } as ItineraryStep;
        }

        // 3. Construct Narrative Data — context-aware by closure type
        let reason: string;
        let benefit = isPeakHeat
            ? "the indoor AC will give everyone a chance to cool off"
            : "the line is currently under 20 minutes and keeps our momentum";
        let longGame: string;

        if (isRaining) {
            reason = "The forecast shifted! Let's get the family under cover.";
            benefit = "it provides a solid indoor buffer while the storm passes";
            longGame = `I've moved ${currentStep.step_name} to a later slot when conditions are expected to improve.`;
        } else if (isEarlyClosed) {
            reason = `${currentStep.step_name} has closed early for the evening — this is a scheduled closure, not an outage.`;
            benefit = "we can use the remaining time for a bonus experience nearby";
            longGame = `${currentStep.step_name} will reopen tomorrow. I've shifted it to tomorrow's plan if available.`;
        } else if (isNotYetOpen) {
            reason = `${currentStep.step_name} hasn't opened yet today — it has a later start time than standard park open.`;
            benefit = "we can knock out a shorter wait ride nearby and circle back";
            longGame = `I'll slot ${currentStep.step_name} in once it opens. No need to wait at the entrance.`;
        } else if (isDown) {
            reason = `${currentStep.step_name} is currently experiencing a system outage (DOWN).`;
            benefit = "we avoid burning time in a queue that may not move";
            longGame = `I've moved ${currentStep.step_name} to a later slot when conditions are expected to improve.`;
        } else {
            reason = `${currentStep.step_name} wait time has spiked.`;
            longGame = `I've moved ${currentStep.step_name} to a later slot when conditions are expected to improve.`;
        }

        const decision: PivotDecision = {
            originalStep: currentStep,
            suggestedStep: suggested,
            reason,
            benefit,
            longGame
        };

        return decision;
    }

    static evaluateHangerConflict(
        currentStep: ItineraryStep,
        mealStep: ItineraryStep,
        currentTime: Date
    ): string | null {
        if (!currentStep.actual_wait || !mealStep.planned_start) return null;

        const rideEndTime = new Date(currentTime.getTime() + (currentStep.actual_wait * 60000));
        const mealTime = new Date(mealStep.planned_start);

        if (rideEndTime > mealTime) {
            return `Proactive Alert: Entering the ${currentStep.step_name} queue now (wait: ${currentStep.actual_wait}m) will cause a conflict with your ${mealStep.step_name} Mobile Order. Recommend pivoting to a snack or shifting the meal window.`;
        }

        return null;
    }

    static getUltraLightAdvice(): string {
        return "Refined Power Save: Phone battery is below 20%. I've switched to Ultra-Light Mode. Head to the nearest FuelRod station (Magic Kingdom: Tomorrowland Light & Power Co) or use the AC at Carousel of Progress to recharge your device and the family.";
    }

    static evaluateEmergencyPivot(
        parkId: string,
        youngestAge: number
    ): PivotDecision {
        const isInfant = youngestAge < 3;
        return {
            originalStep: { step_name: 'Emergency Status' } as any,
            suggestedStep: {
                step_name: isInfant ? 'Baby Care Center' : 'Quiet Spot (Rest Area)',
                step_type: 'break',
                notes: isInfant
                    ? 'Safe Harbor found. Full changing stations, nursing rooms, and AC available.'
                    : 'Found a low-sensory area to regroup.'
            } as any,
            reason: 'Emergency/Meltdown Triggered.',
            benefit: isInfant ? 'private facilities and full AC' : 'a quiet environment for sensory reset',
            longGame: 'I have paused the itinerary. Resume when the family is regulated.'
        };
    }
}
