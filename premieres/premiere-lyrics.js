(() => {
  'use strict';
  const dialog = document.getElementById('lyrics-aawazein');
  if (!dialog) return;
  let previousFocus = null;
  function close() {
    if (dialog.open && typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    document.body.style.overflow = '';
    if (previousFocus?.isConnected) previousFocus.focus();
  }
  document.querySelectorAll('[data-premiere-lyrics]').forEach(button => button.addEventListener('click', () => {
    previousFocus = document.activeElement;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    dialog.querySelector('.lyrics-close')?.focus();
  }));
  dialog.querySelectorAll('[data-close-lyrics]').forEach(button => button.addEventListener('click', close));
  dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    if (previousFocus?.isConnected) previousFocus.focus();
  });
})();
