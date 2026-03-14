import { TelemetryEngine } from './TelemetryEngine';
import { Config } from '../config/Config';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    status: 'Active' | 'Suspended' | 'Beta';
    membership: 'Free' | 'Pro' | 'Annual';
    lastActive: string;
}

export interface Transaction {
    id: string;
    userId: string;
    userName: string;
    amount: number;
    status: 'Successful' | 'Refunded' | 'Pending';
    timestamp: string;
}

export interface ReasoningAudit {
    id: string;
    scenario: string;
    profile: string;
    reasoning: string;
    timestamp: string;
}

export class AdminOpsManager {
    private static users: AdminUser[] = [
        { id: '1', name: 'Patchen Uchiyama', email: 'patchen@example.com', status: 'Active', membership: 'Pro', lastActive: '2h ago' },
        { id: '2', name: 'Alice Smith', email: 'alice@disney.com', status: 'Active', membership: 'Annual', lastActive: '5m ago' },
        { id: '3', name: 'Bob Chapek', email: 'bob@disney.com', status: 'Suspended', membership: 'Free', lastActive: '2d ago' },
    ];

    private static transactions: Transaction[] = [
        { id: 'TX_001', userId: '1', userName: 'Patchen Uchiyama', amount: 24.99, status: 'Successful', timestamp: '2026-03-04T08:00:00Z' },
        { id: 'TX_002', userId: '2', userName: 'Alice Smith', amount: 99.99, status: 'Successful', timestamp: '2026-03-03T15:30:00Z' },
        { id: 'TX_003', userId: '4', userName: 'Josh D', amount: 19.99, status: 'Refunded', timestamp: '2026-03-02T10:00:00Z' },
    ];

    private static reasoningAudits: ReasoningAudit[] = [
        { 
            id: 'AUD_01', 
            scenario: 'Thunder Mountain Closure', 
            profile: 'The Commando', 
            reasoning: 'Prioritized nearby high-capacity attraction (Pirates) to maintain ride count goal while bypassing typical logistical shadow overlap.',
            timestamp: new Date().toISOString() 
        }
    ];

    // System Kill Switches
    private static killSwitches = {
        vqSniper: false,
        llSniper: false,
        autoBooking: false,
        failoverMode: false
    };

    // Fleet & Cost Controls
    private static fleetConfig = {
        activeBots: 45,
        targetBotCount: 50,
        apiThreshold: 10000,    // Daily API calls
        tokenCap: 1000000,      // Monthly Token Cap
        proxyDataCapGB: 50,     // Monthly Proxy Cap (GB)
        captchaThreshold: 0.1,  // Max 10% challenge ratio
        pivotDebounceMins: 30,  // Min downtime for auto-pivot
    };

    static getFleetConfig() {
        return this.fleetConfig;
    }

    static updateFleetConfig(update: Partial<typeof AdminOpsManager.fleetConfig>) {
        this.fleetConfig = { ...this.fleetConfig, ...update };
        TelemetryEngine.logAuditAction('Update Fleet Config', 'Admin_01', JSON.stringify(update));
    }

    static getUsers(): AdminUser[] {
        return this.users;
    }

    static getTransactions(): Transaction[] {
        return this.transactions;
    }

    static processRefund(transactionId: string): boolean {
        const tx = this.transactions.find(t => t.id === transactionId);
        if (tx && tx.status !== 'Refunded') {
            tx.status = 'Refunded';
            TelemetryEngine.logAuditAction('Process Refund', 'Admin_01', `TX: ${transactionId}`);
            return true;
        }
        return false;
    }

    static toggleKillSwitch(key: keyof typeof AdminOpsManager.killSwitches): boolean {
        this.killSwitches[key] = !this.killSwitches[key];
        TelemetryEngine.logAuditAction('Toggle Kill Switch', 'Admin_01', `${key} -> ${this.killSwitches[key]}`);
        return this.killSwitches[key];
    }

    static getKillSwitches() {
        return this.killSwitches;
    }

    static getReasoningAudits(): ReasoningAudit[] {
        return this.reasoningAudits;
    }

    static async simulateReasoning(park: string, disruption: string, profile: string): Promise<string> {
        try {
            // Assume default local dev URL for now
            const API_URL = Config.API_BASE_URL;
            const response = await fetch(`${API_URL}/admin/simulate-pivot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ park, disruption, profile, tier: 'plaid_guardian' })
            });

            if (!response.ok) throw new Error('Simulation API failure');

            const data = await response.json();
            const reasoning = data.response;

            const newAudit: ReasoningAudit = {
                id: `AUD_${Date.now()}`,
                scenario: disruption,
                profile: profile,
                reasoning: reasoning,
                timestamp: new Date().toISOString()
            };

            this.reasoningAudits = [newAudit, ...this.reasoningAudits];
            return reasoning;
        } catch (error) {
            console.error('Simulation error:', error);
            return `Simulation failed: Could not connect to the Strategy Engine. Ensure backend is running at ${Config.API_BASE_URL}.`;
        }
    }

    static verifyAdminPin(pin: string): boolean {
        // High-security mock: only one pin works in this galaxy
        return pin === '195507'; // Disneyland Opening Day
    }
}
