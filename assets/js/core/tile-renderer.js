// ===== ENHANCED TILE RENDERING WITH CONTEXT MENU =====
import { createElement, getDomain, getFaviconUrl } from './utils.js';
import { storage } from './storage.js';

export class TileRenderer {
  constructor() {
    this.contextMenu = null;
    this.initContextMenu();
  }

  initContextMenu() {
    this.contextMenu = createElement('div', 'context-menu');
    this.contextMenu.style.cssText = `
      position: fixed;
      background: var(--card);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      padding: 6px;
      box-shadow: var(--shadow);
      z-index: 10000;
      display: none;
    `;
    document.body.appendChild(this.contextMenu);

    // Close on outside click
    document.addEventListener('click', () => {
      this.contextMenu.style.display = 'none';
    });
  }

  showContextMenu(x, y, app, callbacks) {
