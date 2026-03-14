import { BookingRequest } from '../types';

export interface ShadowTestResult {
    requestId: string;
    productionSuccess: boolean;
    shadowSuccess: boolean;
    productionWaitTime: number;
    shadowWaitTime: number;
    drift: number; // difference in efficiency
}

export class ShadowTestingEngine {
    private static testLog: ShadowTestResult[] = [];

    /**
     * Runs a "Shadow Hunt" in parallel with a production booking request.
     * In a real system, this would actually attempt a booking in a sandbox
     * or simulate the outcome based on real-time availability.
     */
    static runShadowHunt(request: BookingRequest, productionOutcome: { success: boolean, waitTime: number }) {
        // Mocking a different algorithm outcome
        const shadowSuccess = Math.random() > 0.1;
        const shadowWaitTime = productionOutcome.waitTime - (Math.floor(Math.random() * 10) - 5);

        const result: ShadowTestResult = {
            requestId: request.id,
            productionSuccess: productionOutcome.success,
            shadowSuccess,
            productionWaitTime: productionOutcome.waitTime,
            shadowWaitTime,
            drift: productionOutcome.waitTime - shadowWaitTime
        };

        this.testLog.push(result);
        if (this.testLog.length > 50) this.testLog.shift();
    }

    static getComparisonMetrics() {
        if (this.testLog.length === 0) return { avgDrift: 0, winRate: 0 };

        const totalDrift = this.testLog.reduce((acc, curr) => acc + curr.drift, 0);
        const wins = this.testLog.filter(t => t.shadowWaitTime < t.productionWaitTime).length;

        return {
            avgDrift: totalDrift / this.testLog.length,
            winRate: (wins / this.testLog.length) * 100
        };
    }

    static getRecentTests(): ShadowTestResult[] {
        return this.testLog;
    }
}
