(() => {
  const BUTTONS_KEY = 'board.quickButtons';
  const API_KEY_KEY = 'board.apiKey';
  const PANEL_COLLAPSE_KEY = 'board.quickPanelCollapsed';

  // ---- storage helpers -------------------------------------------------
  function loadButtons() {
    try {
      const raw = localStorage.getItem(BUTTONS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(item => item && typeof item.id === 'string')
        .map(item => ({
          id: item.id,
          label: String(item.label || '').trim(),
          url: String(item.url || '').trim(),
          favorite: !!item.favorite
        }));
    } catch {
      return [];
    }
  }

  function saveButtons(buttons) {
    localStorage.setItem(BUTTONS_KEY, JSON.stringify(buttons));
  }

  function getApiKey() {
    return localStorage.getItem(API_KEY_KEY) || '';
  }

  function setApiKey(value) {
    localStorage.setItem(API_KEY_KEY, value);
  }

  function getPanelCollapsed() {
    return localStorage.getItem(PANEL_COLLAPSE_KEY) === '1';
  }

  function setPanelCollapsed(flag) {
    localStorage.setItem(PANEL_COLLAPSE_KEY, flag ? '1' : '0');
  }

  function ensureHttp(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
  }

  // ---- rendering -------------------------------------------------------

  function renderButtons() {
    const container = document.querySelector('#button-container');
    if (!container) return;

    container.innerHTML = '';
    const buttons = loadButtons();

    if (!buttons.length) {
      const empty = document.createElement('div');
      empty.className = 'quick-empty';
      empty.textContent =
        'Noch keine Buttons angelegt. Nutze das Formular, um deinen ersten Schnellzugriff hinzuzufügen.';
      container.appendChild(empty);
      return;
    }

    buttons.forEach(btn => {
      const star = btn.favorite ? '★' : '☆';
      const el = document.createElement('div');
      el.className = 'tile';
      el.dataset.id = btn.id;
      el.innerHTML = `
        <div class="tile-main">
          <button class="action-btn"
            data-action="open"
            data-id="${btn.id}">
            ${btn.label || 'Unnamed'}
          </button>
        </div>
        <div class="tile-controls">
          <button class="small-btn"
            data-action="fav"
            data-id="${btn.id}"
            title="Favorit umschalten">${star}</button>
          <button class="small-btn"
            data-action="edit"
            data-id="${btn.id}"
            title="Bearbeiten">✏️</button>
          <button class="small-btn"
            data-action="delete"
            data-id="${btn.id}"
            title="Entfernen">🗑️</button>
        </div>
      `;
      container.appendChild(el);
    });

    renderFavoritesDock();
  }

  function renderFavoritesDock() {
    const dock = document.querySelector('#favorites-dock');
    if (!dock) return;
    dock.innerHTML = '';

    const favorites = loadButtons().filter(b => b.favorite);

    favorites.forEach(btn => {
      const favEl = document.createElement('button');
      favEl.className = 'fav-btn';
      favEl.textContent = btn.label || 'Link';
      favEl.dataset.id = btn.id;
      favEl.dataset.action = 'open';
      dock.appendChild(favEl);
    });

    // if no favorites, keep dock empty but visible so layout doesn't jump
  }

  function renderApiKeyStatus() {
    const statusEl = document.querySelector('#apiKeyStatus');
    const inputEl = document.querySelector('#apiKeyInput');
    if (!statusEl || !inputEl) return;

    const existing = getApiKey();

    if (existing) {
      inputEl.value = '********';
      statusEl.classList.remove('bad');
      statusEl.classList.add('ok');
      statusEl.setAttribute('title', 'API-Key gespeichert');
    } else {
      if (inputEl.value === '********') {
        inputEl.value = '';
      }
      statusEl.classList.remove('ok');
      statusEl.classList.add('bad');
      statusEl.setAttribute('title', 'kein API-Key gespeichert');
    }
  }

  function renderPanelCollapsedState() {
    const bodyEl = document.querySelector('#quickPanelBody');
    const toggleBtn = document.querySelector('#quickPanelToggle');
    const collapsed = getPanelCollapsed();
    if (!bodyEl || !toggleBtn) return;

    if (collapsed) {
      bodyEl.hidden = true;
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = '▼ Ausklappen';
    } else {
      bodyEl.hidden = false;
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.textContent = '▲ Einklappen';
    }
  }

  // ---- mutations -------------------------------------------------------

  function addButton(label, url) {
    const buttons = loadButtons();
    const id = crypto.randomUUID();
    buttons.push({
      id,
      label: label.trim(),
      url: ensureHttp(url.trim()),
      favorite: false
    });
    saveButtons(buttons);
    renderButtons();
  }

  function editButton(id, newLabel, newUrl) {
    const buttons = loadButtons();
    const idx = buttons.findIndex(b => b.id === id);
    if (idx === -1) return;
    buttons[idx].label = String(newLabel || '').trim();
    buttons[idx].url = ensureHttp(String(newUrl || '').trim());
    saveButtons(buttons);
    renderButtons();
  }

  function deleteButton(id) {
    const buttons = loadButtons().filter(b => b.id !== id);
    saveButtons(buttons);
    renderButtons();
  }

  function toggleFavorite(id) {
    const buttons = loadButtons();
    const idx = buttons.findIndex(b => b.id === id);
    if (idx === -1) return;
    buttons[idx].favorite = !buttons[idx].favorite;
    saveButtons(buttons);
    renderButtons();
  }

  // ---- events ----------------------------------------------------------

  document.addEventListener('click', event => {
    const target = event.target;
    if (!target || !('dataset' in target)) return;
    const action = target.dataset.action;
    const id = target.dataset.id;

    if (action === 'open') {
      const btn = loadButtons().find(b => b.id === id);
      if (btn?.url) {
        window.open(btn.url, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    if (action === 'edit') {
      const current = loadButtons().find(b => b.id === id);
      if (!current) return;
      const newLabel =
        prompt('Neuer Titel für Button:', current.label) ?? current.label;
      const newUrl =
        prompt('Neue URL für Button:', current.url) ?? current.url;
      editButton(id, newLabel, newUrl);
      return;
    }

    if (action === 'delete') {
      if (confirm('Diesen Button wirklich löschen?')) {
        deleteButton(id);
      }
      return;
    }

    if (action === 'fav') {
      toggleFavorite(id);
      return;
    }

    if (target.id === 'quickPanelToggle') {
      const collapsed = getPanelCollapsed();
      setPanelCollapsed(!collapsed);
      renderPanelCollapsedState();
      return;
    }
  });

  function bindCreateButtonForm() {
    const form = document.querySelector('#new-button-form');
    if (!form) return;
    form.addEventListener('submit', evt => {
      evt.preventDefault();
      const labelInput = form.querySelector('[name="label"]');
      const urlInput = form.querySelector('[name="url"]');
      const label = labelInput?.value.trim() ?? '';
      const url = urlInput?.value.trim() ?? '';
      if (!label || !url) {
        alert('Label und URL sind Pflicht.');
        return;
      }
      addButton(label, url);
      form.reset();
      labelInput?.focus();
    });
  }

  function bindApiKeySave() {
    const saveBtn = document.querySelector('#saveKey');
    const input = document.querySelector('#apiKeyInput');
    if (!saveBtn || !input) return;
    saveBtn.addEventListener('click', () => {
      const raw = input.value.trim();
      if (!raw || raw === '********') {
        alert('Kein neuer API-Key eingegeben.');
        return;
      }
      setApiKey(raw);
      renderApiKeyStatus();
      alert('API-Key gespeichert (localStorage).');
    });
  }

  async function callProtectedEndpoint(endpointUrl) {
    const key = getApiKey();
    if (!key) {
      alert('Bitte zuerst einen API-Key speichern.');
      throw new Error('missing api key');
    }
    const res = await fetch(endpointUrl, {
      headers: { Authorization: `Bearer ${key}` }
    });
    if (!res.ok) {
      console.warn('Request fehlgeschlagen:', res.status);
      throw new Error(`request failed ${res.status}`);
    }
    return res.json();
  }

  function init() {
    renderButtons();
    renderApiKeyStatus();
    renderPanelCollapsedState();
    bindCreateButtonForm();
    bindApiKeySave();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  window.callProtectedEndpoint = callProtectedEndpoint;
})();
