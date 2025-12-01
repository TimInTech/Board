# 🚀 TimInTech Dashboard - Schnelle Verbesserungen

## ⚡ Sofort umsetzbare Fixes (5 Minuten)

### 1. GEMINI API FIX (KRITISCH) ❌→✅

**Problem:** Deine Gemini API-Calls verwenden veraltete Model-Namen.

**Fix:** Öffne `index.html` und suche nach Zeile 1260 (ca.):

```javascript
// ERSETZE DIESE ZEILEN:
const API_MODEL_TEXT = 'gemini-2.5-flash-preview-05-20';
const API_MODEL_IMAGE = 'imagen-3.0-generate-002';

// DURCH:
const API_MODEL_TEXT = 'gemini-2.0-flash-exp';
const API_MODEL_IMAGE = 'imagen-3.0-generate-001';
```

### 2. TILE-GRÖSSEN-SLIDER ✨

**Füge in den Settings-Dialog ein** (nach Zeile 1160):

```html
<div class="row">
  <div>
    <label for="tileSizeSlider">
      Kachel-Größe: <span id="tileSizeValue">110px</span>
    </label>
    <input type="range" id="tileSizeSlider" 
           min="80" max="160" step="10" value="110"
           style="width: 100%;">
  </div>
  <div></div>
</div>
```

**Füge JavaScript hinzu** (vor `init()` Funktion):

```javascript
// Tile-Größen-Slider Handler
const tileSizeSlider = $('#tileSizeSlider');
const tileSizeValue = $('#tileSizeValue');

if (tileSizeSlider) {
  tileSizeSlider.value = SETTINGS.tileSize || 110;
  tileSizeValue.textContent = `${tileSizeSlider.value}px`;
  
  tileSizeSlider.addEventListener('input', (e) => {
    const size = e.target.value;
    tileSizeValue.textContent = `${size}px`;
    document.documentElement.style.setProperty('--tile-size', `${size}px`);
    SETTINGS.tileSize = parseInt(size);
    saveSettings(SETTINGS);
  });
  
  // Beim Laden anwenden
  if (SETTINGS.tileSize) {
    document.documentElement.style.setProperty('--tile-size', `${SETTINGS.tileSize}px`);
  }
}
```

### 3. FAVORITEN-SYSTEM MIT STERN ⭐

**Füge zum CSS hinzu** (in `<style>` Tag):

```css
.tile-star {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.3;
  transition: opacity 0.2s, transform 0.2s;
  z-index: 10;
}
