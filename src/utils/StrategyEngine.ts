import { StrategyProfile, SubscriptionTier } from '../types';

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
     * Optional: Generate a natural language context string for the Reasoning Engine (RAG)
     * based on the modular strategy profile.
     */
    static generatePromptContext(profile: StrategyProfile): string {
        let prompt = `Strict Touring Profile:\n`;
        prompt += `- Pacing is strictly ${profile.pacingFilter}. `;
        prompt += `- The primary focus of the group is ${profile.primaryFocus}.\n`;
        prompt += `- Dining is restricted to ${profile.diningStyle}. Do not suggest dining outside of this tier.\n`;
        prompt += `- Splurge Appetite: ${profile.splurgeAppetite?.toUpperCase() || 'LOW'}. \n`;

        // 3-Tier Matrix Awareness
        if ((profile as any).subscriptionTier === 'explorer') {
            prompt += `- RESTRICTION: User is on the FREE Explorer Tier. DO NOT suggest dynamic real-time re-routing, auto-booking, or active in-park pivots.\n`;
        } else if ((profile as any).subscriptionTier === 'plaid_guardian') {
            prompt += `- AUTHORIZATION: User is a PLAID GUARDIAN. Enable FLASH EXECUTION mode phrasing. Proactively suggest real-time bot automation, Sniffer dining capabilities, and active in-park pivots based on live telemetry.\n`;
        }

        if (profile.premiumInterests && profile.premiumInterests.length > 0) {
            prompt += `Prioritize these premium experiences: ${profile.premiumInterests.join(', ')}.\n`;
        }

        if (profile.singleRiderAllowed) {
            prompt += `- Single Rider is authorized. Prioritize Test Track, Everest, and Smugglers Run where Wait Time > 45 mins.\n`;
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

        if (profile.budgetDirectives.allowReservedSeatingPackages) {
            prompt += `- HIGH SPLURGE DETECTED: Actively recommend Dessert Parties and Dining Packages with reserved show seating.\n`;
        }

        return prompt;
    }
}
