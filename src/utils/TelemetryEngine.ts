import { Config } from '../config/Config';
const API_BASE_URL = Config.API_BASE_URL;

export interface SystemMetric {
    apiLatency: number;
    successRate: number;
    activeUsers: number;
    activeBots: number;
    evasionSignature?: string;
    attestationStatus?: 'Verified' | 'Unverified' | 'Compromised';
    errorCount: number;
    revenue: number;
    minutesSavedTotal: number;
    timestamp: number;
    proxyDataGB: number;
    tokenBurn: number;
    captchaSuccessRate: number;
    zombieCount: number;
}

export class TelemetryEngine {
    private static metrics: SystemMetric[] = [];

    static logMetric(metric: Partial<SystemMetric>) {
        const fullMetric: SystemMetric = {
            apiLatency: metric.apiLatency || 120,
            successRate: metric.successRate || 0.98,
            activeUsers: metric.activeUsers || 0,
            activeBots: metric.activeBots || 0,
            errorCount: metric.errorCount || 0,
            revenue: metric.revenue || 0,
            minutesSavedTotal: metric.minutesSavedTotal || 0,
            proxyDataGB: metric.proxyDataGB || 0,
            tokenBurn: metric.tokenBurn || 0,
            captchaSuccessRate: metric.captchaSuccessRate || 0.95,
            zombieCount: metric.zombieCount || 0,
            timestamp: Date.now()
        };
        this.metrics.push(fullMetric);
        if (this.metrics.length > 100) this.metrics.shift();
    }

    static async syncWithBackend() {
        try {
            const response = await fetch(`${API_BASE_URL}/telemetry`);
            if (response.ok) {
                const data = await response.json();
                this.logMetric(data);
            }
        } catch (error) {
            console.error('[TelemetryEngine] Sync Failed:', error);
        }
    }

    static getLatestMetrics(): SystemMetric {
        return this.metrics[this.metrics.length - 1] || {
            apiLatency: 0,
            successRate: 0,
            activeUsers: 0,
            activeBots: 0,
            errorCount: 0,
            revenue: 0,
            minutesSavedTotal: 0,
            proxyDataGB: 0,
            tokenBurn: 0,
            captchaSuccessRate: 0,
            zombieCount: 0,
            timestamp: Date.now()
        };
    }

    static getHealthStatus(): 'Nominal' | 'Warning' | 'Critical' {
        const latest = this.getLatestMetrics();
        if (latest.errorCount > 10 || latest.successRate < 0.8 || latest.captchaSuccessRate < 0.8) return 'Critical';
        if (latest.errorCount > 2 || latest.apiLatency > 500 || latest.zombieCount > 2) return 'Warning';
        return 'Nominal';
    }

    private static auditTrail: { timestamp: number; action: string; user: string; impact: string }[] = [];

    /**
     * Audit Trail: Logs all sensitive administrative actions.
     */
    static logAuditAction(action: string, user: string, impact: string = 'Nominal') {
        this.auditTrail.push({
            timestamp: Date.now(),
            action,
            user,
            impact
        });
        console.log(`[AUDIT] ${user} performed ${action} (Impact: ${impact})`);
    }

    static getAuditTrail() {
        return this.auditTrail;
    }

    static startSync(intervalMs: number = 30000) {
        this.syncWithBackend();
        setInterval(() => this.syncWithBackend(), intervalMs);
    }
}

// Start live sync
TelemetryEngine.startSync();
