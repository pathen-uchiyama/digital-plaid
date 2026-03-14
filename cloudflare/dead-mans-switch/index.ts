/**
 * Castle Companion - Dead Man's Switch
 * 
 * This worker runs on a cron schedule to verify that the core production
 * backend is reachable and healthy. If the backend fails to respond,
 * it triggers a critical system alert via the backup notification channel.
 */

export interface Env {
    BACKEND_HEALTH_URL: string;
    ALERT_WEBHOOK_URL: string;
}

export default {
    async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
        console.log(`[Monitor] Starting health check for: ${env.BACKEND_HEALTH_URL}`);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(env.BACKEND_HEALTH_URL, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                console.log("[Monitor] Backend is NOMINAL.");
            } else {
                console.error(`[Monitor] Backend returned UNHEALTHY status: ${response.status}`);
                await this.triggerAlert(env);
            }
        } catch (error) {
            console.error("[Monitor] Backend is UNREACHABLE:", error);
            await this.triggerAlert(env);
        }
    },

    async triggerAlert(env: Env) {
        if (!env.ALERT_WEBHOOK_URL) {
            console.warn("[Monitor] Alert triggered but no ALERT_WEBHOOK_URL is configured.");
            return;
        }

        console.log("[Monitor] Dispatching CRITICAL alert...");
        
        await fetch(env.ALERT_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: `🚨 CRITICAL: Castle Production Backend is DOWN or Unreachable! (IP: 18.215.69.206)`,
                severity: 'high'
            })
        });
    }
};
