// Système de cache simple pour les APIs admin
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttlMinutes: number = 5): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000 // Convertir en millisecondes
    };
    
    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Vérifier si le cache a expiré
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Nettoyer automatiquement les entrées expirées
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Générer une clé de cache pour les APIs
  static generateKey(endpoint: string, params: Record<string, any> = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    return `${endpoint}${sortedParams ? `?${sortedParams}` : ''}`;
  }
}

// Instance globale du cache
export const apiCache = new SimpleCache();

// Nettoyer le cache toutes les 10 minutes
if (typeof window === 'undefined') { // Seulement côté serveur
  setInterval(() => {
    apiCache.cleanup();
  }, 10 * 60 * 1000);
}

// Hook pour invalider le cache lors des mutations
export function invalidateCache(pattern: string): void {
  // Invalider toutes les clés qui correspondent au pattern
  for (const key of apiCache['cache'].keys()) {
    if (key.includes(pattern)) {
      apiCache.delete(key);
    }
  }
}

// Middleware de cache pour les APIs
export function withCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlMinutes: number = 5
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      // Vérifier le cache d'abord
      const cached = apiCache.get<T>(key);
      if (cached) {
        resolve(cached);
        return;
      }

      // Si pas en cache, exécuter la fonction
      const result = await fetchFn();
      
      // Mettre en cache le résultat
      apiCache.set(key, result, ttlMinutes);
      
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
} 