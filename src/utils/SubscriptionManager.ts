import { SubscriptionTier } from '../types';

export type FeatureFlag =
    | 'canUseMultiDay'
    | 'canUseDeepRAG'
    | 'canUseAlerts'
    | 'canUseSniffer'
    | 'canUseAutoBooking'
    | 'canUseLivePivots';

export class SubscriptionManager {
    static hasFeatureAccess(tier: SubscriptionTier | undefined, feature: FeatureFlag): boolean {
        const safeTier = tier || 'explorer';

        switch (safeTier) {
            case 'plaid_guardian':
                // The Plaid Guardian gets everything
                return true;

            case 'strategic_parent':
                // Strategic Parent gates
                return [
                    'canUseMultiDay',
                    'canUseDeepRAG',
                    'canUseAlerts'
                ].includes(feature);

            case 'explorer':
            default:
                // Free tier gets none of the premium gating flags
                return false;
        }
    }
}
