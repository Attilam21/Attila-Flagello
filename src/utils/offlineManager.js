// Gestione cache offline per Firebase
class OfflineManager {
  constructor() {
    this.cache = new Map();
    this.isOnline = navigator.onLine;
    this.pendingOperations = [];

    // Setup event listeners
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Carica cache esistente
    this.loadCacheFromStorage();
  }

  // Gestione stato online/offline
  handleOnline() {
    this.isOnline = true;
    console.log('🌐 Connessione ripristinata, sincronizzazione dati...');
    this.syncPendingOperations();
  }

  handleOffline() {
    this.isOnline = false;
    console.log('📴 Modalità offline attivata');
  }

  // Carica cache da localStorage
  loadCacheFromStorage() {
    try {
      const cachedData = localStorage.getItem('firebase_cache');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        this.cache = new Map(Object.entries(parsed));
        console.log('📦 Cache caricata:', this.cache.size, 'elementi');
      }
    } catch (error) {
      console.error('❌ Errore caricamento cache:', error);
    }
  }

  // Salva cache in localStorage
  saveCacheToStorage() {
    try {
      const cacheObject = Object.fromEntries(this.cache);
      localStorage.setItem('firebase_cache', JSON.stringify(cacheObject));
    } catch (error) {
      console.error('❌ Errore salvataggio cache:', error);
    }
  }

  // Aggiungi dati alla cache
  setCache(key, data, ttl = 300000) {
    // 5 minuti default
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    this.cache.set(key, cacheItem);
    this.saveCacheToStorage();

    console.log(`💾 Dati salvati in cache: ${key}`);
  }

  // Recupera dati dalla cache
  getCache(key) {
    const cacheItem = this.cache.get(key);

    if (!cacheItem) {
      return null;
    }

    // Verifica se i dati sono scaduti
    if (Date.now() - cacheItem.timestamp > cacheItem.ttl) {
      this.cache.delete(key);
      this.saveCacheToStorage();
      return null;
    }

    return cacheItem.data;
  }

  // Aggiungi operazione pendente
  addPendingOperation(operation) {
    this.pendingOperations.push({
      ...operation,
      timestamp: Date.now(),
    });

    console.log(`⏳ Operazione aggiunta alla coda: ${operation.type}`);
  }

  // Sincronizza operazioni pendenti
  async syncPendingOperations() {
    if (!this.isOnline || this.pendingOperations.length === 0) {
      return;
    }

    console.log(
      `🔄 Sincronizzazione ${this.pendingOperations.length} operazioni...`
    );

    const operations = [...this.pendingOperations];
    this.pendingOperations = [];

    for (const operation of operations) {
      try {
        await this.executeOperation(operation);
        console.log(`✅ Operazione sincronizzata: ${operation.type}`);
      } catch (error) {
        console.error(`❌ Errore sincronizzazione ${operation.type}:`, error);
        // Rimetti l'operazione in coda se fallisce
        this.pendingOperations.push(operation);
      }
    }
  }

  // Esegui operazione
  async executeOperation(operation) {
    // Implementa la logica per eseguire le operazioni Firebase
    // Questo sarà integrato con i servizi Firebase esistenti
    console.log('Eseguendo operazione:', operation);
  }

  // Genera chiave cache per collezione
  generateCacheKey(collection, userId, docId = null) {
    if (docId) {
      return `${collection}_${userId}_${docId}`;
    }
    return `${collection}_${userId}`;
  }

  // Pulisci cache scaduta
  cleanExpiredCache() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cache pulita: ${cleaned} elementi rimossi`);
      this.saveCacheToStorage();
    }
  }

  // Ottieni statistiche cache
  getCacheStats() {
    const now = Date.now();
    let expired = 0;
    let valid = 0;

    for (const item of this.cache.values()) {
      if (now - item.timestamp > item.ttl) {
        expired++;
      } else {
        valid++;
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired,
      pendingOperations: this.pendingOperations.length,
      isOnline: this.isOnline,
    };
  }
}

// Istanza singleton
export const offlineManager = new OfflineManager();

// Utility functions per integrazione con Firebase
export const withOfflineSupport = firebaseOperation => {
  return async (...args) => {
    if (offlineManager.isOnline) {
      try {
        const result = await firebaseOperation(...args);
        return result;
      } catch (error) {
        if (error.code === 'unavailable') {
          // Firebase non disponibile, usa cache
          console.log('📴 Firebase non disponibile, usando cache');
          return offlineManager.getCache(args[0]) || null;
        }
        throw error;
      }
    } else {
      // Offline, usa cache
      console.log('📴 Modalità offline, usando cache');
      return offlineManager.getCache(args[0]) || null;
    }
  };
};

// Hook per stato offline
export const useOfflineStatus = () => {
  const [isOnline, setIsOnline] = React.useState(offlineManager.isOnline);
  const [cacheStats, setCacheStats] = React.useState(
    offlineManager.getCacheStats()
  );

  React.useEffect(() => {
    const updateStatus = () => {
      setIsOnline(offlineManager.isOnline);
      setCacheStats(offlineManager.getCacheStats());
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    // Aggiorna stats ogni 30 secondi
    const interval = setInterval(updateStatus, 30000);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      clearInterval(interval);
    };
  }, []);

  return { isOnline, cacheStats };
};
