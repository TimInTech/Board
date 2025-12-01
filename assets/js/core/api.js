// ===== API MANAGER =====
import { CONFIG } from './config.js';
import { retry, showNotification } from './utils.js';

class APIManager {
  constructor() {
    this.requestQueue = [];
    this.processing = false;
  }

  // Gemini API with correct endpoints
  async callGemini(prompt, options = {}) {
    const {
      model = CONFIG.GEMINI_TEXT_MODEL,
      systemPrompt = null,
      responseSchema = null,
      apiKey = null,
    } = options;

    if (!apiKey) {
      showNotification('Bitte Gemini API-Key in den Einstellungen hinterlegen', 'error');
      return null;
    }

    const endpoint = `${CONFIG.GEMINI_API_BASE}/models/${model}:generateContent`;

    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    if (systemPrompt) {
      payload.systemInstruction = {
        parts: [{ text: systemPrompt }]
      };
    }

    if (responseSchema) {
      payload.generationConfig = {
        responseMimeType: "application/json",
        responseSchema
      };
    }

    try {
      const response = await retry(async () => {
        const res = await fetch(`${endpoint}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const error = await res.text();
          throw new Error(`Gemini API error: ${res.status} - ${error}`);
        }

        return res.json();
      });

      const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (responseSchema && text) {
        return JSON.parse(text);
      }
      
      return text;
    } catch (error) {
      console.error('Gemini API call failed:', error);
      showNotification(`API-Fehler: ${error.message}`, 'error');
      return null;
    }
  }

  // Generate image with Imagen
  async generateImage(prompt, apiKey) {
    if (!apiKey) {
      showNotification('Bitte Gemini API-Key in den Einstellungen hinterlegen', 'error');
      return null;
    }

    const endpoint = `${CONFIG.GEMINI_API_BASE}/models/${CONFIG.GEMINI_IMAGE_MODEL}:predict`;

    const payload = {
      instances: [{
        prompt: `A beautiful, high-resolution, 16:9 desktop wallpaper: ${prompt}. Professional photography, cinematic lighting.`
      }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "16:9",
        safetySetting: "block_some",
      }
    };

    try {
      const response = await retry(async () => {
        const res = await fetch(`${endpoint}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const error = await res.text();
          throw new Error(`Imagen API error: ${res.status} - ${error}`);
        }

        return res.json();
      });

      const base64Data = response?.predictions?.[0]?.bytesBase64Encoded;
      
      if (base64Data) {
        return `data:image/png;base64,${base64Data}`;
      }
      
      throw new Error('No image data in response');
    } catch (error) {
      console.error('Imagen API call failed:', error);
      showNotification(`Fehler bei Bild-Generierung: ${error.message}`, 'error');
      return null;
    }
  }

  // OpenWeatherMap API
  async getWeather(city, apiKey) {
    if (!city || !apiKey) return null;

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=de`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        temp: Math.round(data.main.temp),
        description: data.weather?.[0]?.description || '',
        city: data.name,
        icon: data.weather?.[0]?.icon
      };
    } catch (error) {
      console.error('Weather API failed:', error);
      return null;
    }
  }

  // Status Check with batching and proper error handling
  async checkStatus(url, timeout = CONFIG.STATUS_CHECK_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      await fetch(url, {
        mode: 'no-cors',
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      clearTimeout(timeoutId);
      return false;
    }
  }

  // Batch status checks for better performance
  async checkMultipleStatuses(apps, onProgress = null) {
    const results = new Map();
    const batchSize = CONFIG.STATUS_CHECK_BATCH_SIZE;
    
    for (let i = 0; i < apps.length; i += batchSize) {
      const batch = apps.slice(i, i + batchSize);
      const promises = batch.map(async (app) => {
        const key = `${app.name}@${app.url}`;
        const status = await this.checkStatus(app.url);
        return { key, status };
      });

      const batchResults = await Promise.all(promises);
      
      batchResults.forEach(({ key, status }) => {
        results.set(key, status);
      });

      if (onProgress) {
        onProgress(results, (i + batch.length) / apps.length);
      }

      // Small delay between batches to avoid overwhelming
      if (i + batchSize < apps.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  // Fetch ICS calendar
  async fetchICS(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error('ICS fetch failed:', error);
      return null;
    }
  }
}

export const api = new APIManager();
