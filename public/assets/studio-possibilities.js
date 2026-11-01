(() => {
  const root = document.querySelector(".possibilities");
  if (!root) return;
  const worlds = [...root.querySelectorAll('[data-world]')];
  const selectors = [...root.querySelectorAll('[data-select]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animated = worlds.map(world => world.querySelector(".world-copy"));
  function settle() {
    if (window.gsap) animated.forEach(node => {
      window.gsap.killTweensOf(node);
      window.gsap.set(node, { clearProps: 'opacity,transform' });
    });
  }
  function select(key, animate) {
    settle();
    worlds.forEach(world => { world.hidden = world.dataset.world !== key; });
    selectors.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.select === key)));
    const world = worlds.find(node => node.dataset.world === key);
    const copy = world?.querySelector('.world-copy');
    if (copy && animate && !reduced.matches && window.gsap) {

      window.gsap.fromTo(copy, { y: 16, opacity: .5 }, { y: 0, opacity: 1, duration: .45, ease: 'power2.out', clearProps: 'opacity,transform' });
    }
  }
  selectors.forEach(button => button.addEventListener('click', () => select(button.dataset.select, true)));
  root.querySelectorAll('[data-effect]').forEach(button => {
    const world = button.closest('[data-world]');
    button.addEventListener('click', () => {
      const enabled = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(enabled));
      world.classList.toggle('is-detail', enabled);
    });
    button.hidden = false;
  });
  if (selectors.length) {
    select('island', false);
    root.classList.add('showcase-ready');
  }
  const preferenceChange = () => { if (reduced.matches) settle(); };
  if (reduced.addEventListener) reduced.addEventListener('change', preferenceChange);
  else if (reduced.addListener) reduced.addListener(preferenceChange);
  window.addEventListener('pagehide', settle);
})();
