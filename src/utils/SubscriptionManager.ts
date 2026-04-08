import { SubscriptionTier } from '../types';

export type FeatureFlag =
    | 'canUseMultiDay'
    | 'canUseDeepRAG'
    | 'canUseAlerts'
    | 'canUseSniffer'
    | 'canUseAutoBooking'
    | 'canUseLivePivots'
    | 'canUseGrandQuest' // Find & Seek Paid
    | 'canUseEchoes'     // Audio Archival
    | 'canUseJoyReport'; // Global Free actually but tracked here

export class SubscriptionManager {
    static hasFeatureAccess(tier: SubscriptionTier | undefined, feature: FeatureFlag): boolean {
        const safeTier = tier || 'voyage';

        switch (safeTier) {
            case 'intelligent_blueprint':
                // The Intelligent Blueprint gets everything except maybe some add-on specific bots
                return true;

            case 'glass_slipper':
            case 'pixie_dust':
                // These are Trip-Based passes, mostly focused on automation
                return [
                    'canUseAlerts',
                    'canUseSniffer',
                    'canUseAutoBooking',
                    'canUseLivePivots'
                ].includes(feature);

            case 'voyage':
            default:
                // Voyage (Free) only gets the Joy Report and Basic Scavenger Hunt (not a premium flag)
                return feature === 'canUseJoyReport';
        }
    }
}
