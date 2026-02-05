'use client';

import { useEffect, useState } from 'react';
import { predictionsApi, type BinPrediction, type CollectionSchedule } from '@/lib/predictions-api';
import { binsApi, type Bin } from '@/lib/bins-api';
import BinPredictionCard from './BinPredictionCard';
import { AlertTriangle, TrendingUp, CheckCircle, Clock, MapPin, Route } from 'lucide-react';

export default function PredictiveAnalyticsDashboard() {
    const [schedule, setSchedule] = useState<CollectionSchedule | null>(null);
    const [bins, setBins] = useState<Bin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [scheduleData, binsData] = await Promise.all([
                predictionsApi.getCollectionSchedule(),
                binsApi.getAll()
            ]);
            setSchedule(scheduleData);
            setBins(binsData);
            setError(null);
        } catch (err) {
            console.error('Error loading analytics:', err);
            setError('Failed to load predictive analytics data');
        } finally {
            setLoading(false);
        }
    };

    const getBinDetails = (binId: string) => {
        return bins.find(b => b._id === binId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading predictions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                    <p>{error}</p>
                    <button
                        onClick={loadData}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!schedule) return null;

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        <div>
                            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                                {schedule.urgent.length}
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-400">Urgent (&lt; 48h)</p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                        <div>
                            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                                {schedule.soon.length}
                            </p>
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">Soon (2-7 days)</p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        <div>
                            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                {schedule.stable.length}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">Stable (&gt; 7 days)</p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <div>
                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                {schedule.totalBins}
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">Total Bins</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Urgent Collection Required */}
            {schedule.urgent.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-red-300 dark:border-red-700">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        <h2 className="text-xl font-bold text-red-700 dark:text-red-300">
                            Urgent Collection Required
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {schedule.urgent.map((prediction) => (
                            <BinPredictionCard
                                key={prediction.binId}
                                prediction={prediction}
                                bin={getBinDetails(prediction.binId)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Collection Needed Soon */}
            {schedule.soon.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        <h2 className="text-xl font-bold">Collection Needed Soon (2-7 days)</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {schedule.soon.map((prediction) => (
                            <BinPredictionCard
                                key={prediction.binId}
                                prediction={prediction}
                                bin={getBinDetails(prediction.binId)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Stable Bins */}
            {schedule.stable.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <h2 className="text-xl font-bold">Stable Bins (&gt; 7 days)</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {schedule.stable.slice(0, 6).map((prediction) => (
                            <BinPredictionCard
                                key={prediction.binId}
                                prediction={prediction}
                                bin={getBinDetails(prediction.binId)}
                            />
                        ))}
                    </div>
                    {schedule.stable.length > 6 && (
                        <p className="text-center text-gray-500 mt-4">
                            And {schedule.stable.length - 6} more stable bins...
                        </p>
                    )}
                </div>
            )}

            {/* No Predictions Available */}
            {schedule.totalBins === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Predictions Available</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Predictions require historical fill data. Please ensure bins are being used and data is being collected.
                        You can also run the simulation script to generate test data.
                    </p>
                </div>
            )}

            {/* Refresh Button */}
            <div className="flex justify-center">
                <button
                    onClick={loadData}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                    <TrendingUp className="w-5 h-5" />
                    Refresh Predictions
                </button>
            </div>
        </div>
    );
}
