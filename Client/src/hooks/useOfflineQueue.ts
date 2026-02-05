"use client";

import { useState, useEffect } from 'react';
import { offlineQueue } from '@/lib/offline-queue';

export function useOfflineQueue() {
  const [queueLength, setQueueLength] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const updateQueueLength = async () => {
      const length = await offlineQueue.getQueueLength();
      setQueueLength(length);
    };

    // Initial check
    updateQueueLength();

    // Update when online/offline status changes
    const handleOnline = async () => {
      setIsSyncing(true);
      await offlineQueue.processQueue();
      await updateQueueLength();
      setIsSyncing(false);
    };

    const handleOffline = () => {
      updateQueueLength();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic check
    const interval = setInterval(updateQueueLength, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const manualSync = async () => {
    setIsSyncing(true);
    await offlineQueue.processQueue();
    const length = await offlineQueue.getQueueLength();
    setQueueLength(length);
    setIsSyncing(false);
  };

  return {
    queueLength,
    isSyncing,
    manualSync,
  };
}
