import { $, $$, announce, ensureProtocol } from './core/utils.js';
import {
  loadShortcuts,
  saveShortcuts,
  normalizeShortcut,
  getApiKey,
  setApiKey,
  isPanelCollapsed,
  setPanelCollapsed,
} from './core/storage.js';
import {
  renderShortcuts,
  renderFavoritesDock,
  updateFavoritesToggle,
  updatePanelCollapsed,
} from './ui/render.js';
import { openShortcutEditDialog, openConfirmDialog } from './ui/modals.js';

const listContainer = $('#button-container');
const favoritesDock = $('#favorites-dock');
const favoritesToggle = $('#btnFavorites');
const panelBody = $('#quickPanelBody');
const panelToggle = $('#quickPanelToggle');
const addForm = $('#new-button-form');
const apiInput = $('#apiKeyInput');
const apiSaveBtn = $('#saveKey');
const apiStatus = $('#apiKeyStatus');

let shortcuts = loadShortcuts();
let showFavoritesOnly = false;

function visibleShortcuts() {
  const base = [...shortcuts];
  return showFavoritesOnly ? base.filter(item => item.favorite) : base;
}

function persist(message) {
  shortcuts = saveShortcuts(shortcuts);
  render();
  if (message) announce(message);
}

function render() {
  const favoritesCount = shortcuts.filter(item => item.favorite).length;
  renderShortcuts(listContainer, visibleShortcuts(), { favoritesOnly: showFavoritesOnly });
  renderFavoritesDock(favoritesDock, shortcuts);
  updateFavoritesToggle(favoritesToggle, showFavoritesOnly, favoritesCount);
}

function handleAdd(form) {
  const labelInput = form.querySelector('[name="label"]');
  const urlInput = form.querySelector('[name="url"]');
  const label = labelInput?.value.trim() ?? '';
  const url = ensureProtocol(urlInput?.value.trim() ?? '');
  if (!label || !url) {
    announce('Label und URL sind Pflichtfelder.');
    return;
  }
  shortcuts.push(normalizeShortcut({ label, url }));
  persist('Schnellstart-Link gespeichert.');
  form.reset();
  labelInput?.focus();
}

function handleOpen(id) {
  const entry = shortcuts.find(item => item.id === id);
  if (entry?.url) window.open(entry.url, '_blank', 'noopener,noreferrer');
}

function handleToggleFavorite(id) {
  const entry = shortcuts.find(item => item.id === id);
  if (!entry) return;
  entry.favorite = !entry.favorite;
  persist(entry.favorite ? 'Favorit aktiviert.' : 'Favorit entfernt.');
}

async function handleEdit(id) {
  const entry = shortcuts.find(item => item.id === id);
  if (!entry) return;
  const result = await openShortcutEditDialog(entry);
  if (!result) return;
  entry.label = result.label || entry.label;
  entry.url = ensureProtocol(result.url || entry.url);
  persist('Bookmark aktualisiert.');
}

async function handleDelete(id) {
  const entry = shortcuts.find(item => item.id === id);
  if (!entry) return;
  const confirmed = await openConfirmDialog(`"${entry.label}" wirklich löschen?`);
  if (!confirmed) return;
  shortcuts = shortcuts.filter(item => item.id !== id);
  persist('Bookmark gelöscht.');
}

function handleFavoritesToggle() {
  showFavoritesOnly = !showFavoritesOnly;
  render();
  announce(showFavoritesOnly ? 'Favoritenansicht aktiviert.' : 'Alle Links eingeblendet.');
}

function renderApiKeyStatus() {
  if (!apiInput || !apiStatus) return;
  const stored = getApiKey();
  if (stored) {
    apiInput.value = '********';
    apiStatus.classList.add('ok');
    apiStatus.classList.remove('bad');
    apiStatus.setAttribute('title', 'API-Key gespeichert');
  } else {
    if (apiInput.value === '********') apiInput.value = '';
    apiStatus.classList.add('bad');
    apiStatus.classList.remove('ok');
    apiStatus.setAttribute('title', 'kein API-Key gespeichert');
  }
}

function bindEvents() {
  addForm?.addEventListener('submit', event => {
    event.preventDefault();
    handleAdd(addForm);
  });

  listContainer?.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const tile = target.closest('.tile');
    const id = tile?.dataset.id;
    const action = target.dataset.action;
    if (!id && action !== 'open') return;

    switch (action) {
      case 'toggle-favorite':
        handleToggleFavorite(id);
        break;
      case 'edit':
        handleEdit(id);
        break;
      case 'delete':
        handleDelete(id);
        break;
      case 'open':
        event.preventDefault();
        handleOpen(id);
        break;
      default:
        if (target.tagName === 'A' && target.dataset.action === 'open' && id) {
          event.preventDefault();
          handleOpen(id);
        }
        break;
    }
  });

  favoritesDock?.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action === 'open' && target.dataset.id) {
      handleOpen(target.dataset.id);
    }
  });

  favoritesToggle?.addEventListener('click', () => handleFavoritesToggle());

  panelToggle?.addEventListener('click', () => {
    const next = !isPanelCollapsed();
    setPanelCollapsed(next);
    updatePanelCollapsed(panelBody, panelToggle, next);
  });

  apiSaveBtn?.addEventListener('click', () => {
    if (!apiInput) return;
    const value = apiInput.value.trim();
    if (!value || value === '********') {
      announce('Kein neuer API-Key eingegeben.');
      return;
    }
    setApiKey(value);
    renderApiKeyStatus();
    announce('API-Key gespeichert.');
  });

  apiInput?.addEventListener('input', () => {
    if (apiInput.value === '********') apiInput.value = '';
  });

  document.addEventListener('board:settings-open', () => {
    renderApiKeyStatus();
  });
}

function init() {
  const collapsed = isPanelCollapsed();
  updatePanelCollapsed(panelBody, panelToggle, collapsed);
  render();
  renderApiKeyStatus();
  bindEvents();
}

init();

export async function callProtectedEndpoint(endpointUrl) {
  const key = getApiKey();
  if (!key) {
    announce('Bitte zuerst einen API-Key speichern.');
    throw new Error('missing api key');
  }
  const response = await fetch(endpointUrl, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!response.ok) {
    throw new Error(`request failed ${response.status}`);
  }
  return response.json();
}

window.board = window.board || {};
window.board.callProtectedEndpoint = callProtectedEndpoint;
