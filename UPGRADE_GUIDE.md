# TimInTech Dashboard v4 - Upgrade Guide

## 🎯 Übersicht der Verbesserungen

Dieses Dokument beschreibt alle Verbesserungen für dein Dashboard und wie du sie umsetzt.

---

## 1. ❌ GEMINI API FIXES (KRITISCH)

### Problem:
Die aktuellen API-Endpoints sind veraltet und funktionieren nicht mehr korrekt.

### Lösung:
Ersetze in deiner `index.html` die `callGeminiAPI` Funktion (ca. Zeile 1310):

```javascript
// ALTE VERSION (FEHLERHAFT):
async function callGeminiAPI(model, payload, isImage = false) {
  // ...
  let apiUrl;
  if (isImage) {
    apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
  } else {
    apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
  }
  // ...
}

// NEUE VERSION (KORREKT):
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_TEXT_MODEL = 'gemini-2.0-flash-exp';
const GEMINI_IMAGE_MODEL = 'imagen-3.0-generate-001';

async function callGeminiAPI(model, payload, isImage = false) {
  const apiKey = SETTINGS.geminiKey;
  if (!apiKey) {
    showNotification('Bitte Gemini API-Key in den Einstellungen hinterlegen.', 'error');
    return null;
  }
  
  let endpoint, finalPayload;
  
  if (isImage) {
    // Imagen API für Bild-Generierung
    endpoint = `${GEMINI_API_BASE}/models/${GEMINI_IMAGE_MODEL}:predict`;
    finalPayload = payload; // Imagen verwendet anderes Format
  } else {
    // Gemini Text API
    endpoint = `${GEMINI_API_BASE}/models/${model || GEMINI_TEXT_MODEL}:generateContent`;
    finalPayload = payload;
  }
  
  try {
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalPayload)
    });
    
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorBody}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Gemini API call failed:`, error);
    showNotification(`API-Fehler: ${error.message}`, 'error');
    return null;
  }
}
```

