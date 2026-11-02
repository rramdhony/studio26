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
})();
