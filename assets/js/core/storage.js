// ===== STORAGE MANAGER =====
import { CONFIG, DEFAULT_APPS, DEFAULT_SETTINGS } from './config.js';
import { showNotification } from './utils.js';

class StorageManager {
  constructor() {
    this.listeners = new Map();
  }

  // Settings Management
  loadSettings() {
    try {
      const stored = localStorage.getItem(CONFIG.SETTINGS_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : { ...DEFAULT_SETTINGS };
    } catch (error) {
      console.error('Failed to load settings:', error);
      return { ...DEFAULT_SETTINGS };
    }
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(settings));
      this.emit('settings:changed', settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      showNotification('Fehler beim Speichern der Einstellungen', 'error');
    }
  }

  // Apps Management
  loadApps() {
    try {
      const stored = localStorage.getItem(CONFIG.MODEL_KEY);
      if (!stored) {
        localStorage.setItem(CONFIG.MODEL_KEY, JSON.stringify(DEFAULT_APPS));
        return DEFAULT_APPS;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load apps:', error);
      return DEFAULT_APPS;
    }
  }

  saveApps(apps) {
    try {
      localStorage.setItem(CONFIG.MODEL_KEY, JSON.stringify(apps));
      this.emit('apps:changed', apps);
    } catch (error) {
      console.error('Failed to save apps:', error);
      showNotification('Fehler beim Speichern der Apps', 'error');
    }
  }

  // Favorites Management
  loadFavorites() {
    try {
      const stored = localStorage.getItem(CONFIG.FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load favorites:', error);
      return [];
    }
  }

  saveFavorites(favorites) {
    try {
      localStorage.setItem(CONFIG.FAVORITES_KEY, JSON.stringify(favorites));
      this.emit('favorites:changed', favorites);
    } catch (error) {
      console.error('Failed to save favorites:', error);
      showNotification('Fehler beim Speichern der Favoriten', 'error');
    }
  }

  toggleFavorite(appKey) {
    const favorites = this.loadFavorites();
    const index = favorites.indexOf(appKey);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(appKey);
    }
    
    this.saveFavorites(favorites);
    return index === -1; // Return true if added
  }

  isFavorite(appKey) {
    return this.loadFavorites().includes(appKey);
  }

  // Wallpaper Management
  saveWallpaper(dataUrl) {
    try {
      localStorage.setItem(CONFIG.WALLPAPER_KEY, dataUrl);
    } catch (error) {
      console.error('Failed to save wallpaper:', error);
      throw new Error('Wallpaper zu groß für localStorage');
    }
  }

  loadWallpaper() {
    return localStorage.getItem(CONFIG.WALLPAPER_KEY);
  }

  removeWallpaper() {
    localStorage.removeItem(CONFIG.WALLPAPER_KEY);
  }

  // Calendar cache
  saveICSCache(text) {
    const cache = { ts: Date.now(), text };
    localStorage.setItem(CONFIG.ICS_CACHE_KEY, JSON.stringify(cache));
  }

  loadICSCache() {
    try {
      const stored = localStorage.getItem(CONFIG.ICS_CACHE_KEY);
      if (!stored) return null;
      
      const cache = JSON.parse(stored);
      const MAX_AGE = 30 * 60 * 1000; // 30 minutes
      
      if (Date.now() - cache.ts < MAX_AGE) {
        return cache.text;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Event system
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  // Backup & Restore
  createBackup() {
    return {
      version: 4,
      timestamp: Date.now(),
      settings: this.loadSettings(),
      apps: this.loadApps(),
      favorites: this.loadFavorites(),
    };
  }

  restoreBackup(backup) {
    try {
      if (backup.settings) this.saveSettings(backup.settings);
      if (backup.apps) this.saveApps(backup.apps);
      if (backup.favorites) this.saveFavorites(backup.favorites);
      return true;
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return false;
    }
  }

  // Clear all data
  clearAll() {
    const keys = [
      CONFIG.MODEL_KEY,
      CONFIG.SETTINGS_KEY,
      CONFIG.WALLPAPER_KEY,
      CONFIG.ICS_CACHE_KEY,
      CONFIG.FAVORITES_KEY,
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    this.emit('storage:cleared');
  }
}

export const storage = new StorageManager();
