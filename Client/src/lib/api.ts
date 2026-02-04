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

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
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

export default api;
