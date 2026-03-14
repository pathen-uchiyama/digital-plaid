import { Alert } from 'react-native';

export type TripType = 'family' | 'solo' | 'couple' | 'friends' | 'locals';

export class RefinedCoach {
    private static readonly RECALIBRATION_THRESHOLD_MIN = 15;

    static shouldRecalibrate(
        plannedWaitMin: number,
        actualWaitMin: number,
        isClosed: boolean
    ): boolean {
        if (isClosed) return true;
        return (actualWaitMin - plannedWaitMin) > this.RECALIBRATION_THRESHOLD_MIN;
    }

    static getCoachingMessage(
        scenario: 'wait_spike' | 'pivot' | 'mobile_order' | 'rider_switch' | 'solo_efficiency' | 'date_night',
        itemName: string,
        tripType: TripType,
        dataReason?: string,
        benefit?: string
    ): string {
        const messages = {
            wait_spike: tripType === 'family'
                ? `Logistical Alert: ${itemName} is compromised by a sudden wait spike. Pivot recommended to preserve the family's sanity. Tactical advantage: ${benefit || 'time savings'}.`
                : `Target Compromised: ${itemName} wait time has spiked beyond threshold. Executing pivot for maximum efficiency.`,
            pivot: `Mission Update: Directing team to ${itemName} ${dataReason ? `due to ${dataReason}` : 'for a high-priority efficiency win'}. ${benefit || 'Path cleared.'}`,
            mobile_order: `Sustenance Protocol: ${itemName} kitchen lead times are increasing. Deploy mobile order now to avoid the hunger-zone.`,
            rider_switch: `Rider Switch Protocol: Tactical swap enabled for ${itemName}. Group A enters while Group B rehydrates in the shade.`,
            solo_efficiency: `Tactical Note: ${itemName} has a Single Rider line. Deployment here saves ~${dataReason || '20'} minutes of mission time.`,
            date_night: `Surveillance Note: ${itemName} is the optimal sector for a quiet debrief at sunset. High atmospheric value detected.`
        };
        return messages[scenario];
    }

    static getSensoryNudge(guestName: string, itemName: string, tag: string): string {
        const advice: Record<string, string> = {
            'Loud': "remind them to use their loop earplugs",
            'Drops': "remind them it's just a quick thrill",
            'Enclosed': "keep some space in the queue"
        };
        return `Refined Note for ${guestName}: ${itemName} has a '${tag}' tag. You might want to ${advice[tag] || 'be prepared'}.`;
    }

    static detectSnackGap(lastMealTime: number, currentTime: number): boolean {
        const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
        return (currentTime - lastMealTime) > THREE_HOURS_MS;
    }

    static processCharacterDining(
        diningLocation: string,
        metCharacters: string[],
        allMustMeets: string[]
    ): string[] {
        const diningMap: Record<string, string[]> = {
            'Chef Mickeys': ['Mickey', 'Minnie', 'Donald', 'Goofy', 'Pluto'],
            'Crystal Palace': ['Pooh', 'Tigger', 'Eeyore', 'Piglet'],
            'Royal Hall': ['Cinderella', 'Ariel', 'Belle', 'Snow White']
        };

        const available = diningMap[diningLocation] || [];
        return allMustMeets.filter(char => available.includes(char));
    }

    static calculateMobileOrderBuffer(
        targetMealTime: Date,
        currentKitchenLeadMin: number
    ): Date {
        const BUFFER_MIN = 10;
        const alertTime = new Date(targetMealTime.getTime());
        alertTime.setMinutes(alertTime.getMinutes() - currentKitchenLeadMin - BUFFER_MIN);
        return alertTime;
    }

    static getStaminaAdjustment(staminaScore: number): number {
        if (staminaScore <= 3) return 0.5; // Stay very close
        if (staminaScore >= 8) return 1.5; // Cross-park is fine
        return 1.0;
    }

    static getPresenceNudge(locationId: string): string | null {
        const nudges: Record<string, string> = {
            'HS_TOT': "The ghost in the photo booth is looking for a new roommate—smile big!",
            'DL_HM': "Check the conservatory—the shadow piano player is working on a new piece.",
            'WDW_MUPPETS': "Look for the key under the mat at Muppet*Vision—it’s a classic!",
        };
        return nudges[locationId] || null;
    }

    static getMorningBriefing(userName: string, rainChance: number, temp: number, isPeak: boolean): string {
        const crowdMsg = isPeak ? "High-Density Operations" : "Standard Operations";
        const rainMsg = rainChance > 0.4 ? "Wet-Weather Protocols Active" : "Optimal Environmental Conditions";
        const strategyMsg = isPeak ? "prioritize Precision Lightning Lane windows" : "maintain a steady logistical flow";
        const prepMsg = rainChance > 0.4 ? "Gear check: Ponchos and waterproof covers" : "Hydration check: Full bottle recommended";

        return `MISSION BRIEFING, ${userName.toUpperCase()}: Today is a day for ${crowdMsg}. ${rainMsg}. Our primary objective: ${strategyMsg}. ${prepMsg}. Let's move to the mobilization point.`;
    }

    /**
     * Proactive Defense: Detects parade traps and suggests crossing times.
     */
    static getParadeDefenseNudge(parkId: string, currentStep: string, nextStep: string, time: Date): string | null {
        // Mock logic for parade trap at MK (Liberty Square bridge)
        const hour = time.getHours();
        if (parkId === 'MK' && hour === 14) { // 3 PM parade prep
            return `PROACTIVE DEFENSE: Festival of Fantasy is staging. If you don't cross the Liberty Square bridge in the next 10 minutes, your path to Tomorrowland will be blocked for 45 minutes. Move now.`;
        }
        return null;
    }

