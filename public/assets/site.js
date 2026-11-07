(function () {
  'use strict';
  // Booking link is set here once, so every "Book a call" button follows it.
  var BOOKING_URL = '';
  if (BOOKING_URL) {
    document.querySelectorAll('[data-booking], a[href="#book"], a[href="/#book"]').forEach(function (a) {
      a.href = BOOKING_URL;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  // Synchronize programmatic aria-invalid with CSS :user-invalid after interaction.
  var syncAria = function (el) {
    if (!el || typeof el.matches !== 'function' || !el.checkValidity) return;
    try {
      if (el.matches(':user-invalid')) el.setAttribute('aria-invalid', 'true');
      else if (el.hasAttribute('aria-invalid')) el.removeAttribute('aria-invalid');
    } catch (_) {}
  };
  document.addEventListener('blur', function (e) { syncAria(e.target); }, true);
  document.addEventListener('input', function (e) {
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('aria-invalid')) syncAria(e.target);
  });

  // First-party pseudonymised interaction telemetry (GET /api/event -> 204) + optional GA4 bridge.
  var track = function (event, target) {
    try {
      var cleanTarget = String(target || '').replace(/[^a-zA-Z0-9._/-]/g, '').slice(0, 80);
      var page = window.location.pathname || '/';
      if (typeof window.gtag === 'function') {
        window.gtag('event', event, { event_label: cleanTarget, page_path: page });
      }
      var qs =
        '?e=' + encodeURIComponent(event) +
        '&t=' + encodeURIComponent(cleanTarget) +
        '&p=' + encodeURIComponent(page);
      fetch('/api/event' + qs, { method: 'GET', keepalive: true, credentials: 'omit' }).catch(function () {});
    } catch (_) {}
  };

  var refHost = 'direct';
  try {
    if (document.referrer) {
      var rUrl = new URL(document.referrer);
      if (rUrl.hostname && rUrl.hostname !== window.location.hostname) refHost = rUrl.hostname;
    }
  } catch (_) {}
  track('page_view', refHost);

  document.addEventListener('click', function (e) {
    var target = e.target && e.target.closest ? e.target : null;
    if (!target) return;
    var wa = target.closest('a[href^="https://wa.me/"]');
    if (wa) {
      track('whatsapp_click', wa.getAttribute('data-track') || 'footer');
      return;
    }
    var ash = target.closest('#ash-launcher, [data-chat]');
    if (ash) {
      track('ash_open', ash.id || 'talk_trigger');
      return;
    }
    var contact = target.closest('[data-contact]');
    if (contact) {
      track('contact_open', contact.className || 'button');
      return;
    }
    var work = target.closest('a.work-link');
    if (work && work.href) {
      try {
        track('portfolio_click', new URL(work.href).hostname);
      } catch (_) {}
      return;
    }
    var li = target.closest('a.atelier-linkedin');
    if (li) {
      track('linkedin_click', 'rubenramdhony');
      return;
    }
    var cta = target.closest('.service-more a, .opening-actions a, .nav-cta');
    if (cta) {
      track('cta_click', cta.getAttribute('href') || 'cta');
    }
  });
})();
