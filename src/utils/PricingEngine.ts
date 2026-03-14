export type AccessLevel = 'Boutique' | 'Elite' | 'Founding Member';

export interface TripPass {
    id: string;
    level: AccessLevel;
    price: number;
    benefits: string[];
    durationDays: number;
}

export class PricingEngine {
    private static passes: TripPass[] = [
        {
            id: 'pass_boutique',
            level: 'Boutique',
            price: 49.99,
            durationDays: 1,
            benefits: [
                'Unlimited Strategic Hunts',
                'Geo-Clustering Smart Routing',
                'Family Integrity Protection'
            ]
        },
        {
            id: 'pass_elite',
            level: 'Elite',
            price: 199.99,
            durationDays: 7,
            benefits: [
                'All Boutique Features',
                'Invisible Sniper (Silent Churning)',
                'Guardian Security (Stroller/Parking Pins)',
                'Priority Concierge Support'
            ]
        }
    ];

    static getPasses(): TripPass[] {
        return this.passes;
    }

    static getAccessExplanation(level: AccessLevel): string {
        if (level === 'Elite') return "Maximum Strategic Advantage: All advanced bot orchestration and security suites active.";
        return "Boutique Essentials: Smart routing and precision targeting active.";
    }
}
