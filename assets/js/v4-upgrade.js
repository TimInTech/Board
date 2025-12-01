/**
 * 🚀 TimInTech Dashboard v4 - Komplett-Upgrade
 * 
 * INSTALLATION: 
 * 1. Backup von index.html erstellen
 * 2. Diese Datei als <script src="assets/js/v4-upgrade.js"></script> NACH dem vorhandenen Code einbinden
 * 3. Browser-Cache leeren und Seite neu laden
 */

(function() {
  'use strict';
  
  console.log('%c🚀 Dashboard v4 Upgrades werden geladen...', 'color: #8be9fd; font-weight: bold;');

  // ===== CONFIG =====
  const V4_CONFIG = {
    GEMINI_API_BASE: 'https://generativelanguage.googleapis.com/v1beta',
    GEMINI_TEXT_MODEL: 'gemini-2.0-flash-exp',
    GEMINI_IMAGE_MODEL: 'imagen-3.0-generate-001',
    FAVORITES_KEY: 'timintech-favorites-v1',
    STATUS_CHECK_BATCH_SIZE: 5,
    STATUS_CHECK_INTERVAL: 30000,
  };

  // ===== 1. FIX GEMINI API =====
  console.log('✅ Patching Gemini API...');
  
  window.callGeminiAPIv4 = async function(model, payload, isImage = false) {
    const apiKey = SETTINGS.geminiKey;
    if (!apiKey) {
      showNotification('Bitte Gemini API-Key in den Einstellungen hinterlegen.', 'error');
      return null;
    }
