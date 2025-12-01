// ===== CONFIGURATION & CONSTANTS =====
export const CONFIG = {
  MODEL_KEY: 'timintech-board-v4',
  SETTINGS_KEY: 'timintech-settings-v2',
  WALLPAPER_KEY: 'timintech-wallpaper',
  ICS_CACHE_KEY: 'timintech-ics-cache',
  FAVORITES_KEY: 'timintech-favorites-v1',
  
  // API Configuration
  GEMINI_TEXT_MODEL: 'gemini-2.0-flash-exp',
  GEMINI_IMAGE_MODEL: 'imagen-3.0-generate-001',
  GEMINI_API_BASE: 'https://generativelanguage.googleapis.com/v1beta',
  
  // Performance Settings
  STATUS_CHECK_INTERVAL: 30000, // 30 seconds
  STATUS_CHECK_TIMEOUT: 5000,
  STATUS_CHECK_BATCH_SIZE: 5, // Check 5 at a time
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000,
  
  // UI Settings
  DEFAULT_TILE_SIZE: 110,
  MIN_TILE_SIZE: 80,
  MAX_TILE_SIZE: 160,
  DOCK_MAX_ITEMS: 12,
};

export const DEFAULT_APPS = [];

export const DEFAULT_SETTINGS = {
  theme: 'auto',
  compact: false,
  collapse: false,
  city: '',
  owmKey: '',
  geminiKey: '',
  unsplash: '',
  icsUrl: '',
  tileSize: CONFIG.DEFAULT_TILE_SIZE,
  showWeather: true,
  showCalendar: true,
  showOnlineStatus: true,
};

export const CATEGORIES = [
  'Favoriten',
  'Netzwerk',
  'Entwicklung',
  'Produktivität',
  'Smart Home',
  'Sonstiges'
];

export const KEYBOARD_SHORTCUTS = {
  'search': { key: 'k', ctrl: true, meta: true },
  'settings': { key: ',', ctrl: true, meta: true },
  'add': { key: 'n', ctrl: true, meta: true },
  'theme': { key: 'd', ctrl: true, meta: true },
};
