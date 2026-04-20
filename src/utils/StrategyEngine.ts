import { StrategyProfile, SubscriptionTier, Ride } from '../types';

export interface ModularInputs {
    pacing: 'intense' | 'moderate' | 'relaxed';
    primaryFocus: 'thrills' | 'toddlers' | 'classic' | 'shows';
    diningStyle: 'snacks' | 'quick' | 'table' | 'signature';
    singleRiderAllowed: boolean;
    dasAllowed: boolean;
    llMultiPassAllowed: boolean;
    llSinglePassAllowed: boolean;
    onSite: boolean;
    hasStrobeSensitivity: boolean;
    hasLoudNoiseSensitivity: boolean;
    arrivalIntent?: 'rope-drop' | 'leisurely' | 'evening-only';
    splurgeAppetite: 'low' | 'moderate' | 'high';
    premiumInterests: string[];
    subscriptionTier: SubscriptionTier;
}

export class StrategyEngine {
    /**
     * Synthesizes the modular inputs collected from the castle-web UI into a 
     * unified, machine-readable Master Strategy Profile.
     */
    static generateMasterStrategy(inputs: ModularInputs): StrategyProfile {
        const pacingFilter = inputs.pacing;

        const budgetDirectives = {
            llMultiPassAllowed: inputs.llMultiPassAllowed,
            llSinglePassAllowed: inputs.llSinglePassAllowed,
            autoPurchasePhotoPass: inputs.splurgeAppetite === 'high',
            allowMerchandiseUpcharges: inputs.splurgeAppetite !== 'low',
            allowReservedSeatingPackages: inputs.splurgeAppetite === 'high' || inputs.premiumInterests.includes('dessert-party')
        };

        const singleRiderAllowed = inputs.singleRiderAllowed;
        const dasAllowed = inputs.dasAllowed;
        const onSiteResort = inputs.onSite;
        const diningStyle = inputs.diningStyle;

        let thrillCap: 'Low' | 'Moderate' | 'High' = 'Moderate';
        let maxWaitMins = 45;

        if (inputs.primaryFocus === 'toddlers') {
            thrillCap = 'Low';
            maxWaitMins = 25;
        } else if (inputs.primaryFocus === 'thrills') {
            thrillCap = 'High';
            maxWaitMins = 60;
        }

        const rideDirectives = {
            maxWaitToleranceMins: maxWaitMins,
            thrillCap,
            prioritizeIndoor: inputs.pacing === 'relaxed',
            strobeSensitivity: inputs.hasStrobeSensitivity,
            loudNoiseSensitivity: inputs.hasLoudNoiseSensitivity
        };

        return {
            pacingFilter,
            primaryFocus: inputs.primaryFocus,
            diningStyle,
            singleRiderAllowed,
            dasAllowed,
            onSiteResort,
            arrivalIntent: inputs.arrivalIntent,
            splurgeAppetite: inputs.splurgeAppetite,
            premiumInterests: inputs.premiumInterests,
            budgetDirectives,
            rideDirectives,
            subscriptionTier: inputs.subscriptionTier
        } as StrategyProfile;
    }

