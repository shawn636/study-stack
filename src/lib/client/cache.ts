// src/lib/utils/cache.ts

type CacheValue<T> = {
    value: T;
    expiration: number | null; // null if no expiration is set
};

export function setCache<T>(key: string, value: T, ttl?: number): void {
    const expiration = ttl ? Date.now() + ttl : null;
    const cacheItem: CacheValue<T> = { value, expiration };
    localStorage.setItem(key, JSON.stringify(cacheItem));
}

export function getCache<T>(key: string): T | null {
    const cachedData = localStorage.getItem(key);
    if (!cachedData) return null;

    const { value, expiration }: CacheValue<T> = JSON.parse(cachedData);

    // If the item has expired, remove it from storage and return null
    if (expiration && Date.now() > expiration) {
        localStorage.removeItem(key);
        return null;
    }

    return value;
}

export function clearCache(key: string): void {
    localStorage.removeItem(key);
}
