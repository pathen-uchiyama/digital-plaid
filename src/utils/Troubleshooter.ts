export interface Diagnosis {
    type: 'Critical' | 'Warning' | 'Optimization';
    message: string;
    actionLabel: string;
    resolution: string;
}

export class Troubleshooter {
    /**
     * Diagnoses common park-day glitches ("The Fix-It Flow").
     */
    static diagnose(context: { batteryLevel: number; gpsEnabled: boolean; overlapDetected: boolean }): Diagnosis[] {
        const issues: Diagnosis[] = [];

        if (context.batteryLevel < 0.15) {
            issues.push({
                type: 'Critical',
                message: 'Battery Critical: Pushing state to Ultra-Low Power mode.',
                actionLabel: 'Enter Power Sanctuary',
                resolution: 'Turning off background background GPS and reducing polling to 5m intervals.'
            });
        }

        if (!context.gpsEnabled) {
            issues.push({
                type: 'Warning',
                message: 'GPS Desync: Location services are currently inactive.',
                actionLabel: 'Re-Sync Location',
                resolution: 'Toggle GPS in system settings or use the manual "I am at [Ride]" override.'
            });
        }

        if (context.overlapDetected) {
            issues.push({
                type: 'Optimization',
                message: 'Overlapping Plans: You have multiple bookings spanning 1:00 PM - 2:00 PM.',
                actionLabel: 'De-Conflict Schedule',
                resolution: 'We recommend canceling the lower-priority character meet-up to ensure your Lightning Lane group is valid.'
            });
        }

        if (issues.length === 0) {
            issues.push({
                type: 'Optimization',
                message: 'System Status: All systems nominal.',
                actionLabel: 'Refresh MDE Sync',
                resolution: 'If you see phantom bookings, a quick pull-to-refresh will re-sync your Digital Portfolio.'
            });
        }

        return issues;
    }
}
