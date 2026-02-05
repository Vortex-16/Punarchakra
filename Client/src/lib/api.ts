import { offlineStorage } from './offline-storage';
import { offlineQueue } from './offline-queue';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
    token?: string;
    skipCache?: boolean;
    cacheTTL?: number;
}

const isOnline = () => typeof navigator !== 'undefined' ? navigator.onLine : true;

const api = {
    get: async (endpoint: string, options: RequestOptions = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        } as HeadersInit;

        if (options.token) {
            (headers as any)['Authorization'] = `Bearer ${options.token}`;
        }

        const url = `${API_URL}${endpoint}`;
        const cacheKey = `get:${endpoint}`;

        // Try cache first if offline or not explicitly skipped
        if (!options.skipCache) {
            const cached = await offlineStorage.getCache(cacheKey);
            if (cached) {
                if (!isOnline()) {
                    console.log(`[API] Returning cached data (offline):`, endpoint);
                    return { ...cached, _fromCache: true };
                }
            }
        }

        // If offline and no cache, throw error
        if (!isOnline()) {
            throw new Error('No internet connection and no cached data available');
        }

        try {
            console.log(`Fetching: ${url} with token: ${options.token ? 'Yes' : 'No'}`)
;
            const response = await fetch(url, {
                ...options,
                method: 'GET',
                headers,
            });

            if (!response.ok && response.status !== 304) {
                const errorBody = await response.json().catch(() => ({}));
                console.error(`API Error [${response.status}] ${url}:`, errorBody);
                
                // Return cached data as fallback if available
                const cached = await offlineStorage.getCache(cacheKey);
                if (cached) {
                    console.log(`[API] Returning stale cached data as fallback:`, endpoint);
                    return { ...cached, _fromCache: true, _stale: true };
                }
                
                throw new Error(errorBody.message || `API Error: ${response.status} ${response.statusText}`);
            }

            // Handle 304 or empty success responses
            if (response.status === 204 || response.status === 304) {
                return null;
            }

            const data = await response.json();
            
            // Cache the successful response
            if (!options.skipCache) {
                const ttl = options.cacheTTL || 5 * 60 * 1000; // Default 5 minutes
                await offlineStorage.setCache(cacheKey, data, ttl);
            }

            return data;
        } catch (error) {
            // Network error - return cache if available
            if (!isOnline()) {
                const cached = await offlineStorage.getCache(cacheKey);
                if (cached) {
                    console.log(`[API] Returning cached data (network error):`, endpoint);
                    return { ...cached, _fromCache: true };
                }
            }
            throw error;
        }
    },

    post: async (endpoint: string, body: any, options: RequestOptions = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        } as HeadersInit;

        if (options.token) {
            (headers as any)['Authorization'] = `Bearer ${options.token}`;
        }

        const url = `${API_URL}${endpoint}`;

        // If offline, queue the request
        if (!isOnline()) {
            await offlineQueue.addToQueue({
                url,
                method: 'POST',
                headers,
                body,
            });
            console.log('[API] Request queued (offline):', endpoint);
            return { _queued: true, message: 'Request queued for sync when online' };
        }

        try {
            const response = await fetch(url, {
                ...options,
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `API Error: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            // If network error, queue the request
            if (!isOnline()) {
                await offlineQueue.addToQueue({
                    url,
                    method: 'POST',
                    headers,
                    body,
                });
                console.log('[API] Request queued (network error):', endpoint);
                return { _queued: true, message: 'Request queued for sync when online' };
            }
            throw error;
        }
    },
};

export const redeemReward = async (token: string, pointsCost: number, rewardTitle: string) => {
    return api.post('/auth/redeem', { pointsCost, rewardTitle }, { token });
};

export const depositWasteItem = async (token: string, itemType: string, points: number, sustainabilityScore: number) => {
    return api.post('/bins/deposit', { itemType, points, sustainabilityScore }, { token });
};

export default api;
