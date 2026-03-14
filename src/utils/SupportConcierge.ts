export interface SupportMessage {
    id: string;
    role: 'user' | 'bot';
    text: string;
    timestamp: number;
}

export class SupportConcierge {
    private static responses: Record<string, string> = {
        'default': "I'm the Plaid Concierge. I'm monitoring your itinerary in real-time. How can I assist with your boutique experience today?",
        'battery': "I see your battery is low. I've already activated Ultra-Light mode for you. The nearest FuelRod station is at Tomorrowland Light & Power Co.",
        'crowds': "Crowds are peaking in Fantasyland. I recommend shifting your 2:00 PM break to the Hall of Presidents area for maximum AC and quiet.",
        'pricing': "Castle Companion is currently in 'Founding Member' access. Your Trip Pass includes unlimited Strategic Hunts and Guardian Security pins."
    };

    static getGreeting(userName: string): string {
        return `Welcome back, ${userName}. Your Magic Expedition is currently 88% optimized. How can I help you maintain family peace?`;
    }

    static processMessage(input: string): string {
        const lower = input.toLowerCase();
        if (lower.includes('battery') || lower.includes('power')) return this.responses['battery'];
        if (lower.includes('crowd') || lower.includes('busy')) return this.responses['crowds'];
        if (lower.includes('cost') || lower.includes('price')) return this.responses['pricing'];
        return this.responses['default'];
    }
}
