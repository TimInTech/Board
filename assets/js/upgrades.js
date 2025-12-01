/**
 * TimInTech Dashboard v4 - Upgrade Script
 * 
 * Dieses Script fügt alle wichtigen Verbesserungen zu deinem Dashboard hinzu:
 * 1. Gemini API Fixes (korrekte Endpoints)
 * 2. Tile-Größen-Slider
 * 3. Favoriten-System mit Stern-Icons
 * 4. Kontextmenü (Rechtsklick)
 * 5. Tastatur-Shortcuts (1-9 für Top-Links)
 * 6. Widget-Sichtbarkeit
 * 7. Performance-Optimierungen
 * 8. Verbesserte Fehlerbehandlung
 * 
 * INSTALLATION:
 * 1. Sichere deine aktuelle index.html
 * 2. Füge dieses Script VOR dem schließenden </body> Tag ein
 * 3. Oder lade es als separate Datei und binde es ein: <script src="assets/js/upgrades.js"></script>
 */

(function() {
  'use strict';

  console.log('🚀 TimInTech Dashboard v4 Upgrades loading...');

  // ===== 1. GEMINI API FIXES =====
  const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
  
  // Override the original callGeminiAPI function
  const originalCallGemini = window.callGeminiAPI;
  
  window.callGeminiAPI = async function(model, payload, isImage = false) {
    const apiKey = SETTINGS.geminiKey;
    if (!apiKey) {