    static getTransitAdjustment(parkId: string, location: string, isShowtime: boolean): number {
        if (parkId === 'DCA' && isShowtime) {
            return 15; // +15 min penalty
        }
        return 0;
    }

    static getBioBreakNudge(location: string, isBabyCare: boolean): string {
        return `Logistical Opportunity: We have a window before our next adventure. Now is the best time for a bio-break. The ${isBabyCare ? 'Baby Care Center' : 'nearest restrooms'} are just behind the ${location}—they are usually the cleanest in this sector.`;
    }

    static getStrollerAdvice(rideName: string, exitDiffers: boolean): string {
        return `Stroller Strategy: For ${rideName}, the parking is nearby. ${exitDiffers ? 'Note: The exit is in a different location (near the hitching posts), so we will retrieve the stroller there.' : 'Entrance and Exit are same-point.'}`;
    }

    static filterMagicKeyRides(
        itinerary: any[], // Simplified for now
        completedRecentlyIds: string[]
    ): any[] {
        return itinerary.filter(step => !completedRecentlyIds.includes(step.id));
    }

    static getSnackClusterSuggestion(locationId: string, snackHabit?: string): string {
        const clusters: Record<string, string[]> = {
            'Fantasyland': ['Churros (Castle Hub)', 'Dole Whip (Tropical Hideaway)', 'Pretzels (Small World)'],
            'Galaxy\'s Edge': ['Cold Brew (Docking Bay 7)', 'Ronto Wrap', 'Blue Milk'],
            'Main Street': ['Popcorn', 'Candy Palace', 'Jolly Holiday']
        };
        const options = clusters[locationId] || ['Popcorn Cart', 'Ice Cream Bar'];
        const matched = options.find(opt => snackHabit && opt.toLowerCase().includes(snackHabit.toLowerCase())) || options[0];

        return `Hanger Alert! Based on your ${snackHabit || 'snack'} habit, head to ${matched} for a quick refuel.`;
    }

    static getDynamicPackingAdvice(temp: number, rainChance: number): string {
        if (temp > 80) return "Refined Advice: High-heat day (>80°F). Pack cooling towels and electrolyte packets. I've marked Quiet AC Spots on your map.";
        if (rainChance > 0.4) return "Refined Advice: Rain forecast (>40%). Bring ponchos and Ziploc bags for phones. I'll pivot us to indoor shows if the clouds roll in.";
        if (temp < 65) return "Refined Advice: Chilly evening expected (<65°F). Don't forget light hoodies for the walk back.";
        return "Light pack recommended for today's journey.";
    }

    static getLoungeRecommendation(parkId: string): string | null {
        const lounges: Record<string, string> = {
            'MK': 'Jungle Navigation Co. LTD Skipper Canteen',
            'EP': 'Spice Road Table (Waterfront)',
            'HS': 'BaseLine Tap House',
            'AK': 'Nomad Lounge (Concierge Favorite)',
            'DL': 'Trader Sam’s (Disneyland Hotel)',
            'DCA': 'Carthay Circle Lounge'
        };
        const recommendation = lounges[parkId];
        return recommendation ? `Adventure Complete? Debrief at ${recommendation} for a sophisticated conclusion to the day.` : null;
    }

    static getPivotReason(stepType: string, goal: 'efficiency' | 'comfort'): string {
        if (goal === 'efficiency') return "Optimal Pathing Path";
        return "Seamless Experience Strategy";
    }

    /**
     * Predictive logic for character shift changes.
     */
    static getCharacterShiftWarning(characterName: string, currentTime: Date): string | null {
        const minutes = currentTime.getMinutes();
        // Mock logic: Shifts typically end at :20 and :50
        if ((minutes >= 10 && minutes < 20) || (minutes >= 40 && minutes < 50)) {
            const countdown = minutes < 20 ? 20 - minutes : 50 - minutes;
            return `Refined Note: ${characterName} is scheduled for a brief break in ~${countdown} minutes. We suggest joining the queue now to secure your moment.`;
        }
        return null;
    }

    /**
     * Identifies bulky merchandise tasks and suggests deferral to minimize 'Sherpa Fatigue'.
     */
    static applySherpaLogic(itemName: string, currentTime: Date): string | null {
        const bulkyKeywords = ['Lightsaber', 'Droid', 'Lego', 'Artwork', 'Sword'];
        const isBulky = bulkyKeywords.some(key => itemName.toLowerCase().includes(key.toLowerCase()));

        const hour = currentTime.getHours();
        if (isBulky && hour < 17) { // If before 5 PM
            return `Sherpa Strategy: ${itemName} is a substantial carry. We suggest deferring this purchase until after 5:00 PM to maintain your mobility throughout the day.`;
        }
        return null;
    }

    /**
     * Generates a payload for the Horizon Live Activity (Dynamic Island / Lock Screen).
     */
    static generateLiveActivityState(
        nextStep: string,
        waitMin: number,
        isPivot: boolean,
        specialIntel?: string | null
    ): any {
        return {
            headline: nextStep,
            subheadline: specialIntel || (isPivot ? "Plaid Recovery in Progress" : "On Schedule"),
            waitMinutes: waitMin,
            status: isPivot ? 'delay' : (specialIntel ? 'magic-discovery' : 'on-time'),
            progress: 0.5, // Mock progress
            actionLabel: specialIntel ? "View Intel" : undefined
        };
    }
}
