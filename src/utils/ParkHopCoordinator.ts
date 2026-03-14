/**
 * Park Hop Coordinator
 * 
 * Strategic engine for managing multi-park transitions. 
 * Evaluates park capacity, crowd trends, and LL availability to suggest the optimal "Hop".
 */

export interface ParkHopRecommendation {
    targetParkId: string;
    targetParkName: string;
    reason: string;
    crowdLevel: 'Low' | 'Moderate' | 'High';
    topAvailableLL: string;
    travelTimeMins: number;
}

export class ParkHopCoordinator {
    private static PARK_NAMES: Record<string, string> = {
        'MK': 'Magic Kingdom',
        'EP': 'EPCOT',
        'HS': 'Hollywood Studios',
        'AK': 'Animal Kingdom'
    };

    /**
     * Determines if the guest is eligible to hop (usually after 2:00 PM or all day for certain pass types).
     */
    static isEligibleToHop(membershipType: string, currentTime: Date): boolean {
        if (membershipType === 'AP' || membershipType === 'DVC') return true; // Example: Premium tiers often have fewer restrictions
        return currentTime.getHours() >= 14; // Standard 2 PM rule
    }

    /**
     * Scans all parks to find the "Path of Least Resistance".
     */
    static async getHopRecommendation(currentParkId: string): Promise<ParkHopRecommendation | null> {
        console.log(`[Park Hop] Analyzing alternatives to ${currentParkId}...`);

        // Mocked real-time evaluation logic
        const recommendations: ParkHopRecommendation[] = [
            {
                targetParkId: 'EP',
                targetParkName: 'EPCOT',
                reason: 'Wait times are 30% lower than trend. Guardians of the Galaxy LLs are replenishing.',
                crowdLevel: 'Low',
                topAvailableLL: 'Guardians of the Galaxy',
                travelTimeMins: 15
            },
            {
                targetParkId: 'HS',
                targetParkName: 'Hollywood Studios',
                reason: 'Slinky Dog Dash has a rare 40min standby drop.',
                crowdLevel: 'Moderate',
                topAvailableLL: 'Tower of Terror',
                travelTimeMins: 20
            }
        ];

        // Filter out current park and return the best one
        return recommendations.find(r => r.targetParkId !== currentParkId) || null;
    }
}
