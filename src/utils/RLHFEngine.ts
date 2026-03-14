import { PivotRecord, FeedbackScore, TelemetryEvent, StrategyProfile } from '../types';

/**
 * Handles Reinforcement Learning from Human Feedback (RLHF) Loop.
 * Captures explicit UI thumbs up/down and implicit GPS/Telemetry deviations.
 */
export class RLHFEngine {
    private static pivotLogs: PivotRecord[] = [];
    private static telemetryLogs: TelemetryEvent[] = [];

    /**
     * Called when the Orchestrator or Guardian issues a "Magic Pivot"
     */
    static logPivotSuggestion(
        tripId: string,
        triggerEvent: string,
        suggestedAction: string,
        context: StrategyProfile
    ): string {
        const pivotId = `pivot_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        this.pivotLogs.push({
            id: pivotId,
            tripId,
            timestamp: new Date().toISOString(),
            triggerEvent,
            suggestedAction,
            context
        });
        console.log(`[RLHF] Logged Pivot Suggestion: ${pivotId}`);
        return pivotId;
    }

    /**
     * Called when the user clicks the "Did this save the moment? 👍 / 👎" UI toast.
     */
    static recordExplicitFeedback(pivotId: string, score: FeedbackScore) {
        const pivot = this.pivotLogs.find(p => p.id === pivotId);
        if (pivot) {
            pivot.explicitFeedbackScore = score;
            console.log(`[RLHF] Explicit Feedback Received for ${pivotId}: Score ${score}`);
        } else {
            console.warn(`[RLHF] Pivot ${pivotId} not found for explicit feedback.`);
        }
    }

    /**
     * Called by TelemetryEngine when it detects user ignoring rules or moving slower than predicted.
     */
    static recordImplicitTelemetry(event: TelemetryEvent, relatedPivotId?: string) {
        this.telemetryLogs.push(event);
        console.log(`[RLHF] Implicit Telemetry Logged: ${event.eventType} - ${event.details}`);

        if (relatedPivotId) {
            const pivot = this.pivotLogs.find(p => p.id === relatedPivotId);
            if (pivot) {
                // E.g., if they skipped the ride we suggested, we implicitly dock points
                pivot.implicitFeedbackScore = event.eventType === 'Ride_Skipped' ? -1 : undefined;
            }
        }
    }

    /**
     * Represents the CRON Job that runs nightly to analyze the day.
     * Takes +5 (Explicit) interactions to queue up for LLM Fine-Tuning.
     * Takes -1 / -5 (Implicit/Explicit Rejections) to lower RAG Vector weights.
     */
    static async executeNightlyBrainSync(): Promise<{ totalProcessed: number, fineTuneCandidates: number, vectorAdjustments: number }> {
        console.log("=== BEGIN NIGHTLY RLHF SYNC ===");

        const fineTuneCandidates = this.pivotLogs.filter(p => p.explicitFeedbackScore === 5);
        const vectorAdjustments = this.pivotLogs.filter(p =>
            p.explicitFeedbackScore === -5 || p.implicitFeedbackScore === -1
        );

        if (fineTuneCandidates.length > 0) {
            console.log(`[RLHF] Exporting ${fineTuneCandidates.length} high-quality pivots to JSONL for gpt-4o-mini fine-tuning.`);
            // TODO: In prod, this physically calls OpenAI API or writes to an S3 bucket.
        }

        if (vectorAdjustments.length > 0) {
            console.log(`[RLHF] Identifying failing strategies based on ${vectorAdjustments.length} negative signals.`);
            // TODO: In prod, this loops through Pinecone metadata and decrements a 'rating' float constraint.
        }

        console.log("=== END NIGHTLY SYNC. MEMORY CEMENTED. ===");

        return {
            totalProcessed: this.pivotLogs.length,
            fineTuneCandidates: fineTuneCandidates.length,
            vectorAdjustments: vectorAdjustments.length
        };
    }
}
