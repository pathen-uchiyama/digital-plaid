/**
 * Global Configuration for Digital Plaid (Castle Companion)
 * 
 * This file centralizes all environment-specific variables and 
 * prevents hardcoded strings from proliferating through the codebase.
 */

const getApiBaseUrl = () => {
    // Standard Expo environment variable support
    const envUrl = process.env.EXPO_PUBLIC_CASTLE_API_URL;
    
    if (envUrl) {
        return envUrl;
    }

    // Fallback logic for development
    // In production, we expect api.digitalplaid.com
    return 'http://localhost:3000/api';
};

export const Config = {
    API_BASE_URL: getApiBaseUrl(),
    VERSION: '1.0.0',
    IS_PROD: process.env.NODE_ENV === 'production',
    
    // Feature Flags (Optional - for future use)
    FEATURES: {
        AI_STRATEGIST: true,
        LIVE_TELEMETRY: true,
    }
};
