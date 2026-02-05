import api from './api';

export interface BinLocation {
    address: string;
    lat: number;
    lng: number;
}

export interface Bin {
    _id: string;
    location: BinLocation;
    type: string[];
    fillLevel: number;
    status: 'active' | 'full' | 'maintenance' | 'offline';
    lastCollection?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BinStats {
    totalBins: number;
    activeBins: number;
    fullBins: number;
    maintenanceBins: number;
    avgFillLevel: number;
    criticalBins: Bin[];
    totalWasteKg: number;
    totalEstimatedValue: number;
    activeUserCount: number;
}

export const binsApi = {
    // Get all bins
    getAll: async (filters?: { status?: string; type?: string }): Promise<Bin[]> => {
        let endpoint = '/bins';
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.type) params.append('type', filters.type);
        if (params.toString()) endpoint += `?${params.toString()}`;

        return api.get(endpoint);
    },

    // Get single bin
    getById: async (id: string): Promise<Bin> => {
        return api.get(`/bins/${id}`);
    },

    // Get bin stats for dashboard
    getStats: async (): Promise<BinStats> => {
        return api.get('/bins/stats');
    },

    // Create bin (admin)
    create: async (binData: Partial<Bin>, token: string): Promise<Bin> => {
        return api.post('/bins', binData, { token });
    },

    // Update bin (admin)
    update: async (id: string, binData: Partial<Bin>, token: string): Promise<Bin> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/bins/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(binData)
        });
        return response.json();
    },

    // Delete bin (admin)
    delete: async (id: string, token: string): Promise<void> => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/bins/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    // Get waste collection analytics for chart
    getAnalytics: async (): Promise<any[]> => {
        return api.get('/bins/analytics');
    }
};
