import { useState, useEffect } from 'react';
import { ParkStatusClient } from '../utils/ParkStatusClient';
import { AttractionStatus } from '../types';

export function useParkStatus(parkId: string, pollIntervalMs: number = 60000) {
    const [statuses, setStatuses] = useState<AttractionStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [lastSuccessfulSync, setLastSuccessfulSync] = useState<number>(Date.now());
    const [isBackendOffline, setIsBackendOffline] = useState(false);

    const fetchStatus = async () => {
        try {
            const data = await ParkStatusClient.getParkStatus(parkId);
            setStatuses(data);
            setError(null);
            setLastSuccessfulSync(Date.now());
            setIsBackendOffline(false);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
            setIsBackendOffline(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, pollIntervalMs);
        return () => clearInterval(interval);
    }, [parkId, pollIntervalMs]);

    return { statuses, isLoading, error, lastSuccessfulSync, isBackendOffline, refetch: fetchStatus };
}
