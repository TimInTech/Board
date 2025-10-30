export function openShortcutEditDialog(shortcut) {
  const dialog = document.getElementById('shortcutEditDialog');
  const form = document.getElementById('shortcutEditForm');
  if (!dialog || !form || typeof dialog.showModal !== 'function') {
    const currentLabel = shortcut?.label ?? '';
    const currentUrl = shortcut?.url ?? '';
    const label = window.prompt('Neuer Titel für Bookmark:', currentLabel);
    if (label == null) return Promise.resolve(null);
    const url = window.prompt('Neue URL für Bookmark:', currentUrl);
    if (url == null) return Promise.resolve(null);
    return Promise.resolve({
      label: String(label).trim(),
      url: String(url).trim(),
    });
  }

  const nameInput = form.querySelector('[name="label"]');
  const urlInput = form.querySelector('[name="url"]');

  if (nameInput) nameInput.value = shortcut?.label ?? '';
  if (urlInput) urlInput.value = shortcut?.url ?? '';

  return new Promise(resolve => {
    function handleSubmit(event) {
      event.preventDefault();
      const result = {
        label: nameInput?.value.trim() ?? '',
        url: urlInput?.value.trim() ?? '',
      };
      cleanup();
      dialog.close('submit');
      resolve(result);
    }

    function handleCancel() {
      cleanup();
      dialog.close('cancel');
      resolve(null);
    }

    function handleClose() {
      cleanup();
      resolve(dialog.returnValue === 'submit'
        ? {
          label: nameInput?.value.trim() ?? '',
          url: urlInput?.value.trim() ?? '',
        }
        : null);
    }

    function cleanup() {
      form.removeEventListener('submit', handleSubmit);
      cancelBtn?.removeEventListener('click', handleCancel);
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('close', handleClose);
    }

    const cancelBtn = dialog.querySelector('[data-action="cancel"]');
    form.addEventListener('submit', handleSubmit);
    cancelBtn?.addEventListener('click', handleCancel, { once: true });
    dialog.addEventListener('cancel', handleCancel, { once: true });
    dialog.addEventListener('close', handleClose, { once: true });

    dialog.showModal();
    nameInput?.focus();
  });
}

export function openConfirmDialog(message) {
  const dialog = document.getElementById('confirmDeleteDialog');
  if (!dialog || typeof dialog.showModal !== 'function') {
    return Promise.resolve(window.confirm(message));
  }

  const messageEl = dialog.querySelector('[data-role="message"]');
  const confirmBtn = dialog.querySelector('[data-action="confirm"]');
  const cancelBtn = dialog.querySelector('[data-action="cancel"]');

  if (messageEl) messageEl.textContent = message;

  return new Promise(resolve => {
    function handleConfirm() {
      cleanup();
      dialog.close('confirm');
      resolve(true);
    }

    function handleCancelEvent() {
      cleanup();
      dialog.close('cancel');
      resolve(false);
    }

    function cleanup() {
      confirmBtn?.removeEventListener('click', handleConfirm);
      cancelBtn?.removeEventListener('click', handleCancelEvent);
      dialog.removeEventListener('cancel', handleCancelEvent);
      dialog.removeEventListener('close', handleClose);
    }

    function handleClose() {
      cleanup();
      resolve(dialog.returnValue === 'confirm');
    }

    confirmBtn?.addEventListener('click', handleConfirm, { once: true });
    cancelBtn?.addEventListener('click', handleCancelEvent, { once: true });
    dialog.addEventListener('cancel', handleCancelEvent, { once: true });
    dialog.addEventListener('close', handleClose, { once: true });

    dialog.showModal();
    confirmBtn?.focus();
  });
}
