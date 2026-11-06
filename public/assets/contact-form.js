/* Contact form in a dialog. The studio address is never written into the page source:
   bots that harvest addresses find nothing, and people reach us through a form guarded by
   a hidden honeypot field and Cloudflare Turnstile (checked again on the server). */
(() => {
  'use strict';
  const triggers = document.querySelectorAll('[data-contact]');
  if (!triggers.length || typeof HTMLDialogElement !== 'function') return;
  const SITEKEY = (document.currentScript && document.currentScript.dataset.sitekey) || '';
  const address = () => ['hello', 'studio26.me'].join(String.fromCharCode(64));

  const dialog = document.createElement('dialog');
  dialog.className = 'studio-chat contact-dialog';
  dialog.setAttribute('aria-labelledby', 'contact-title');
  dialog.innerHTML = `
    <div class="chat-top"><span>studio26 / write to the studio</span><button type="button" class="chat-close contact-close">Close <span aria-hidden="true">&times;</span></button></div>
    <div class="chat-body">
      <h2 id="contact-title">Tell us about<br>your project.</h2>
      <p class="cf-lede">We read every message and reply by email.</p>
      <form class="contact-form" action="/api/enquiry" method="post">
        <div class="cf-field"><label for="cf-name">Your name</label><input id="cf-name" name="name" type="text" required maxlength="120" autocomplete="name"></div>
        <div class="cf-field"><label for="cf-email">Your email</label><input id="cf-email" name="email" type="email" required maxlength="200" autocomplete="email"></div>
        <div class="cf-field"><label for="cf-company">Company <span class="cf-optional">(optional)</span></label><input id="cf-company" name="company" type="text" maxlength="160" autocomplete="organization"></div>
        <div class="cf-field"><label for="cf-need">What do you need?</label><select id="cf-need" name="need" required>
          <option value="">Choose one</option><option value="website">A website</option><option value="video">An AI video ad</option><option value="both">Both</option><option value="unsure">Not sure yet</option>
        </select></div>
        <div class="cf-field"><label for="cf-message">About the project</label><textarea id="cf-message" name="message" rows="5" required maxlength="4000"></textarea></div>
        <div class="cf-hp" aria-hidden="true"><label for="cf-hp">Leave this field empty</label><input id="cf-hp" name="hp_field" type="text" tabindex="-1" autocomplete="off"></div>
        <div class="cf-turnstile"></div>
        <button type="submit" class="cf-send">Send message</button>
        <p class="cf-status" role="status" aria-live="polite" tabindex="-1"></p>
      </form>
      <p class="chat-human cf-alt">Prefer your own email app? <button type="button" class="contact-link cf-reveal">Show our address</button></p>
    </div>`;
  document.body.appendChild(dialog);
  document.documentElement.classList.add('cf-ready');

  const form = dialog.querySelector('form');
  const status = dialog.querySelector('.cf-status');
  const send = dialog.querySelector('.cf-send');
  const box = dialog.querySelector('.cf-turnstile');
  let opener = null;
  let widget = null;
  let tsFailed = false;
  const TS_FAIL = 'The spam check could not load. Please use "Show our address" below instead.';

  function renderTurnstile() {
    if (widget !== null || !SITEKEY) return;
    import('./turnstile.js').then(({ loadTurnstile }) => loadTurnstile()).then(() => {
      if (widget === null) widget = window.turnstile.render(box, { sitekey: SITEKEY, action: 'contact_form', theme: 'light', size: 'flexible', appearance: 'interaction-only', 'error-callback': () => { tsFailed = true; status.textContent = TS_FAIL; } });
    }).catch(() => {
      tsFailed = true;
      status.textContent = TS_FAIL;
    });
  }

  function open(e) {
    opener = e.currentTarget;
    dialog.showModal();
    (dialog.querySelector('#cf-name') || dialog.querySelector('.cf-done-title') || dialog.querySelector('.contact-close')).focus();
    renderTurnstile();
  }
  triggers.forEach((t) => t.addEventListener('click', open));
  dialog.querySelector('.contact-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { if (opener) opener.focus(); });

  dialog.querySelector('.cf-reveal').addEventListener('click', (e) => {
    const a = document.createElement('a');
    a.href = 'mailto:' + address();
    a.textContent = address();
    e.currentTarget.replaceWith(a);
    a.focus();
  });

  let busy = false;
  const fail = (msg) => { status.textContent = msg; status.focus(); };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy || !form.reportValidity()) return;
    const token = form.querySelector('[name="cf-turnstile-response"]');
    if (SITEKEY && tsFailed) { fail(TS_FAIL); return; }
    if (SITEKEY && (!token || !token.value)) { fail('Please wait a moment while we check this is not an automated message, then send again.'); return; }
    busy = true;
    send.setAttribute('aria-disabled', 'true');
    status.textContent = 'Sending your message.';
    try {
      const res = await fetch('/api/enquiry', { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.ok) {
        const done = document.createElement('div');
        done.className = 'cf-done';
        done.innerHTML = '<p class="cf-done-title" tabindex="-1">Thank you. Your message is in.</p><p>We will reply by email.</p>';
        form.replaceWith(done);
        done.firstChild.focus();
        return;
      }
      fail(out.error || 'Your message was not sent. Please try again.');
    } catch (err) {
      fail('Your message was not sent. Please check your connection and try again.');
    }
    if (widget !== null && window.turnstile) window.turnstile.reset(widget);
    busy = false;
    send.removeAttribute('aria-disabled');
  });
})();