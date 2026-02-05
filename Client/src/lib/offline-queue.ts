import { offlineStorage } from './offline-storage';

export interface QueuedRequest {
  id?: number;
  url: string;
  method: string;
  body?: any;
  headers?: any;
  timestamp: number;
}

class OfflineQueue {
  private syncInProgress = false;

  async addToQueue(request: {
    url: string;
    method: string;
    body?: any;
    headers?: any;
  }) {
    await offlineStorage.queueRequest(request);
    console.log('[OfflineQueue] Request queued:', request.method, request.url);
  }

  async processQueue(): Promise<{ success: number; failed: number }> {
    if (this.syncInProgress) {
      console.log('[OfflineQueue] Sync already in progress');
      return { success: 0, failed: 0 };
    }

    this.syncInProgress = true;
    const queuedRequests = await offlineStorage.getQueuedRequests();

    if (queuedRequests.length === 0) {
      this.syncInProgress = false;
      return { success: 0, failed: 0 };
    }

    console.log(`[OfflineQueue] Processing ${queuedRequests.length} queued requests`);
    
    let successCount = 0;
    let failedCount = 0;

    for (const request of queuedRequests) {
      try {
        const response = await fetch(request.url, {
          method: request.method,
          headers: request.headers || {},
          body: request.body ? JSON.stringify(request.body) : undefined,
        });

        if (response.ok) {
          await offlineStorage.removeQueuedRequest(request.id!);
          successCount++;
          console.log('[OfflineQueue] Request synced successfully:', request.method, request.url);
        } else {
          failedCount++;
          console.warn('[OfflineQueue] Request failed:', response.status, request.url);
        }
      } catch (error) {
        failedCount++;
        console.error('[OfflineQueue] Request error:', error, request.url);
      }
    }

    this.syncInProgress = false;
    
    if (successCount > 0) {
      console.log(`[OfflineQueue] Sync complete: ${successCount} succeeded, ${failedCount} failed`);
    }

    return { success: successCount, failed: failedCount };
  }

  async getQueueLength(): Promise<number> {
    const requests = await offlineStorage.getQueuedRequests();
    return requests.length;
  }

  async clearQueue() {
    await offlineStorage.clearQueue();
    console.log('[OfflineQueue] Queue cleared');
  }
}

export const offlineQueue = new OfflineQueue();

// Auto-sync when coming online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[OfflineQueue] Connection restored, processing queue');
    offlineQueue.processQueue();
  });
}
