/* Explicit interaction preview. No model, collection, storage or submission. */
(() => {
  const dialog = document.querySelector('.studio-chat');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const reply = dialog.querySelector('.chat-reply');
  const choices = [...dialog.querySelectorAll('[data-intent]')];
  let opener;
  let ownsHistory = false;

  function open() {
    if (dialog.open) return;
    dialog.showModal();
    dialog.querySelector('.chat-close').focus();
  }
  function close() {
    if (ownsHistory && history.state?.studioConversationPreview) {
      history.back();
    } else {
      dialog.close();
    }
  }
  document.querySelectorAll('[data-chat]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      reply.textContent = '';
      choices.forEach(choice => choice.setAttribute('aria-pressed', 'false'));
      history.pushState({ ...history.state, studioConversationPreview: true }, '', location.href);
      ownsHistory = true;
      open();
    });
    button.hidden = false;
  });
  const responses = {
    'A website': 'For a website, we would explore your business, your audience and what the site needs to achieve.',
    'An AI video ad': 'For a video, we would explore your message, your audience and where the film will run.',
    'Something else': 'We would start with what you have in mind and work out the possibilities together.'
  };
  choices.forEach(button => button.addEventListener('click', () => {
    choices.forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
    reply.textContent = responses[button.dataset.intent] + ' This is a design preview of that opening. The live assistant is still to be built.';
  }));
  dialog.querySelector('.chat-close').addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  // Fallback for browsers without declarative closedby="any" support (and to route through history-aware close)
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isDialogContent = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isDialogContent) close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button:not([disabled]), a[href]')]
      .filter(control => control.getClientRects().length > 0);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
  window.addEventListener('popstate', () => {
    ownsHistory = Boolean(history.state?.studioConversationPreview);
    if (ownsHistory) open();
    else if (dialog.open) dialog.close();
  });
  // Reloading an open preview restores the modal without adding another history entry.
  if (history.state?.studioConversationPreview) {
    opener = document.querySelector('[data-chat]');
    ownsHistory = true;
    open();
  }
})();
