// ===== UTILITY FUNCTIONS =====
import { CONFIG } from './config.js';

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function createElement(tag, className, innerHTML) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (innerHTML != null) element.innerHTML = innerHTML;
  return element;
}

export function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function getFaviconUrl(url) {
  const domain = getDomain(url);
  return `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent('https://' + domain)}`;
}

export function normalizeUrl(url) {
  try {
    const urlObj = new URL(url);
    urlObj.hash = '';
    
    // Remove tracking parameters
    const trackingParams = ['utm_', 'gclid', 'fbclid', 'ref', 'mc_eid'];
    const keepParams = [...urlObj.searchParams.entries()].filter(([key]) => 
      !trackingParams.some(param => key.toLowerCase().startsWith(param))
    );
    
    urlObj.search = '';
    for (const [key, value] of keepParams) {
      urlObj.searchParams.append(key, value);
    }
    
    let normalized = urlObj.toString();
    if (normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }
    
    return normalized.toLowerCase();
  } catch {
    return String(url).trim();
  }
}

export function downloadFile(filename, content, mimeType = 'application/json') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function showNotification(message, type = 'info', duration = 4000) {
  const notification = createElement('div', 'notification');
  notification.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    padding: 12px 20px;
    border-radius: 12px;
    box-shadow: var(--shadow);
    font-weight: 600;
    transition: opacity 0.3s ease, bottom 0.3s ease;
    opacity: 0;
    pointer-events: none;
  `;
  
  const colors = {
    info: 'var(--accent)',
    success: 'var(--ok)',
    error: 'var(--danger)',
    warn: 'var(--warn)'
  };
  
  notification.style.background = colors[type] || colors.info;
  notification.style.color = type === 'info' ? 'var(--bg1)' : '#fff';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  requestAnimationFrame(() => {
    notification.style.opacity = '1';
    notification.style.bottom = '90px';
  });
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.bottom = '80px';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export async function retry(fn, maxRetries = CONFIG.MAX_RETRIES, delay = CONFIG.RETRY_DELAY) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
}

export function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function getTimeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return 'Guten Morgen';
  if (hour < 17) return 'Guten Tag';
  return 'Guten Abend';
}

export function formatDate(date, includeTime = false) {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('de-DE', options).format(date);
}
