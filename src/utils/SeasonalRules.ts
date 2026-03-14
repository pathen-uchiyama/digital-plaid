import { SeasonalRule, ParkID } from '../types';

export class SeasonalRulesEngine {
    private static rules: SeasonalRule[] = [
        {
            id: 'spring_break_2026',
            park_id: 'MK',
            date: '2026-03-20', // Test date within range
            is_peak: true,
            crowd_modifier: 1.4, // +40% penalty
        },
        {
            id: 'epcot_flower_garden',
            park_id: 'EP',
            date: '2026-03-20',
            is_peak: true,
            crowd_modifier: 1.2,
        },
        {
            id: 'dca_25th_anniversary',
            park_id: 'DCA',
            date: '2026-03-20',
            is_peak: true,
            crowd_modifier: 1.3,
        }
    ];

    static getRuleForDate(parkId: ParkID, date: string): SeasonalRule | null {
        return this.rules.find(r => r.park_id === parkId && r.date === date) || null;
    }

    static getAdjustedWait(parkId: ParkID, rideId: string, baseWait: number, date: string): number {
        const rule = this.getRuleForDate(parkId, date);
        if (!rule) return baseWait;

        const override = rule.standard_wait_override?.[rideId];
        if (override) return override;

        return Math.round(baseWait * rule.crowd_modifier);
    }
}
