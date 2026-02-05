"use client";

import { useState, useEffect } from 'react';
import { binsApi, Bin, BinStats } from '@/lib/bins-api';

export function useBins(filters?: { status?: string; type?: string }) {
    const [bins, setBins] = useState<Bin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBins = async () => {
            try {
                setLoading(true);
                const data = await binsApi.getAll(filters);
                setBins(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch bins');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBins();
    }, [filters?.status, filters?.type]);

    return { bins, loading, error, refetch: () => { } };
}

export function useBinStats() {
    const [stats, setStats] = useState<BinStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await binsApi.getStats();
                setStats(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch bin stats');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const refetch = async () => {
        try {
            const data = await binsApi.getStats();
            setStats(data);
        } catch (err) {
            console.error(err);
        }
    };

    return { stats, loading, error, refetch };
}
