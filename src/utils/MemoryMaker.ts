import { ItineraryStep, JourneySummary, MemorySnapshot, Achievement } from '../types';

export class MemoryMaker {
    /**
     * Transforms completed itinerary steps into a journey summary.
     */
    static generateSummary(adventureName: string, completedSteps: ItineraryStep[]): JourneySummary {
        const titleSuffix = adventureName.toLowerCase().includes('journey') || adventureName.toLowerCase().includes('adventure') ? '' : ' Journey';
        const memories: MemorySnapshot[] = completedSteps.map(step => ({
            id: step.id,
            title: step.step_name,
            location: step.park_id,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: step.step_type,
            highlight: this.getHighlightForStep(step)
        }));

        return {
            adventureName: adventureName + titleSuffix,
            totalSteps: completedSteps.length,
            memories,
            narrative: this.generateNarrative(adventureName, completedSteps),
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            minutesSaved: this.calculateMinutesSaved(completedSteps),
            achievements: this.generateAchievements(completedSteps)
        };
    }

    private static generateAchievements(steps: ItineraryStep[]): Achievement[] {
        const results: Achievement[] = [];
        if (steps.length >= 5) {
            results.push({ id: 'a1', title: 'Marathoner', description: '5+ major attractions logged.', icon: 'Zap' });
        }
        if (steps.some(s => s.logistical_shadow && s.logistical_shadow > 20)) {
            results.push({ id: 'a2', title: 'Tactical Genius', description: 'Expertly navigated complex park logistics.', icon: 'Shield' });
        }
        return results;
    }

    private static calculateMinutesSaved(steps: ItineraryStep[]): number {
        return steps.reduce((total, step) => {
            const saved = (step.planned_wait || 0) - (step.actual_wait || 0);
            return total + (saved > 0 ? saved : 0);
        }, 0);
    }

    private static getHighlightForStep(step: ItineraryStep): string | undefined {
        const highlights: Record<string, string> = {
            'MK_SPACE': 'Mission pilot status achieved.',
            'MK_PIRATES': 'Successfully navigated the Spanish Main.',
            'MK_MANSION': 'Survied the 999 happy haunts.',
            'HS_ROT': 'Resistance heroics recorded.',
            'EP_REMY': 'Mastered the kitchen scramble.'
        };
        return highlights[step.id];
    }

    private static generateNarrative(name: string, steps: ItineraryStep[]): string {
        if (steps.length === 0) return "A quiet day of exploration and magic.";
        if (steps.length < 3) return `An intimate journey through ${name}, focusing on the essential magic.`;
        return `A legendary expedition for ${name}. From the first spark of adventure to the final sunset, every moment was boutique excellence.`;
    }
}
