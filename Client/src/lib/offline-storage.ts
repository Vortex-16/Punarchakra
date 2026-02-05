"use client";

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineDB extends DBSchema {
  bins: {
    key: string;
    value: any;
    indexes: { 'by-status': string };
  };
  history: {
    key: string;
    value: any;
  };
  user: {
    key: string;
    value: any;
  };
  queuedRequests: {
    key: number;
    value: {
      id: number;
      url: string;
      method: string;
      body?: any;
      headers?: any;
      timestamp: number;
    };
    indexes: { 'by-timestamp': number };
  };
  cache: {
    key: string;
    value: {
      data: any;
      timestamp: number;
      expiresAt: number;
    };
  };
}

class OfflineStorage {
  private dbPromise: Promise<IDBPDatabase<OfflineDB>> | null = null;

  private async getDB() {
    if (!this.dbPromise) {
      this.dbPromise = openDB<OfflineDB>('punarchakra-offline', 1, {
        upgrade(db) {
          // Bins store
          if (!db.objectStoreNames.contains('bins')) {
            const binStore = db.createObjectStore('bins', { keyPath: '_id' });
            binStore.createIndex('by-status', 'status');
          }

          // History store
          if (!db.objectStoreNames.contains('history')) {
            db.createObjectStore('history', { keyPath: '_id' });
          }

          // User store
          if (!db.objectStoreNames.contains('user')) {
            db.createObjectStore('user', { keyPath: '_id' });
          }

          // Queued requests store
          if (!db.objectStoreNames.contains('queuedRequests')) {
            const queueStore = db.createObjectStore('queuedRequests', { 
              keyPath: 'id', 
              autoIncrement: true 
            });
            queueStore.createIndex('by-timestamp', 'timestamp');
          }

          // Generic cache store
          if (!db.objectStoreNames.contains('cache')) {
            db.createObjectStore('cache');
          }
        },
      });
    }
    return this.dbPromise;
  }

  // Generic cache operations
  async setCache(key: string, data: any, ttlMs: number = 5 * 60 * 1000) {
    const db = await this.getDB();
    await db.put('cache', {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttlMs,
    }, key);
  }

  async getCache(key: string): Promise<any | null> {
    const db = await this.getDB();
    const cached = await db.get('cache', key);
    
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      await db.delete('cache', key);
      return null;
    }
    
    return cached.data;
  }

  async deleteCache(key: string) {
    const db = await this.getDB();
    await db.delete('cache', key);
  }

  async clearExpiredCache() {
    const db = await this.getDB();
    const allKeys = await db.getAllKeys('cache');
    const now = Date.now();
    
    for (const key of allKeys) {
      const cached = await db.get('cache', key);
      if (cached && now > cached.expiresAt) {
        await db.delete('cache', key);
      }
    }
  }

  // Bins operations
  async saveBins(bins: any[]) {
    const db = await this.getDB();
    const tx = db.transaction('bins', 'readwrite');
    await Promise.all(bins.map(bin => tx.store.put(bin)));
    await tx.done;
  }

  async getBins(filters?: { status?: string }): Promise<any[]> {
    const db = await this.getDB();
    
    if (filters?.status) {
      return db.getAllFromIndex('bins', 'by-status', filters.status);
    }
    
    return db.getAll('bins');
  }

  async getBin(id: string): Promise<any | null> {
    const db = await this.getDB();
    return db.get('bins', id) || null;
  }

  // Queue operations
  async queueRequest(request: {
    url: string;
    method: string;
    body?: any;
    headers?: any;
  }) {
    const db = await this.getDB();
    await db.add('queuedRequests', {
      ...request,
      timestamp: Date.now(),
    } as any);
  }

  async getQueuedRequests() {
    const db = await this.getDB();
    return db.getAllFromIndex('queuedRequests', 'by-timestamp');
  }

  async removeQueuedRequest(id: number) {
    const db = await this.getDB();
    await db.delete('queuedRequests', id);
  }

  async clearQueue() {
    const db = await this.getDB();
    await db.clear('queuedRequests');
  }

  // Clear all data
  async clearAll() {
    const db = await this.getDB();
    await Promise.all([
      db.clear('bins'),
      db.clear('history'),
      db.clear('user'),
      db.clear('queuedRequests'),
      db.clear('cache'),
    ]);
  }
}

export const offlineStorage = new OfflineStorage();
