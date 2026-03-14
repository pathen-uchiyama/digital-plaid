import { ItineraryStep } from '../types';
import { BatteryStrategist } from './BatteryStrategist';

export interface ContextState {
    batteryLevel: number;
    gpsEnabled: boolean;
    currentLoomStep?: ItineraryStep;
    detectedLocationId?: string;
}

export class ContextManager {
    /**
     * Determines the most efficient context source based on system state.
     * Prioritizes 'The Loom' if battery is low or GPS is restricted.
     */
    static getActiveContext(state: ContextState): string {
        const isUltraLight = BatteryStrategist.isUltraLightMode(state.batteryLevel);
        const batteryCritical = state.batteryLevel < 0.4;

        // If battery is low or GPS is disabled, strictly follow the Loom (Itinerary)
        if (batteryCritical || !state.gpsEnabled || isUltraLight) {
            return state.currentLoomStep?.park_id + '_' + state.currentLoomStep?.step_type.toUpperCase() || 'UNKNOWN';
        }

        // Otherwise, if high-accuracy GPS/Geofencing detected a specific location, use that
        if (state.detectedLocationId) {
            return state.detectedLocationId;
        }

        // Default back to Loom if nothing else is detected
        return state.currentLoomStep?.park_id || 'UNKNOWN';
    }

    /**
     * Simulation of Passive Memory Capture logic.
     * Returns metadata for the Memory Maker without needing background GPS logs.
     */
    static capturePassiveMemory(step: ItineraryStep, photoCount: number = 0) {
        return {
            timestamp: new Date().toISOString(),
            stepName: step.step_name,
            location: step.park_id,
            verifiedVia: 'Loom Completion',
            aesthetic: 'V3 Hybrid'
        };
    }

    static getPollingInterval(batteryLevel: number, currentActivity: string | null, isEating: boolean): number {
        // Context-Aware Polling (Phase 32)
        // If battery is low (< 20%), or guest is eating, or in a long queue (> 30m), reduce polling.
        if (batteryLevel < 0.2) return 120000; // 2 minutes
        if (isEating) return 180000; // 3 minutes

        const inLongQueue = currentActivity?.includes('Wait') || currentActivity?.includes('Queue');
        if (inLongQueue) return 90000; // 90 seconds

        return 30000; // 30 seconds (Default High-Touch)
    }

    static shouldIncreasePolling(cooldownRemainingMins: number): boolean {
        // Ramp up polling 5 minutes before cooldown expires
        return cooldownRemainingMins <= 5;
    }
}
