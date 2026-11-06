let loading;

export function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = () => {
      script.remove();
      loading = undefined;
      reject(new Error('Turnstile could not load'));
    };
    document.head.appendChild(script);
  });
  return loading;
}
