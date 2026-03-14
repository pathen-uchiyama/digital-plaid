import { ItineraryStep } from '../types';

export enum WeatherCondition {
    CLEAR = 'Clear',
    RAIN = 'Rain',
    SNOW = 'SNOW',
    EXTREME_HEAT = 'EXTREME_HEAT',
    STORM = 'Storm',
    HEAT_WAVE = 'Heat Wave'
}

export interface RainyPlanB {
    originalRideId: string;
    suggestedRideId: string;
    reason: string;
}

export class WeatherProtocol {
    private static PIVOT_MAP: Record<string, RainyPlanB> = {
        'MK_SPACE': { originalRideId: 'MK_SPACE', suggestedRideId: 'MK_POTC', reason: 'Indoor queue and ride; avoids the open-air trek to Tomorrowland.' },
        'EP_TEST': { originalRideId: 'EP_TEST', suggestedRideId: 'EP_FROZEN', reason: 'Outdoor track closed due to rain; Frozen is 100% weather-shielded.' },
        'HS_SLINKY': { originalRideId: 'HS_SLINKY', suggestedRideId: 'HS_MMRR', reason: 'Outdoor coaster exposed; Mickey & Minnie is the premier indoor refuge.' }
    };

    static getRainyPlanB(rideId: string): RainyPlanB | null {
        return this.PIVOT_MAP[rideId] || null;
    }
    /**
     * Evaluates the itinerary and suggests specific pivots based on weather alerts.
     */
    static evaluateWeatherPivots(
        itinerary: ItineraryStep[],
        currentCondition: WeatherCondition
    ): { updatedItinerary: ItineraryStep[]; pivotAlert: string | null } {
        if (currentCondition === WeatherCondition.CLEAR) {
            return { updatedItinerary: itinerary, pivotAlert: null };
        }

        let alert: string | null = null;
        const updated = itinerary.map(step => {
            if ((currentCondition === WeatherCondition.RAIN || currentCondition === WeatherCondition.STORM) &&
                step.status === 'pending' &&
                this.PIVOT_MAP[step.id]) {

                const planB = this.PIVOT_MAP[step.id];
                alert = `Rainy Day Pivot: Swapping ${step.step_name} for ${planB.suggestedRideId} (${planB.reason})`;

                return {
                    ...step,
                    status: 'pending' as any,
                    is_pivot: true,
                    step_name: `[REFINED PIVOT] ${step.step_name} -> Indoor Sanctuary suggested`
                };
            }
            return step;
        });

        return { updatedItinerary: updated, pivotAlert: alert };
    }

    static getWeatherBanner(condition: WeatherCondition): string {
        switch (condition) {
            case WeatherCondition.RAIN:
                return "🌧️ Precipitation Alert: Shifting priorities to indoor theater logic.";
            case WeatherCondition.STORM:
                return "⚡ Storm Warning: High-altitude attractions may suspend service.";
            case WeatherCondition.HEAT_WAVE:
                return "🔥 Extreme Heat: Scheduling mandatory AC recovery windows.";
            default:
                return "☀️ Ideal Conditions: Strategic pathing maintained.";
        }
    }
}
