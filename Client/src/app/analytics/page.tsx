'use client';

import { Suspense } from 'react';
import PredictiveAnalyticsDashboard from '@/components/analytics/PredictiveAnalyticsDashboard';
import { TrendingUp, BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-purple-600 rounded-lg">
                            <BarChart3 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Predictive Analytics
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                AI-powered bin fill predictions for optimized collection scheduling
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="mb-6 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                            <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                                How Predictions Work
                            </p>
                            <p className="text-blue-700 dark:text-blue-400">
                                Our system analyzes historical fill data using linear regression to predict when bins will reach capacity. 
                                Predictions improve over time as more data is collected. Confidence levels indicate prediction reliability.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dashboard */}
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                }>
                    <PredictiveAnalyticsDashboard />
                </Suspense>
            </div>
        </div>
    );
}
