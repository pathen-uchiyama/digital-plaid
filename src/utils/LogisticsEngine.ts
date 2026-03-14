export interface LogisticsAlert {
    id: string;
    type: 'weather' | 'gear' | 'battery' | 'crowd';
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
}

export interface PhysicalPin {
    id: string;
    type: 'stroller' | 'parking' | 'rendezvous';
    locationName: string;
    coordinates?: { lat: number; lng: number };
    timestamp: number;
    note?: string;
}

export class LogisticsEngine {
    /**
     * Generates morning-of gear recommendations based on weather data.
     */
    static getGearRecommendations(weather: { temp: number; rainChance: number }): string[] {
        const gear: string[] = ['MagicBands', 'Sunscreen', 'Water Bottles'];

        if (weather.rainChance > 30) {
            gear.push('Ponchos');
            gear.push('Extra Socks');
        }

        if (weather.temp > 85) {
            gear.push('Cooling Towels');
            gear.push('Portable Fan');
        } else if (weather.temp < 65) {
            gear.push('Light Jacket');
        }

        return gear;
    }

    /**
     * Analyzes park health and generates concierge nudges.
     */
    static getRefinedAlerts(
        batteryLevel: number,
        parkCrowds: 'High' | 'Moderate' | 'Low'
    ): LogisticsAlert[] {
        const alerts: LogisticsAlert[] = [];

        if (batteryLevel < 0.25) {
            alerts.push({
                id: 'batt_low',
                type: 'battery',
                title: 'Lead Health: Critical',
                message: 'Battery at 25%. Nearest Fuel Rod station: Tomorrowland Light & Power.',
                priority: 'high'
            });
        }

        if (parkCrowds === 'High') {
            alerts.push({
                id: 'crowd_high',
                type: 'crowd',
                title: 'Boutique Congestion',
                message: 'Main Street is at peak density. Use the railroad or side bypass for comfort.',
                priority: 'medium'
            });
        }

        return alerts;
    }

    /**
     * Formats a physical pin into a boutique alert for the Horizon Dashboard.
     */
    static getPinAlert(pin: PhysicalPin): LogisticsAlert {
        const icons: Record<string, string> = {
            stroller: 'Stroller Found',
            parking: 'Car Located',
            rendezvous: 'Group Meeting Point'
        };

        return {
            id: pin.id,
            type: 'gear',
            title: icons[pin.type] || 'Location Pin',
            message: `${pin.locationName}${pin.note ? ` (${pin.note})` : ''}. Saved at ${new Date(pin.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
            priority: 'medium'
        };
    }
}
