import { StepStatus } from '../types';

export class BatteryStrategist {
    static isUltraLightMode(batteryLevel: number): boolean {
        return batteryLevel < 0.2; // 20%
    }

    static isDeadPhoneMode(batteryLevel: number): boolean {
        return batteryLevel < 0.15; // 15%
    }

    static shouldFetchData(
        lastFetchTimestamp: number,
        event: 'step_complete' | 'manual_recalibrate' | 'mobile_order_check' | 'timer',
        batteryLevel: number = 1.0
    ): boolean {
        const NOW = Date.now();
        const isUltraLight = this.isUltraLightMode(batteryLevel);
        const MIN_INTERVAL = isUltraLight ? 15 * 60 * 1000 : 5 * 60 * 1000; // 15 mins in ultra-light

        if (event === 'step_complete' || event === 'manual_recalibrate') {
            return true;
        }

        if (event === 'mobile_order_check') {
            return true;
        }

        if (event === 'timer') {
            return (NOW - lastFetchTimestamp) > MIN_INTERVAL;
        }

        return false;
    }
}
