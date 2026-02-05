import api from './api';

export interface BinPrediction {
    binId: string;
    currentFillLevel: number;
    predictedFullDate: Date | null;
    fillRate: number | null; // percentage per day
    daysUntilFull: number | null;
    hoursUntilFull: number | null;
    confidence: 'high' | 'medium' | 'low' | 'insufficient_data' | 'stable';
    rSquared?: number;
    dataPoints?: number;
    message?: string;
}

export interface CollectionSchedule {
    urgent: BinPrediction[]; // < 48 hours
    soon: BinPrediction[]; // 48h - 7 days
    stable: BinPrediction[]; // > 7 days
    totalBins: number;
}

export const predictionsApi = {
    // Get all bin predictions
    getAll: async (): Promise<BinPrediction[]> => {
        return api.get('/bins/predictions');
    },

    // Get prediction for specific bin
    getById: async (binId: string): Promise<BinPrediction> => {
        return api.get(`/bins/predictions/${binId}`);
    },

    // Get collection schedule with priority bins
    getCollectionSchedule: async (): Promise<CollectionSchedule> => {
        return api.get('/bins/collection-schedule');
    },

    // Record fill level manually (admin)
    recordFillLevel: async (binId: string, fillLevel: number, token: string): Promise<any> => {
        return api.post('/bins/record-fill', { binId, fillLevel }, { token });
    }
};
