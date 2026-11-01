(function () {
  'use strict';
  var root = document.documentElement;
  var stage = document.querySelector('.av-stage');
  if (!stage) return;
  root.classList.add('av-js');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var loops = Array.prototype.slice.call(document.querySelectorAll('.av-loop'));
  var wides = Array.prototype.slice.call(document.querySelectorAll('.av-wide'));
  var pauseBtn = document.querySelector('.av-pause');
  var dialog = document.querySelector('.av-player');
  var paused = reduce;
  var cinemaFull = false;

  function play(v) {
    if (v.preload === 'none') v.preload = 'auto';
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }
  function wanted(v) {
    if (paused || (dialog && dialog.open) || v.dataset.visible !== '1') return false;
    // Phone loops sit behind a full-bleed cinema; only one picture decodes at a time.
    if (cinemaFull && v.classList.contains('av-loop')) return false;
    return true;
  }
  function refresh() {
    loops.concat(wides).forEach(function (v) { if (wanted(v)) play(v); else if (!v.paused) v.pause(); });
  }

  // Pause control for all moving pictures (WCAG 2.2.2). Reduced motion starts paused.
  function setPaused(p) {
    paused = p;
    pauseBtn.textContent = p ? 'Play motion' : 'Pause motion';
    refresh();
  }
  pauseBtn.addEventListener('click', function () { setPaused(!paused); });
  setPaused(paused);

  // Phone loops play only while visible inside the phone screen.
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.dataset.visible = e.intersectionRatio > 0.5 ? '1' : '0'; });
      refresh();
    }, { threshold: [0, 0.5, 1] });
    loops.forEach(function (v) { io.observe(v); });
  }

  // Signature moment: the feed breaks out of the phone into full-bleed cinema.
  // matchMedia builds it on wide screens with motion allowed and tears it down on resize or rotate.
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    var cinemas = Array.prototype.slice.call(stage.querySelectorAll('.av-cinema'));
    var mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', function () {
      root.classList.add('av-motion');
      var screen = stage.querySelector('.av-screen');
      var feed = stage.querySelector('.av-feed');
      var copy = stage.querySelector('.av-copy');
      var spans = [];

      var phoneClip = function () {
        var s = stage.getBoundingClientRect();
        var r = screen.getBoundingClientRect();
        return 'inset(' + (r.top - s.top) + 'px ' + (s.right - r.right) + 'px ' +
          (s.bottom - r.bottom) + 'px ' + (r.left - s.left) + 'px round 38px)';
      };
      var fullClip = 'inset(0px 0px 0px 0px round 0px)';

      // onUpdate lives on the timeline so state follows the scrubbed playhead, not raw scroll.
      var tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onUpdate: sync,
        scrollTrigger: {
          trigger: stage, start: 'top top', end: '+=' + (cinemas.length * 140) + '%',
          pin: true, scrub: 0.6, invalidateOnRefresh: true
        }
      });
      cinemas.forEach(function (c, i) {
        var t0 = tl.duration();
        tl.set(c, { autoAlpha: 1 })
          .fromTo(c, { clipPath: phoneClip }, { clipPath: fullClip, duration: 1 })
          .to(copy, { autoAlpha: 0, duration: 0.35 }, '<')
          .to({}, { duration: 0.9 })
          .to(c, { clipPath: phoneClip, duration: 1 })
          .to(copy, { autoAlpha: 1, duration: 0.35 }, '<0.6')
          .set(c, { autoAlpha: 0 });
        // visible from t0 to the end of the collapse; interactive only while (nearly) full-bleed
        spans.push({ a: t0, f: t0 + 0.9, o: t0 + 2.0, e: t0 + 2.9 });
        if (i < cinemas.length - 1) tl.to(feed, { yPercent: -100 * (i + 1), duration: 0.6 });
      });

      function sync() {
        var t = tl.time();
        cinemaFull = false;
        cinemas.forEach(function (c, i) {
          var sp = spans[i];
          var visible = t > sp.a && t < sp.e;
          var full = t >= sp.f && t <= sp.o;
          if (full) cinemaFull = true;
          c.querySelector('.av-wide').dataset.visible = visible ? '1' : '0';
          if (full) c.removeAttribute('inert'); else c.setAttribute('inert', '');
        });
        refresh();
      }
      sync();

      return function () {
        root.classList.remove('av-motion');
        cinemaFull = false;
        cinemas.forEach(function (c) { c.setAttribute('inert', ''); c.querySelector('.av-wide').dataset.visible = '0'; });
        refresh();
      };
    });
  }

  // Films with sound open in a dialog, on request only. Links work without JavaScript.
  var films = {
    maison: {
      name: 'Maison Filaos',
      src: '/video/maison-film.mp4',
      text: 'Concept film for an invented boutique hotel in Mauritius. Morning light through a curtain, a pontoon over the lagoon, coffee poured on the terrace, the villa at dawn, then the line "Wake up somewhere else." Music only, no dialogue.'
    },
    kestrel: {
      name: 'Kestrel',
      src: '/video/kestrel-film.mp4',
      text: 'Concept launch film for an invented fintech brand. Kinetic type and motion graphics set to music. No dialogue.'
    }
  };
  if (dialog) {
    var dv = dialog.querySelector('video');
    var dName = dialog.querySelector('.av-player-name');
    var dText = dialog.querySelector('.av-player-text');
    var dErr = dialog.querySelector('.av-player-error');
    var opener = null;
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-film]');
      if (!b || !films[b.dataset.film]) return;
      e.preventDefault();
      var f = films[b.dataset.film];
      opener = b;
      dialog.setAttribute('aria-label', f.name + ' film');
      dName.textContent = f.name;
      dText.textContent = f.text;
      dErr.hidden = true;
      dErr.querySelector('a').href = f.src;
      dv.src = f.src;
      dialog.showModal();
      refresh();
      var p = dv.play();
      if (p && p.catch) p.catch(function () {});
    });
    dv.addEventListener('error', function () { if (dv.getAttribute('src')) dErr.hidden = false; });
    dialog.querySelector('.av-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', function () {
      dv.pause();
      dv.removeAttribute('src');
      dv.load();
      refresh();
      var back = opener && !opener.closest('[inert]') && opener.offsetParent !== null ? opener : document.getElementById('spots-title');
      if (back) back.focus();
    });
  }
})();
// 2. See the layers: one frame, four layers, peeled by scroll, drag, rail or keys.
(function () {
  'use strict';
  var sec = document.querySelector('.av-layers');
  if (!sec) return;
  document.documentElement.classList.add('av-js');
  var stack = sec.querySelector('.av-lstack');
  var layers = Array.prototype.slice.call(stack.querySelectorAll('.av-layer'));
  var range = sec.querySelector('.av-lrange');
  var btns = Array.prototype.slice.call(sec.querySelectorAll('[data-go]'));
  var now = sec.querySelector('.av-lnow');
  var hint = sec.querySelector('.av-lhint');
  var names = ['Generated', 'Cut', 'Typeset', 'Delivered'];
  var caps = layers.map(function (l) { return l.querySelector('.av-lcap').innerHTML; });
  var PIN_QUERY = '(min-width: 900px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)';
  var max = layers.length - 1, v = 0, shown = -1, manual = false, tw = null, drag = null;

  var handle = document.createElement('div');
  handle.className = 'av-lhandle';
  handle.setAttribute('aria-hidden', 'true');
  stack.appendChild(handle);
  hint.textContent = 'Drag the frame or pick a layer to peel it back.';

  // Layer images sit clipped to zero width, so load them before the section arrives.
  if ('IntersectionObserver' in window) {
    var pre = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      stack.querySelectorAll('img').forEach(function (img) { img.loading = 'eager'; });
      pre.disconnect();
    }, { rootMargin: '900px 0px' });
    pre.observe(sec);
  }

  function setUI(cur) {
    if (cur === shown) return;
    shown = cur;
    layers.forEach(function (l, i) { l.setAttribute('aria-hidden', i === cur ? 'false' : 'true'); });
    range.value = cur;
    range.setAttribute('aria-valuetext', names[cur]);
    btns.forEach(function (b, i) { b.classList.toggle('is-on', i === cur); b.setAttribute('aria-pressed', i === cur ? 'true' : 'false'); });
    now.innerHTML = caps[cur];
  }
  function render() {
    for (var k = 1; k <= max; k++) {
      var p = Math.min(1, Math.max(0, v - (k - 1))) * 100;
      layers[k].style.clipPath = 'inset(0 ' + (100 - p).toFixed(3) + '% 0 0)';
    }
    var seg = Math.min(max - 1, Math.floor(v)), frac = v - seg;
    handle.style.left = (frac * 100).toFixed(3) + '%';
    handle.setAttribute('data-edge', frac < 0.04 ? 'start' : (frac > 0.96 ? 'end' : ''));
    if (!tw) setUI(Math.round(v));
  }
  function stop() { if (tw) { tw.kill(); tw = null; } }
  function go(t) {
    t = Math.max(0, Math.min(max, t));
    stop();
    setUI(t);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) { v = t; render(); return; }
    var o = { v: v };
    tw = gsap.to(o, { v: t, duration: 0.5 + 0.2 * Math.abs(t - v), ease: 'power2.inOut',
      onUpdate: function () { v = o.v; render(); }, onComplete: function () { tw = null; render(); } });
  }

  range.addEventListener('input', function () { manual = true; go(+range.value); });
  btns.forEach(function (b) { b.addEventListener('click', function () { manual = true; go(+b.dataset.go); }); });

  // A press only becomes a drag after 6px of sideways movement, so taps and vertical swipes leave scroll in charge.
  stack.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    drag = { x: e.clientX, v: v, w: stack.getBoundingClientRect().width, id: e.pointerId, live: false };
  });
  stack.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x;
    if (!drag.live) {
      if (Math.abs(dx) < 6) return;
      drag.live = true; manual = true; stop();
      stack.setPointerCapture(drag.id);
    }
    v = Math.max(0, Math.min(max, drag.v + dx / drag.w));
    render();
  });
  function end() { var d = drag; drag = null; if (d && d.live) go(Math.round(v)); }
  stack.addEventListener('pointerup', end);
  stack.addEventListener('pointercancel', end);

  // Wide, tall-enough screens with motion: the section pins and native scroll scrubs the layers (no snap).
  // A drag or rail choice takes over until the visitor leaves; entering again hands control back to scroll.
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.matchMedia().add(PIN_QUERY, function () {
      hint.textContent = 'Scroll, drag the frame or pick a layer to peel it back.';
      var st = ScrollTrigger.create({
        trigger: sec, start: 'top top', end: '+=' + (max * 70) + '%', pin: true,
        onUpdate: function (self) { if (manual) return; stop(); v = self.progress * max; render(); },
        onEnter: function () { manual = false; },
        onEnterBack: function () { manual = false; },
        onLeave: function () { manual = false; stop(); v = max; render(); },
        onLeaveBack: function () { manual = false; stop(); v = 0; render(); }
      });
      return function () { st.kill(); hint.textContent = 'Drag the frame or pick a layer to peel it back.'; };
    });
  }
  render();
})();