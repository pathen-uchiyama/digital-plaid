/**
 * Live Activity Manager
 * 
 * Orchestrates the "Pocket Mode" experience via iOS Live Activities (Dynamic Island)
 * and Android persistent notifications.
 * 
 * Now integrates with NudgePayload for structured notification rendering
 * and HapticFeedback for silent haptic patterns.
 */

import { NudgePayload, NudgeType } from '../types';
import { HapticFeedback } from './HapticFeedback';

export interface LiveActivityState {
    headline: string;
    subheadline: string;
    waitMinutes: number;
    status: 'on-time' | 'delay' | 'magic-discovery' | 'stranded';
    progress: number; // 0 to 1
    actionLabel?: string;
    nudgeType?: NudgeType;
}

export class LiveActivityManager {
    /**
     * Updates the system-level widget/notification with the current "Horizon" state.
     */
    static async updateLiveActivity(state: LiveActivityState): Promise<void> {
        console.log(`[Live Activity] Syncing Horizon state: ${state.headline} (${state.status})`);

        // In a real Expo project, this would interface with a native module 
        // to update ActivityKit (iOS) or a Foreground Service (Android).

        if (state.status === 'magic-discovery') {
            console.log(`[Dynamic Island] Rendering Golden Sparkle animation for: ${state.actionLabel}`);
        }
    }

    /**
     * Processes an incoming NudgePayload and updates the Live Activity state accordingly.
     * This bridges the server-side Guardian agent with the client-side UI.
     */
    static async processNudge(nudge: NudgePayload): Promise<void> {
        // 1. Fire the haptic pattern
        HapticFeedback.trigger(nudge.hapticPattern);

        // 2. Map nudge to a Live Activity state update
        const state: LiveActivityState = {
            headline: this.getHeadlineForNudge(nudge),
            subheadline: nudge.message.length > 80
                ? nudge.message.substring(0, 77) + '...'
                : nudge.message,
            waitMinutes: 0,
            progress: 1,
            status: nudge.nudgeType === 'PIVOT' ? 'magic-discovery' : 'on-time',
            actionLabel: nudge.actionLink ? 'Open in My Disney Experience' : undefined,
            nudgeType: nudge.nudgeType,
        };

        await this.updateLiveActivity(state);

        // 3. If it's a dining handoff, show the deep link action prominently
        if (nudge.nudgeType === 'DINING_HANDOFF' && nudge.actionLink) {
            console.log(`[Live Activity] One-Tap Handoff ready: ${nudge.actionLink}`);
        }

        // 4. Show fun seek lore hint if present
        if (nudge.funSeekTrigger) {
            console.log(`[Live Activity] Fun Seek sparkle: ${nudge.funSeekTrigger}`);
        }
    }

    /**
     * Maps nudge types to concise, glanceable headlines for the Live Activity.
     */
    private static getHeadlineForNudge(nudge: NudgePayload): string {
        switch (nudge.nudgeType) {
            case 'PIVOT':
                return '✨ Magic Pivot Active';
            case 'RAIN_ALERT':
                return '🌧️ Weather Shift';
            case 'DINING_HANDOFF':
                return '🍽️ Reservation Ready';
            case 'LL_READY':
                return '⚡ Lightning Lane';
            case 'SHOWTIME_SHIFT':
                return '🎆 Show Rescheduled';
            default:
                return '🏰 Update';
        }
    }

    /**
     * Terminates the current Live Activity when the adventure is marked complete.
     */
    static async terminateActivity(): Promise<void> {
        console.log("[Live Activity] Adventure complete. Cleaning up lock screen widgets.");
        HapticFeedback.cancel();
    }
}
