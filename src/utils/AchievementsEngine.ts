export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export class AchievementsEngine {
    static getAchievements(seekPoints: number, ridesCompleted: number, feedbackCount: number): Achievement[] {
        const achievements: Achievement[] = [];

        if (seekPoints >= 100) {
            achievements.push({
                id: 'mickey_scout',
                title: 'Mickey Scout',
                description: 'Unearthed elite hidden secrets across the park.',
                icon: 'Award'
            });
        }

        if (ridesCompleted >= 5) {
            achievements.push({
                id: 'boutique_pro',
                title: 'Boutique Pro',
                description: 'Executed five or more high-priority chapters seamlessly.',
                icon: 'Zap'
            });
        }

        if (feedbackCount >= 3) {
            achievements.push({
                id: 'lead_critic',
                title: 'Lead Critic',
                description: 'Refined the expedition logic with three or more debriefs.',
                icon: 'Star'
            });
        }

        return achievements;
    }
}
