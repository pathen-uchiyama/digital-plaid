import { AttractionStatus } from '../types';

import { Config } from '../config/Config';
const API_BASE_URL = Config.API_BASE_URL;

export class ParkStatusClient {
    /**
     * Fetch all attraction statuses for a specific park.
     */
    static async getParkStatus(parkId: string): Promise<AttractionStatus[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/parks/${parkId}/status`);
            if (!response.ok) {
                throw new Error(`Failed to fetch park status: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('[ParkStatusClient] Error fetching park status:', error);
            return [];
        }
    }
}
