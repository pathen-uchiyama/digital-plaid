import { THEME } from './DesignSystem';

export interface QuietZone {
    id: string;
    name: string;
    type: 'Quiet Zone' | 'Baby Care Center';
    land: string;
    description: string;
}

export class DecompressionEngine {
    private static zones: QuietZone[] = [
        {
            id: 'bcc_mk',
            name: 'Main Street Baby Care Center',
            type: 'Baby Care Center',
            land: 'Main Street, U.S.A.',
            description: 'Full facility with nursing rooms, changing tables, and quiet seating.'
        },
        {
            id: 'qz_frontier',
            name: 'Tom Sawyer Island (Bridges Section)',
            type: 'Quiet Zone',
            land: 'Frontierland',
            description: 'Low-traffic area with shaded seating and natural breeze.'
        },
        {
            id: 'qz_tomorrow',
            name: 'Stitch’s Great Escape (Alcove)',
            type: 'Quiet Zone',
            land: 'Tomorrowland',
            description: 'Cool, dark hallway often underutilized during peak heat.'
        }
    ];

    static getNearestZone(currentLand: string): QuietZone {
        // Simple mock matching by land or returning a default
        const match = this.zones.find(z => z.land.includes(currentLand));
        return match || this.zones[0];
    }

    static getRescueMap(batteryLevel: number): string {
        if (batteryLevel < 0.15) {
            return "Dead Phone Mode: Map data limited to nearest FuelRod Station: Tomorrowland Light & Power Co.";
        }
        return "Standard Logistics: All Quiet Zones active.";
    }
}