    /**
     * Generate a natural language context string for the Reasoning Engine (RAG)
     * based on the modular strategy profile.
     * 
     * @param rideData Optional array of rides with backend-enriched metadata.
     *                 When provided, generates dynamic single rider + EE/EEH context
     *                 instead of hardcoded ride names.
     */
    static generatePromptContext(profile: StrategyProfile, rideData?: Ride[]): string {
        let prompt = `Strict Touring Profile:\n`;
        prompt += `- Pacing is strictly ${profile.pacingFilter}. `;
        prompt += `- The primary focus of the group is ${profile.primaryFocus}.\n`;
        prompt += `- Dining is restricted to ${profile.diningStyle}. Do not suggest dining outside of this tier.\n`;
        prompt += `- Splurge Appetite: ${profile.splurgeAppetite?.toUpperCase() || 'LOW'}. \n`;

        // 4-Tier Matrix Awareness
        if ((profile as any).subscriptionTier === 'voyage') {
            prompt += `- RESTRICTION: User is on the FREE Voyage Tier. DO NOT suggest dynamic real-time re-routing, auto-booking, or active in-park pivots. Focus on the static schedule and the "Joy Report" value.\n`;
        } else if ((profile as any).subscriptionTier === 'intelligent_blueprint') {
            prompt += `- AUTHORIZATION: User is an INTELLIGENT BLUEPRINT subscriber. Enable FULL STRATEGIC POWER. Proactively suggest real-time bot automation, Sniffer dining capabilities, and active in-park pivots based on live telemetry.\n`;
        } else if (['pixie_dust', 'glass_slipper'].includes((profile as any).subscriptionTier)) {
            prompt += `- AUTHORIZATION: User has a Trip Pass (${(profile as any).subscriptionTier?.replace('_', ' ')}). Enable FLASH EXECUTION and Mobile Automation features for the duration of this journey.\n`;
        }

        if (profile.premiumInterests && profile.premiumInterests.length > 0) {
            prompt += `Prioritize these premium experiences: ${profile.premiumInterests.join(', ')}.\n`;
        }

        // Dynamic single rider context from backend metadata
        if (profile.singleRiderAllowed) {
            if (rideData && rideData.length > 0) {
                const srRides = rideData.filter(r => r.singleRider);
                if (srRides.length > 0) {
                    const srNames = srRides.map(r => r.name).join(', ');
                    prompt += `- Single Rider is authorized. Available Single Rider lines: ${srNames}. Prioritize these when Wait Time > 45 mins.\n`;
                } else {
                    prompt += `- Single Rider is authorized but no rides in this park have Single Rider lines.\n`;
                }
            } else {
                // Fallback: no ride data available
                prompt += `- Single Rider is authorized. Prioritize Test Track, Everest, and Smugglers Run where Wait Time > 45 mins.\n`;
            }
        }

        if (!profile.budgetDirectives.llMultiPassAllowed) {
            prompt += `- NO LIGHTNING LANE MULTI PASS AUTHORIZED. Standard standby strategies only.\n`;
        }

        if (profile.rideDirectives.loudNoiseSensitivity) {
            prompt += `- NOISY ENVIRONMENT SENSITIVITY. Favor theater shows over high-volume dark rides.\n`;
        }

        if (profile.arrivalIntent) {
            prompt += `- Arrival intent is ${profile.arrivalIntent}. Plan standby queues accordingly.\n`;
        }

        // Early Entry / EEH strategy context
        if (rideData && rideData.length > 0 && profile.onSiteResort) {
            const eeRides = rideData.filter(r => r.earlyEntryAvailable);
            if (eeRides.length > 0 && profile.arrivalIntent === 'rope-drop') {
                const eeNames = eeRides.filter(r => r.rideType === 'thrill' || r.rideType === 'family').map(r => r.name).slice(0, 5).join(', ');
                prompt += `- EARLY ENTRY STRATEGY: Guest is on-site. Target these headliners during Early Entry: ${eeNames}.\n`;
            }
            const eehRides = rideData.filter(r => r.eehAvailable);
            if (eehRides.length > 0) {
                const eehNames = eehRides.filter(r => r.rideType === 'thrill').map(r => r.name).slice(0, 4).join(', ');
                if (eehNames) {
                    prompt += `- EXTENDED EVENING HOURS: Defer these thrills to EEH when crowds thin: ${eehNames}.\n`;
                }
            }
        }

        if (profile.budgetDirectives.allowReservedSeatingPackages) {
            prompt += `- HIGH SPLURGE DETECTED: Actively recommend Dessert Parties and Dining Packages with reserved show seating.\n`;
        }

        return prompt;
    }
}
