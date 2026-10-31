/* A finite, progressive enhancement of the approved two-frame motion study. */
(function () {
  'use strict';
  var section = document.getElementById('opening');
  var complete = document.getElementById('introComplete');
  var sculpture = document.getElementById('introSculpture');
  var button = document.getElementById('introToggle');
  var status = document.getElementById('introStatus');
  if (!section || !complete || !sculpture || !button || !window.gsap) return;
  var gsap = window.gsap;
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var label = button.querySelector('[data-control-label]');
  var glyph = button.querySelector('.control-glyph');
  var timeline;
  var userPaused = false;
  var inView = true;
  var finished = true;
  var frameReady = false;
  var generation = 0;
  var hasScrolled = window.scrollY > 8;
  window.addEventListener('scroll', function () { hasScrolled = true; }, { once: true, passive: true });

  function setState(state, announce) {
    section.dataset.introState = state;
    var labels = { running: 'Pause opening', paused: 'Resume opening', complete: 'Replay opening' };
    label.textContent = labels[state] || 'Replay opening';
    glyph.textContent = state === 'running' ? 'Ⅱ' : state === 'paused' ? '▷' : '↻';
    if (announce) status.textContent = state === 'paused' ? 'Opening paused.' : state === 'running' ? 'Opening playing.' : 'Opening complete.';
  }
  function settle() {
    generation += 1;
    if (timeline) timeline.kill();
    gsap.set(complete, { clearProps: 'all' });
    gsap.set(sculpture, { clearProps: 'all' });
    sculpture.hidden = true;
    finished = true;
    userPaused = false;
    setState('complete', false);
    if (motion.matches && document.activeElement === button) section.querySelector('.opening-project').focus({ preventScroll: true });
    button.hidden = motion.matches || !frameReady;
  }
  function syncPlayback() {
    if (!timeline || finished) return;
    var paused = userPaused || document.hidden || !inView;
    timeline.paused(paused);
    setState(paused ? 'paused' : 'running', false);
  }
  function play() {
    if (!frameReady || motion.matches || !complete.complete || !complete.naturalWidth) return;
    if (timeline) timeline.kill();
    sculpture.hidden = false;
    finished = false;
    userPaused = false;
    gsap.set(complete, { autoAlpha: 0, clipPath: 'inset(0% 0% 0% 100%)' });
    gsap.set(sculpture, { autoAlpha: 1, y: 0, yPercent: -50, scale: 1.06, rotation: -2, xPercent: 0, transformOrigin: '50% 55%' });
    timeline = gsap.timeline({ onComplete: function () {
      finished = true;
      sculpture.hidden = true;
      gsap.set(complete, { clearProps: 'all' });
      setState('complete', false);
    } });
    timeline.to(sculpture, { scale: 1, rotation: 0, duration: 1.25, ease: 'power2.out' }, 0);
    timeline.to(sculpture, { scale: 0.55, xPercent: 27, duration: 1.65, ease: 'power3.inOut' }, 1.15);
    timeline.to(complete, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.65, ease: 'power3.inOut' }, 1.65);
    timeline.to(sculpture, { autoAlpha: 0, duration: 0.7, ease: 'power1.out' }, 2.3);
    button.hidden = false;
    syncPlayback();
  }
  async function prepare(autoplay) {
    if (autoplay === undefined) autoplay = true;
    if (motion.matches) { settle(); return; }
    var ticket = ++generation;
    try {
      if (!complete.complete) await complete.decode();
      sculpture.src = sculpture.dataset.src;
      await sculpture.decode();
      frameReady = true;
      if (ticket !== generation || motion.matches) return;
      if (autoplay && performance.now() < 1500 && !hasScrolled && !document.hidden) play();
      else settle();
    } catch (_) {
      // The complete wordmark remains the usable default if an image cannot decode.
      settle();
    }
  }
  button.addEventListener('click', function () {
    inView = true;
    if (finished) { play(); setState(section.dataset.introState, true); return; }
    userPaused = !userPaused;
    syncPlayback();
    setState(section.dataset.introState, true);
  });
  document.addEventListener('visibilitychange', syncPlayback);
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      inView = entries[entries.length - 1].isIntersecting;
      syncPlayback();
    }, { threshold: 0 });
    observer.observe(section);
  }
  function preferenceChanged() {
    settle();
    if (!motion.matches) prepare(false);
  }
  if (motion.addEventListener) motion.addEventListener('change', preferenceChanged);
  else if (motion.addListener) motion.addListener(preferenceChanged);
  prepare();
})();

