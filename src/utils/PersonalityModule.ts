import { ItineraryStep } from '../types';

export class PersonalityModule {
    /**
     * Converts raw logistics into a coaching tone.
     */
    static getCoachingTone(step: ItineraryStep): string {
        const waitTime = step.actual_wait || 0;

        if (waitTime > 60 && step.intensity === 'High') {
            return `${step.step_name} is backed up right now. Let's hit the PeopleMover or grab a snack while the crowd thins out. Strategy > Wait.`;
        }

        if (waitTime < 20 && step.step_type === 'ride') {
            return `Precision Target: ${step.step_name} is at a record low wait. Strike while the iron is hot!`;
        }

        if (step.step_type === 'break') {
            return "This is a strategic recovery window. Sanity is the best souvenir—lean into the rest.";
        }

        return "Flowing perfectly. Stay present, the logistics are on autopilot.";
    }

    /**
     * Returns a contextual nudge based on the current step.
     */
    static getContextualNudge(step: ItineraryStep): { type: 'Photo' | 'Sensory' | 'Hidden'; text: string } | null {
        if (step.step_name.includes('Space Mountain')) {
            return { type: 'Photo', text: "Golden Hour at the Falcon—perfect for a family shot right now!" };
        }
        if (step.id.includes('casey')) {
            return { type: 'Sensory', text: "The caramel corn scent is peaking near the Confectionery. Worth a 2-min detour?" };
        }
        if (step.step_name.includes('Pirates')) {
            return { type: 'Hidden', text: "Look closely at the chess game in the queue. It's a stalemate that's lasted decades!" };
        }
        return null;
    }

    /**
     * Generates a "Task Killing" nudge to encourage phone-free presence.
     */
    static getPresenceNudge(batteryLevel: number, minsSinceLastUpdate: number): string | null {
        if (batteryLevel < 0.2) {
            return "Save your battery for the evening fireworks. I'll handle the logistics in your pocket—go make some memories.";
        }
        if (minsSinceLastUpdate > 45) {
            return "You've been in the zone! Put the phone away—the next 30 minutes are all about the magic, not the screen.";
        }
        return null;
    }

    /**
     * Generates the evening "Magic Moment Recap" prompt.
     */
    static getRecapPrompt(guests: string[]): string {
        const primaryGuest = guests[0] || "the kids";
        return `As the sun sets over the castle, what brought the biggest smile to ${primaryGuest} today?`;
    }
}
