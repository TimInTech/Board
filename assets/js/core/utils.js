export const $ = (selector, root = document) => root.querySelector(selector);

export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

export function elSafe(tag, cls, text) {
  const element = document.createElement(tag);
  if (cls) element.className = cls;
  if (text != null) element.textContent = text;
  return element;
}

export function ensureProtocol(rawUrl) {
  if (!rawUrl) return '';
  const value = String(rawUrl).trim();
  if (!value) return '';
  if (/^[a-z][a-z0-9+\-.]*:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function domainFromUrl(url) {
  if (!url) return '';
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function announce(message) {
  if (!message) return;
  const region = document.getElementById('liveRegion');
  if (!region) return;
  region.textContent = '';
  window.requestAnimationFrame(() => {
    region.textContent = message;
  });
}

export function toBoolean(value) {
  return value === true || value === 'true';
}

export function uuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}
