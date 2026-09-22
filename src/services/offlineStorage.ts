const STORAGE_PREFIX = 'ariyo_offline_';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export const offlineStorage = {
  save<T>(key: string, data: T): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry));
    } catch (e) {
      console.warn('[OfflineStorage] Cache write failed:', e);
    }
  },

  get<T>(key: string, maxAgeMs: number = 7 * 24 * 60 * 60 * 1000): T | null {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (!raw) return null;
      const entry: CacheEntry<T> = JSON.parse(raw);
      if (Date.now() - entry.timestamp > maxAgeMs) {
        return entry.data; // Still return stale data when offline rather than failing
      }
      return entry.data;
    } catch (e) {
      console.warn('[OfflineStorage] Cache read failed:', e);
      return null;
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (e) {
      console.warn('[OfflineStorage] Cache remove failed:', e);
    }
  },

  clearAll(): void {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(STORAGE_PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('[OfflineStorage] Clear failed:', e);
    }
  },
};
