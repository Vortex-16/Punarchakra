const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
    token?: string;
}

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
        console.log(`Fetching: ${url} with token: ${options.token ? 'Yes' : 'No'}`);
        const response = await fetch(url, {
            ...options,
            method: 'GET',
            headers,
        });

        if (!response.ok && response.status !== 304) {
            const errorBody = await response.json().catch(() => ({}));
            console.error(`API Error [${response.status}] ${url}:`, errorBody);
            throw new Error(errorBody.message || `API Error: ${response.status} ${response.statusText}`);
        }

        // Handle 304 or empty success responses
        if (response.status === 204 || response.status === 304) {
            return null;
        }

        return response.json();
    },

    post: async (endpoint: string, body: any, options: RequestOptions = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        } as HeadersInit;

        if (options.token) {
            (headers as any)['Authorization'] = `Bearer ${options.token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
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
    },
};

export const redeemReward = async (token: string, pointsCost: number, rewardTitle: string) => {
    return api.post('/auth/redeem', { pointsCost, rewardTitle }, { token });
};

export const depositWasteItem = async (token: string, itemType: string, points: number, sustainabilityScore: number) => {
    return api.post('/bins/deposit', { itemType, points, sustainabilityScore }, { token });
};

export default api;
