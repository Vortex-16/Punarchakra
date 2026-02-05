'use client';

import { useEffect, useState } from 'react';
import { predictionsApi, type BinPrediction } from '@/lib/predictions-api';
import { binsApi, type Bin } from '@/lib/bins-api';
import { Clock, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BinPredictionCardProps {
    prediction: BinPrediction;
    bin?: Bin;
}

export default function BinPredictionCard({ prediction, bin }: BinPredictionCardProps) {
    const [binDetails, setBinDetails] = useState<Bin | undefined>(bin);

    useEffect(() => {
        if (!bin && prediction.binId) {
            binsApi.getById(prediction.binId).then(setBinDetails).catch(console.error);
        }
    }, [bin, prediction.binId]);

    const getConfidenceColor = () => {
        switch (prediction.confidence) {
            case 'high': return 'text-green-600 dark:text-green-400';
            case 'medium': return 'text-yellow-600 dark:text-yellow-400';
            case 'low': return 'text-orange-600 dark:text-orange-400';
            case 'insufficient_data': return 'text-gray-600 dark:text-gray-400';
            case 'stable': return 'text-blue-600 dark:text-blue-400';
            default: return 'text-gray-600 dark:text-gray-400';
        }
    };

    const getUrgencyColor = () => {
        if (!prediction.hoursUntilFull) return 'bg-gray-100 dark:bg-gray-800';
        if (prediction.hoursUntilFull < 24) return 'bg-red-100 dark:bg-red-900/30';
        if (prediction.hoursUntilFull < 48) return 'bg-orange-100 dark:bg-orange-900/30';
        if (prediction.hoursUntilFull < 168) return 'bg-yellow-100 dark:bg-yellow-900/30';
        return 'bg-green-100 dark:bg-green-900/30';
    };

    const formatTimeUntilFull = () => {
        if (!prediction.hoursUntilFull || !prediction.daysUntilFull) {
            return prediction.message || 'No prediction available';
        }
        
        if (prediction.daysUntilFull < 1) {
            return `${Math.round(prediction.hoursUntilFull)} hours`;
        } else if (prediction.daysUntilFull < 7) {
            return `${Math.round(prediction.daysUntilFull * 10) / 10} days`;
        } else {
            return `${Math.round(prediction.daysUntilFull)} days`;
        }
    };

    const formatDate = (date: Date | null) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`rounded-lg border p-4 ${getUrgencyColor()} transition-all hover:shadow-md`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-semibold text-lg">
                        {binDetails?.location.address || `Bin ${prediction.binId.slice(-6)}`}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {binDetails?.type.join(', ') || 'Loading...'}
                    </p>
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded ${getConfidenceColor()}`}>
                    {prediction.confidence.toUpperCase()}
                </div>
            </div>

            {/* Fill Level Progress Bar */}
            <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Current Fill</span>
                    <span className="text-sm font-semibold">{prediction.currentFillLevel}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${prediction.currentFillLevel}%` }}
                    />
                </div>
            </div>

            {/* Prediction Stats */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Time Until Full</p>
                        <p className="text-sm font-semibold">{formatTimeUntilFull()}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Fill Rate</p>
                        <p className="text-sm font-semibold">
                            {prediction.fillRate ? `${prediction.fillRate.toFixed(1)}%/day` : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Predicted Full Date */}
            {prediction.predictedFullDate && (
                <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Predicted Full Date</p>
                        <p className="text-sm font-semibold">{formatDate(prediction.predictedFullDate)}</p>
                    </div>
                </div>
            )}

            {/* Data Quality Indicator */}
            {prediction.dataPoints && (
                <div className="mt-2 text-xs text-gray-500">
                    Based on {prediction.dataPoints} data points
                    {prediction.rSquared && ` (R² = ${prediction.rSquared})`}
                </div>
            )}
        </div>
    );
}
