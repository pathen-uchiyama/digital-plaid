import { ParkID, ResortID } from '../types';

interface RuleSet {
    transportBufferMin: number;
    walkingBufferMin: number;
    bookingWindow: string;
}

const WDW_RULES: RuleSet = {
    transportBufferMin: 45,
    walkingBufferMin: 15,
    bookingWindow: '7/3 days pre-booking',
};

const DL_RULES: RuleSet = {
    transportBufferMin: 15,
    walkingBufferMin: 5,
    bookingWindow: 'Day-of booking',
};

// 2026 Hard-coded refurbishments
const REFURBISHMENTS_2026 = [
    { item: 'Big Thunder Mountain', resort: 'WDW', end: '2026-12-31' }, // Assume year-long
    { item: 'Buzz Lightyear', resort: 'WDW', start: '2026-03-02' },
    { item: 'Rock \'n\' Roller Coaster', resort: 'WDW', start: '2026-03-02' },
    { item: 'Jungle Cruise', resort: 'DL', start: '2026-02-01', end: '2026-02-28' },
    { item: 'Space Mountain', resort: 'DL', start: '2026-02-20' },
];

export class RuleEngine2026 {
    static getRules(parkId: ParkID): RuleSet {
        if (['MK', 'EP', 'HS', 'AK'].includes(parkId)) {
            return WDW_RULES;
        }
        return DL_RULES;
    }

    static isAvailable(itemName: string, resortId: ResortID, date: Date): boolean {
        const dateStr = date.toISOString().split('T')[0];
        const refurb = REFURBISHMENTS_2026.find(r => r.item === itemName && r.resort === resortId);

        if (!refurb) return true;

        const start = refurb.start || '1970-01-01';
        const end = refurb.end || '2099-12-31';

        return dateStr < start || dateStr > end;
    }

    static getCrowdFlowAdjustment(parkId: ParkID, date: Date): number {
        // 2026 Specific: DCA 25th Anniversary starts July 2026
        if (parkId === 'DCA' && date > new Date('2026-07-01')) {
            return 1.4; // 40% higher crowds
        }
        return 1.0;
    }

    static getTransitAdjustment(
        isCrossingParadePath: boolean,
        isParadeActive: boolean
    ): number {
        if (isCrossingParadePath && isParadeActive) {
            return 20; // +20 minute transit penalty
        }
        return 0;
    }
}
