import { elSafe, domainFromUrl } from '../core/utils.js';

function createActionButton(cls, action, label, text) {
  const btn = elSafe('button', cls, text);
  btn.type = 'button';
  btn.dataset.action = action;
  if (label) btn.setAttribute('aria-label', label);
  return btn;
}

export function renderShortcuts(container, shortcuts, { favoritesOnly = false } = {}) {
  if (!container) return;
  container.textContent = '';

  if (!shortcuts.length) {
    const empty = elSafe('div', 'quick-empty', favoritesOnly
      ? 'Noch keine Favoriten markiert.'
      : 'Noch keine Schnellstart-Links angelegt.');
    container.appendChild(empty);
    return;
  }

  shortcuts.forEach(shortcut => {
    const tile = elSafe('div', 'tile');
    tile.dataset.id = shortcut.id;
    tile.setAttribute('role', 'group');

    const header = elSafe('div', 'tile-header');
    const link = elSafe('a', 'tile-link', shortcut.label || domainFromUrl(shortcut.url));
    link.href = shortcut.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.dataset.action = 'open';

    const star = createActionButton('btn btn-icon btn-star', 'toggle-favorite',
      shortcut.favorite ? 'Als Favorit entfernen' : 'Als Favorit markieren',
      shortcut.favorite ? '★' : '☆');
    star.setAttribute('aria-pressed', String(!!shortcut.favorite));

    header.append(link, star);

    const meta = elSafe('div', 'tile-meta', domainFromUrl(shortcut.url));

    const actions = elSafe('div', 'tile-actions');
    const edit = createActionButton('btn btn-icon btn-edit', 'edit', 'Bookmark bearbeiten', '✎');
    const del = createActionButton('btn btn-icon btn-delete', 'delete', 'Bookmark löschen', '🗑');
    const open = elSafe('a', 'btn btn-secondary btn-open', 'Öffnen');
    open.href = shortcut.url;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.dataset.action = 'open';

    actions.append(edit, del, open);

    tile.append(header, meta, actions);
    container.appendChild(tile);
  });
}

export function renderFavoritesDock(container, shortcuts) {
  if (!container) return;
  container.textContent = '';
  shortcuts
    .filter(item => item.favorite)
    .forEach(item => {
      const btn = elSafe('button', 'fav-btn', item.label || domainFromUrl(item.url));
      btn.type = 'button';
      btn.dataset.action = 'open';
      btn.dataset.id = item.id;
      container.appendChild(btn);
    });
}

export function updateFavoritesToggle(button, active, favoritesCount) {
  if (!button) return;
  button.setAttribute('aria-pressed', String(Boolean(active)));
  button.classList.toggle('is-active', Boolean(active));
  const label = active ? 'Alle Links anzeigen' : 'Nur Favoriten anzeigen';
  button.setAttribute('aria-label', label);
  button.textContent = active ? `Alle Links (${favoritesCount})` : `Favoriten (${favoritesCount})`;
}

export function updatePanelCollapsed(bodyEl, toggleEl, collapsed) {
  if (!bodyEl || !toggleEl) return;
  bodyEl.hidden = collapsed;
  toggleEl.setAttribute('aria-expanded', String(!collapsed));
  toggleEl.textContent = collapsed ? '▼ Ausklappen' : '▲ Einklappen';
}
