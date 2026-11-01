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