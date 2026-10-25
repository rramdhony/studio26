(function () {
  // Booking link is set here once, so every "Book a call" button follows it.
  var BOOKING_URL = '';
  if (BOOKING_URL) {
    document.querySelectorAll('[data-booking], a[href="#book"], a[href="/#book"]').forEach(function (a) {
      a.href = BOOKING_URL;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  // Hero reel: autoplay unless the visitor prefers reduced motion; always pausable (WCAG 2.2.2).
  var reel = document.getElementById('heroReel');
  var toggle = document.getElementById('reelToggle');
  if (reel && toggle) {
    var src = 'https://pub-accaa99b083244a1a58f40dfa9cfaa9f.r2.dev/studio26-hero.mp4?v=1';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    reel.src = src;
    if (!reduce) reel.play().catch(function () {});

    var sync = function () {
      toggle.classList.toggle('paused', reel.paused);
      toggle.setAttribute('aria-label', reel.paused ? 'Play reel' : 'Pause reel');
    };
    reel.addEventListener('play', sync);
    reel.addEventListener('pause', sync);
    sync();
    toggle.addEventListener('click', function () {
      if (reel.paused) reel.play().catch(function () {}); else reel.pause();
    });
  }

  // Sample ads: load and play only while on screen; never autoplay under reduced motion; a manual pause sticks.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-autoplay-video]').forEach(function (v) {
    var btn = v.parentElement.querySelector('.reel-toggle');
    var name = btn.getAttribute('aria-label').replace(/^(Play|Pause) /, '');
    var userPaused = false;
    var load = function () { if (!v.getAttribute('src')) v.src = v.dataset.src; };
    var sync = function () {
      btn.classList.toggle('paused', v.paused);
      btn.setAttribute('aria-label', (v.paused ? 'Play ' : 'Pause ') + name);
    };
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);
    btn.addEventListener('click', function () {
      load();
      if (v.paused) { userPaused = false; v.play().catch(function () {}); } else { userPaused = true; v.pause(); }
    });
    if (!reduceMotion && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { load(); if (!userPaused) v.play().catch(function () {}); } else { v.pause(); }
        });
      }, { threshold: 0.4 }).observe(v);
    }
  });

  // Live ad demo: the Remotion bundle loads only as the visitor approaches the section.
  var demo = document.getElementById('demo');
  if (demo) {
    var loadDemo = function () {
      if (document.getElementById('adDemoScript')) return;
      var s = document.createElement('script');
      s.id = 'adDemoScript';
      s.src = '/assets/ad-demo.js?v=5';
      s.async = true;
      document.body.appendChild(s);
    };
    if ('IntersectionObserver' in window) {
      var demoObserver = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) { loadDemo(); demoObserver.disconnect(); }
      }, { rootMargin: '600px 0px' });
      demoObserver.observe(demo);
    } else {
      loadDemo();
    }
  }

  // Enquiry form: inline validation, then POST as JSON. Without JS the form posts normally.
  var form = document.getElementById('enquiry');
  if (!form) return;
  var status = document.getElementById('formStatus');

  // Load Cloudflare Turnstile only once someone starts the form, so most visitors never fetch it.
  var turnstileRequested = false;
  function loadTurnstile() {
    if (turnstileRequested) return;
    turnstileRequested = true;
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    s.async = true;
    document.head.appendChild(s);
  }
  form.addEventListener('focusin', loadTurnstile);
  form.addEventListener('pointerdown', loadTurnstile);

  function turnstileToken(timeoutMs) {
    return new Promise(function (resolve) {
      var start = Date.now();
      (function check() {
        var input = form.querySelector('[name="cf-turnstile-response"]');
        if (input && input.value) return resolve(input.value);
        if (Date.now() - start > timeoutMs) return resolve('');
        setTimeout(check, 200);
      })();
    });
  }

  var messages = {
    name: 'Please tell us your name.',
    email: 'Please enter an email address we can reply to.',
    message: 'Please tell us a little about the project.',
  };

  function setError(input, text) {
    var id = input.id + '-error';
    var el = document.getElementById(id);
    if (!text) {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      if (el) el.remove();
      return;
    }
    if (!el) {
      el = document.createElement('p');
      el.id = id;
      el.className = 'field-error';
      input.insertAdjacentElement('afterend', el);
    }
    el.textContent = text;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', id);
  }

  function validate() {
    var first = null;
    ['name', 'email', 'message'].forEach(function (name) {
      var input = form.elements[name];
      var value = input.value.trim();
      var bad = !value || (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
      setError(input, bad ? messages[name] : '');
      if (bad && !first) first = input;
    });
    return first;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    status.classList.remove('is-error');
    var firstBad = validate();
    if (firstBad) {
      status.textContent = 'Please check the highlighted fields.';
      status.classList.add('is-error');
      firstBad.focus();
      return;
    }

    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = 'Sending…';
    loadTurnstile();

    turnstileToken(10000).then(function () {
      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });
      return fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
    })
      .then(function (res) { return res.json().catch(function () { return {}; }).then(function (body) { return { ok: res.ok, body: body }; }); })
      .then(function (r) {
        if (!r.ok) throw new Error(r.body.error || 'failed');
        form.reset();
        status.textContent = 'Thank you. Your enquiry is in, and we will reply by email.';
      })
      .catch(function (err) {
        status.textContent = (err && err.message && err.message !== 'failed' && err.message.length < 160)
          ? err.message
          : 'Something went wrong sending your enquiry. Please email hello@studio26.me instead.';
        status.classList.add('is-error');
      })
      .finally(function () { button.disabled = false; });
  });
})();
