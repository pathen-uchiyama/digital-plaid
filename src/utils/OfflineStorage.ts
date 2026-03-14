import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const CACHE_KEY_ITINERARY = 'digital_plaid_itinerary';
const CACHE_KEY_PENDING_SYNC = 'digital_plaid_pending_sync';

export class OfflineStorage {
    static async cacheItinerary(data: any) {
        await AsyncStorage.setItem(CACHE_KEY_ITINERARY, JSON.stringify(data));
    }

    static async getCachedItinerary() {
        const data = await AsyncStorage.getItem(CACHE_KEY_ITINERARY);
        return data ? JSON.parse(data) : null;
    }

    static async queueForSync(table: string, payload: any) {
        const pending = await this.getPendingSync();
        pending.push({ table, payload, timestamp: Date.now() });
        await AsyncStorage.setItem(CACHE_KEY_PENDING_SYNC, JSON.stringify(pending));
    }

    static async getPendingSync() {
        const data = await AsyncStorage.getItem(CACHE_KEY_PENDING_SYNC);
        return data ? JSON.parse(data) : [];
    }

    static async syncOfflineData() {
        // Simulated network check
        const isOnline = Math.random() > 0.1; // 90% chance of being "online" even in parks
        if (!isOnline) {
            console.log('Castle Companion: Signal too weak for sync. Persevering in offline mode.');
            return;
        }

        const pending = await this.getPendingSync();
        if (pending.length === 0) return;

        for (const item of pending) {
            const { error } = await supabase
                .from(item.table)
                .insert([item.payload]);

            if (!error) {
                // Remove from pending if successful
                const currentPending = await this.getPendingSync();
                const updatedPending = currentPending.filter((i: any) => i.timestamp !== item.timestamp);
                await AsyncStorage.setItem(CACHE_KEY_PENDING_SYNC, JSON.stringify(updatedPending));
            }
        }
    }
}
