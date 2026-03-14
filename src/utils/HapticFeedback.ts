import { Platform, Vibration } from 'react-native';
import { NudgePayload, HapticPattern } from '../types';

/**
 * HapticFeedback — Client-side haptic pattern executor.
 *
 * Receives NudgePayload objects from FCM push notifications and
 * triggers the corresponding vibration pattern on the device.
 *
 * Blueprint patterns:
 *   DOUBLE_TAP     → "Your Lightning Lane is ready"
 *   LONG_VIBRATION → "Rain is coming"
 *   TRIPLE_PULSE   → "Ride went down, here's your pivot"
 *   GENTLE_NUDGE   → General information
 */
export class HapticFeedback {

    /**
     * Vibration pattern definitions (in milliseconds).
     * Format: [wait, vibrate, wait, vibrate, ...]
     *
     * iOS uses Haptic Engine (more precise), Android uses Vibration API.
     */
    private static PATTERNS: Record<HapticPattern, number[]> = {
        'DOUBLE_TAP': [0, 100, 100, 100],           // Two quick taps
        'LONG_VIBRATION': [0, 500],                      // Single sustained vibration
        'TRIPLE_PULSE': [0, 80, 80, 80, 80, 80],      // Three rapid pulses
        'GENTLE_NUDGE': [0, 50],                       // Brief, subtle buzz
    };

    /**
     * Executes the haptic pattern for a received nudge.
     * Called by the FCM message handler when a NudgePayload arrives.
     */
    static trigger(pattern: HapticPattern): void {
        const vibrationPattern = this.PATTERNS[pattern] || this.PATTERNS['GENTLE_NUDGE'];

        if (Platform.OS === 'ios') {
            // iOS: Haptic Engine provides better fidelity
            // In a full Expo project, use expo-haptics for more granular control:
            //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
            Vibration.vibrate(vibrationPattern);
        } else {
            // Android: Standard Vibration API with pattern
            Vibration.vibrate(vibrationPattern, false);
        }
    }

    /**
     * Processes an incoming FCM NudgePayload and executes the haptic + UI update.
     * This is the main entry point called by the push notification handler.
     */
    static async processNudge(nudge: NudgePayload): Promise<void> {
        console.log(`[Haptic] Processing nudge: ${nudge.nudgeType} (${nudge.hapticPattern})`);

        // 1. Fire haptic pattern
        this.trigger(nudge.hapticPattern);

        // 2. Check expiration — don't show expired nudges
        if (nudge.expiresAt && new Date(nudge.expiresAt) < new Date()) {
            console.log(`[Haptic] Nudge expired at ${nudge.expiresAt}, suppressing UI`);
            return;
        }

        // 3. Log for RLHF telemetry (implicit signal that the user received the nudge)
        console.log(`[Haptic] Nudge delivered: ${nudge.message.substring(0, 80)}...`);

        // 4. If there's a deep link action, prepare it for the UI layer
        if (nudge.actionLink) {
            console.log(`[Haptic] Action link available: ${nudge.actionLink}`);
            // The UI layer (React Navigation) will handle opening this deep link
        }

        // 5. Fun Seek trigger — show lore hint in the UI
        if (nudge.funSeekTrigger) {
            console.log(`[Haptic] Fun Seek: ${nudge.funSeekTrigger}`);
        }
    }

    /**
     * Cancels any active vibration (e.g., when user dismisses a nudge).
     */
    static cancel(): void {
        Vibration.cancel();
    }
}
