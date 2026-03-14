import { NudgePayload } from '../types';
import { HapticFeedback } from './HapticFeedback';

export interface DiningSearch {
    restaurantId: string;
    restaurantName: string;
    partySize: number;
    preferredTime: string; // e.g., "12:00 PM - 1:30 PM"
    status: 'Searching' | 'Found' | 'Booked' | 'Expired' | 'Review';
    holdTime?: number;
    searchId?: string;        // Server-side search ID
    deepLink?: string;        // MDE confirmation deep link
}

import { Config } from '../config/Config';
const API_BASE = Config.API_BASE_URL;

/**
 * DiningMonitorEngine — Client-side coordinator for dining searches.
 * 
 * Now delegates actual monitoring to the server-side DiningSniper via API.
 * Client manages local state for UI rendering while the server handles
 * the polling, availability detection, and push notification dispatch.
 */
class DiningMonitorEngine {
    private activeSearches: Map<string, DiningSearch> = new Map();

    /**
     * Start monitoring for a dining reservation.
     * Sends the request to the server-side DiningSniper.
     */
    async startMonitoring(search: DiningSearch, tripId: string, parkId: string): Promise<string | null> {
        this.activeSearches.set(search.restaurantId, { ...search, status: 'Searching' });
        console.log(`[DiningMonitor] Started search for ${search.restaurantName}`);

        try {
            const [startTime, endTime] = search.preferredTime.split(' - ').map(t => t.trim());
            const response = await fetch(`${API_BASE}/dining/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tripId,
                    userId: 'current-user',  // TODO: Pull from auth context
                    restaurantId: search.restaurantId,
                    restaurantName: search.restaurantName,
                    parkId,
                    partySize: search.partySize,
                    preferredDate: new Date().toISOString().split('T')[0],
                    preferredTimeStart: startTime,
                    preferredTimeEnd: endTime || startTime,
                })
            });

            const data = await response.json();
            const updatedSearch = this.activeSearches.get(search.restaurantId);
            if (updatedSearch) {
                updatedSearch.searchId = data.searchId;
                this.activeSearches.set(search.restaurantId, updatedSearch);
            }
            return data.searchId;
        } catch (error) {
            console.error(`[DiningMonitor] Failed to start server search:`, error);
            return null;
        }
    }

    /**
     * Processes a DINING_HANDOFF nudge received via FCM push notification.
     * Updates local state and triggers haptic feedback.
     */
    handleDiningNudge(nudge: NudgePayload): void {
        // Find the active search matching this nudge
        for (const [id, search] of this.activeSearches.entries()) {
            if (search.status === 'Searching') {
                search.status = 'Found';
                search.deepLink = nudge.actionLink;
                this.activeSearches.set(id, search);
                console.log(`[DiningMonitor] FOUND: ${search.restaurantName} has an opening!`);
                HapticFeedback.trigger(nudge.hapticPattern);
                break;
            }
        }
    }

    getSearches(): DiningSearch[] {
        return Array.from(this.activeSearches.values());
    }

    async cancelSearch(restaurantId: string): Promise<void> {
        const search = this.activeSearches.get(restaurantId);
        if (search?.searchId) {
            try {
                await fetch(`${API_BASE}/dining/search/${search.searchId}`, { method: 'DELETE' });
            } catch (error) {
                console.error(`[DiningMonitor] Failed to cancel server search:`, error);
            }
        }
        this.activeSearches.delete(restaurantId);
    }

    isSearching(restaurantId: string): boolean {
        return this.activeSearches.get(restaurantId)?.status === 'Searching';
    }

    isFound(restaurantId: string): boolean {
        return this.activeSearches.get(restaurantId)?.status === 'Found';
    }

    holdReservation(restaurantId: string): void {
        const search = this.activeSearches.get(restaurantId);
        if (search && search.status === 'Found') {
            search.status = 'Review';
            search.holdTime = Date.now();
            this.activeSearches.set(restaurantId, search);
            console.log(`[DiningMonitor] REVIEW MODE: Holding ${search.restaurantName} for 5 minutes.`);

            // Auto-expire hold after 5 minutes
            setTimeout(() => {
                const s = this.activeSearches.get(restaurantId);
                if (s && s.status === 'Review') {
                    s.status = 'Expired';
                    this.activeSearches.set(restaurantId, s);
                    console.log(`[DiningMonitor] EXPIRED: Hold for ${s.restaurantName} timed out.`);
                }
            }, 300000); // 5 minutes
        }
    }
}

export const diningMonitorEngine = new DiningMonitorEngine();
