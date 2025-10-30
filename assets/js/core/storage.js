import { ensureProtocol, uuid } from './utils.js';

const SHORTCUTS_KEY = 'board.quickButtons';
const API_KEY_KEY = 'board.apiKey';
const PANEL_COLLAPSED_KEY = 'board.quickPanelCollapsed';

export function normalizeShortcut(raw = {}) {
  return {
    id: raw.id || uuid(),
    label: String(raw.label ?? '').trim(),
    url: ensureProtocol(raw.url || ''),
    favorite: Boolean(raw.favorite),
  };
}

export function loadShortcuts() {
  try {
    const raw = localStorage.getItem(SHORTCUTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeShortcut)
      .filter(item => item.label && item.url);
  } catch {
    return [];
  }
}

export function saveShortcuts(shortcuts) {
  const normalized = shortcuts.map(normalizeShortcut);
  localStorage.setItem(SHORTCUTS_KEY, JSON.stringify(normalized));
  return normalized;
}

export function getApiKey() {
  return localStorage.getItem(API_KEY_KEY) || '';
}

export function setApiKey(value) {
  if (!value) {
    localStorage.removeItem(API_KEY_KEY);
    return;
  }
  localStorage.setItem(API_KEY_KEY, value);
}

export function isPanelCollapsed() {
  return localStorage.getItem(PANEL_COLLAPSED_KEY) === '1';
}

export function setPanelCollapsed(flag) {
  localStorage.setItem(PANEL_COLLAPSED_KEY, flag ? '1' : '0');
}
