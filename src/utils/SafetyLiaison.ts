export class SafetyLiaison {
    private static isGlobalKillSwitchActive: boolean = false;
    private static isShadowModeEnabled: boolean = false;

    static armGlobalKillSwitch(): string {
        this.isGlobalKillSwitchActive = true;
        return "CRITICAL: Global Kill-Switch activated. All autonomous booking sessions terminated.";
    }

    static disarmGlobalKillSwitch(): string {
        this.isGlobalKillSwitchActive = false;
        return "System Warning: Global Kill-Switch disarmed. Resuming normal operations.";
    }

    static toggleShadowMode(enabled: boolean): string {
        this.isShadowModeEnabled = enabled;
        return `Shadow Mode ${enabled ? 'Enabled' : 'Disabled'}. Booking logic now running in ${enabled ? 'simulation' : 'production'} mode.`;
    }

    static checkSafetyState(): { killSwitch: boolean; shadowMode: boolean } {
        return {
            killSwitch: this.isGlobalKillSwitchActive,
            shadowMode: this.isShadowModeEnabled
        };
    }

    static canExecuteAutonomousAction(): boolean {
        return !this.isGlobalKillSwitchActive;
    }
}
